/*
  Copyright (c) Lightstreamer Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

define(["Subscription","DynaGrid","./lsClient","./domReady!"],
    function(Subscription,DynaGrid,lsClient) {
  
  var SCHEMA = ["TimeStamp","Value","Status.Class","Status.Indicator","Status.Color","CalibratedData"];
  var DEFAULT_SUBSCRIPTIONS = ["TIME_000001","AIRLOCK000049"];

  var FREQUENCY_VALUES = [0.1, 0.2, 0.4, 0.5, 1, 2, 5, 10, 20, "unlimited"];
  var INITIAL_FRQUENCY = FREQUENCY_VALUES.length-1;
  
  var genericListener = {
      onItemUpdate: function(updateObject) { 
        
        console.log("Update for " + updateObject.getItemName());
        
        updateObject.forEachChangedField(function(name,pos,val) {
          console.log("* " + name + ": " + val);
        });
      }
  };
  
  var muls = [24,60,60];
  function convertTime(v,mul) {
    var toAdd = Math.floor(v);
    var next = v-toAdd;
    if ((toAdd+"").length == 1) {
      toAdd="0"+toAdd;
    }
    
    if (mul < muls.length) {
      return toAdd+(mul==0?"/":":")+convertTime(next*muls[mul],mul+1);
    }
    return toAdd;
  }
  
  
  var Subscriber = function(gridName,items) {
    this.items = items;
    this.subscriptions = {};
    this.toDecorate = {};
    
    
    this.grid = new DynaGrid(gridName);
    this.grid.setNodeTypes(["td"]);
    this.grid.addListener(this);
    
    $("#grid").show();
    this.grid.parseHtml();

    for (var i = 0; i < DEFAULT_SUBSCRIPTIONS.length; i++) {
      this.add(DEFAULT_SUBSCRIPTIONS[i]);
    }
  };
  
  Subscriber.prototype = {
    add: function(itemName) {
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
      subscription.setRequestedMaxFrequency(FREQUENCY_VALUES[INITIAL_FRQUENCY]);
      subscription.addListener(this.grid);
      
      //subscription.addListener(genericListener);
      
      this.toDecorate[itemName] = true;
      this.subscriptions[itemName] = subscription;
      itemObj.subscribed = true;
      
      this.grid.updateRow(itemName,{Name:itemName, Discipline:itemObj.discipline, Description:itemObj.description});
      lsClient.subscribe(subscription);
     
     
    },
    
    remove: function(itemName) {
      console.log("Unsubscribing " + itemName);
      if (!this.subscriptions[itemName]) {
        console.log("item not subscribed");
      }
      
      var itemObj = this.items.getItem(itemName);
      
      itemObj.subscribed = false;
      
      
      lsClient.unsubscribe(this.subscriptions[itemName]);
      this.grid.removeRow(itemName);
      delete(this.subscriptions[itemName]);
      delete(this.toDecorate[itemName]);//just in case
      
    },
    
    isSubscribed: function(itemName) {
      return this.subscriptions[itemName] != null;
    },
    
    onVisualUpdate: function(itemName,visualUpdate,domNode) {
      
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
          slide: function( event, ui ) {
            $(domNode).find(".frequency").text(FREQUENCY_VALUES[ui.value]);
          },
          change: function(event, ui) { 
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

    },
    
    changeFrequency: function(itemName,frequency) {
      if (!this.subscriptions[itemName]) {
        console.log("item not subscribed");
      }
      var subscription = this.subscriptions[itemName];
      subscription.setRequestedMaxFrequency(frequency);
    }
  };
  
  
  return Subscriber;
  
});