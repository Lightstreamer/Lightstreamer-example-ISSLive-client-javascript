import {DynaGrid, LightstreamerClient, Subscription} from 'lightstreamer-client-web/lightstreamer.esm'
import { ItemsCollection } from './ItemsCollection';

declare var $:any;

var SCHEMA = ["TimeStamp","Value","Status.Class","Status.Indicator","Status.Color","CalibratedData"];
var DEFAULT_SUBSCRIPTIONS = ["TIME_000001","AIRLOCK000049","NODE3000005","NODE3000008","NODE3000009","S0000005","AIRLOCK000005","P1000003"];

var FREQUENCY_VALUES = [0.1, 0.2, 0.4, 0.5, 1, 2, 5, 10, 20, "unlimited"];
var INITIAL_FRQUENCY = FREQUENCY_VALUES.length-1;
  
var muls = [24,60,60];

function convertTime(v: number,mul: number): string {
  var toAdd = Math.floor(v);
  var next = v-toAdd;
  if ((toAdd+"").length == 1) {
    // @ts-ignore
    toAdd="0"+toAdd;
  }
  
  if (mul < muls.length) {
    return toAdd+(mul==0?"/":":")+convertTime(next*muls[mul],mul+1);
  }
  // @ts-ignore
  return toAdd;
}
  
type SubscriptionMap = { 
  [id: string]: Subscription; 
}

type BoolMap = { 
  [id: string]: boolean; 
}

export class Subscriber {
  grid: DynaGrid;
  items: ItemsCollection;
  subscriptions: SubscriptionMap;
  toDecorate: BoolMap;
  lsClient: LightstreamerClient;

  constructor(lsClient: LightstreamerClient, gridName: string,items: ItemsCollection) {
    this.lsClient = lsClient;
    this.items = items;
    this.subscriptions = {};
    this.toDecorate = {};
    
    
    this.grid = new DynaGrid(gridName, false);
    this.grid.setNodeTypes(["td"]);
    this.grid.addListener(this);
    
    $("#grid").show();
    this.grid.parseHtml();

    for (var i = 0; i < DEFAULT_SUBSCRIPTIONS.length; i++) {
      this.add(DEFAULT_SUBSCRIPTIONS[i]);
    }
  }
  
  add(itemName: string) {
    console.log("Subscribing " + itemName);
    if (this.subscriptions[itemName]) {
      console.log("item already subscribed");
      return;
    }
    
    var itemObj = this.items.getItem(itemName);
    if (!itemObj) {
      console.log("item does not exists");
      return;
    }
    
    var subscription = new Subscription("MERGE",itemName, SCHEMA);
    subscription.setRequestedSnapshot("yes");
    // @ts-ignore
    subscription.setRequestedMaxFrequency(FREQUENCY_VALUES[INITIAL_FRQUENCY]);
    subscription.addListener(this.grid);
    
    this.toDecorate[itemName] = true;
    this.subscriptions[itemName] = subscription;
    itemObj.subscribed = true;
    
    this.grid.updateRow(itemName,{Name:itemName, Discipline:itemObj.discipline, Description:itemObj.description});
    this.lsClient.subscribe(subscription);
    
    
  }
  
  remove(itemName: string) {
    console.log("Unsubscribing " + itemName);
    if (!this.subscriptions[itemName]) {
      console.log("item not subscribed");
    }
    
    var itemObj = this.items.getItem(itemName);
    
    itemObj.subscribed = false;
    
    
    this.lsClient.unsubscribe(this.subscriptions[itemName]);
    this.grid.removeRow(itemName);
    delete(this.subscriptions[itemName]);
    delete(this.toDecorate[itemName]);//just in case
    
  }
  
  isSubscribed(itemName: string) {
    return this.subscriptions[itemName] != null;
  }
  
  onVisualUpdate(itemName: string,visualUpdate: any,domNode: any) {
    
    if (this.toDecorate[itemName]) {
      var that = this;
      
      $(domNode).find(".unsubscribeButton").click(function() {
        that.remove(itemName);
      });

      
      $(domNode).find(".slider").slider({
        animate: true,
        min: 0,
        max: FREQUENCY_VALUES.length-1,
        step: 1, 
        values: [ INITIAL_FRQUENCY ],
        slide: function( event: any, ui: any ) {
          $(domNode).find(".frequency").text(FREQUENCY_VALUES[ui.value]);
        },
        change: function(event: any, ui: any) { 
          $(domNode).find(".frequency").text(FREQUENCY_VALUES[ui.value]);
          that.changeFrequency(itemName,FREQUENCY_VALUES[ui.value]);
        }
      });
      $(domNode).find(".frequency").text(FREQUENCY_VALUES[INITIAL_FRQUENCY]);

      delete(this.toDecorate[itemName]);
    }
    
    
    var hours = visualUpdate.getChangedFieldValue("TimeStamp");
    if (hours !== null) {
      var days = hours/24;
      
      /* expanded version:
      var rDays = Math.floor(days);
      var hoursInDays = days-rDays;
      hours = hoursInDays*24;
      var rHours = Math.floor(hours);
      var minInHours = hours-rHours;
      var minutes = minInHours*60;
      var rMinutes = Math.floor(minutes);
      var secondsInMinutes = minutes-rMinutes;
      var rSeconds = Math.floor(secondsInMinutes*60);
      visualUpdate.setCellValue("TimeStamp",rDays+"/"+rHours+":"+rMinutes+":"+rSeconds);
      */
      
      /* quick version
      var val = hours*60*60*1000;
      var date = new Date(val);
      //requires formatting
      */
      
      //compressed version
      var val = convertTime(days,0);
      visualUpdate.setCellValue("TimeStamp",val);
      

      
    }

  }
  
  changeFrequency(itemName: string,frequency: any) {
    if (!this.subscriptions[itemName]) {
      console.log("item not subscribed");
    }
    var subscription = this.subscriptions[itemName];
    subscription.setRequestedMaxFrequency(frequency);
  }
}
