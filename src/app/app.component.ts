import { Component } from '@angular/core';
import { lsClient } from './lsClient';
import { Discipline, ItemsCollection } from './ItemsCollection';
import { Subscriber } from './Subscriber';

declare var $:any;

interface Row {
  name: string, 
  items: Array<Discipline>, 
  expanded: boolean
}

type RowMap = { 
  [id: string]: Row; 
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  disciplines: Array<Row> = [];
  currentlyExpandedDiscipline: Row | null = null;
  subscriptionHandler: Subscriber | null = null;

  constructor() {
    var items = new ItemsCollection("assets/PUIList.xml",(items) => {
      var subscriptions = new Subscriber(lsClient, "grid",items);
      this.setup(subscriptions,items);
    });
  }

  expandDiscipline(discipline: Row) {
    if(this.currentlyExpandedDiscipline) {
      this.currentlyExpandedDiscipline.expanded = false;
      if (discipline == this.currentlyExpandedDiscipline) {
        this.currentlyExpandedDiscipline = null;
        return;
      } 
    }
    discipline.expanded = true;
    this.currentlyExpandedDiscipline = discipline;
  }

  subscribe(itemName: string) {
    if (!this.subscriptionHandler) {
      return;
    }
    if (this.subscriptionHandler.isSubscribed(itemName)) {
      this.subscriptionHandler.remove(itemName);
    } else {
      this.subscriptionHandler.add(itemName);
    }
  }

  setup(subscriptionHandler: Subscriber,items: ItemsCollection) {
    this.subscriptionHandler = subscriptionHandler;
    
    var disciplines: RowMap = {};
    items.forEachItem(function(item: Discipline) {
      if (!disciplines[item.discipline]) {
        disciplines[item.discipline] = {name: item.discipline, items:[], expanded: false};
      }
      disciplines[item.discipline].items.push(item);
    });
    
    for (var i in disciplines) {
      this.disciplines.push(disciplines[i]);
    }
    
    this.ready();
  }

  ready() {
    // hack to add the tooltips only after the owning html elements are created
    setTimeout(() =>
      $('[data-tooltip!=""]').qtip({ 
        content: {
            attr: 'data-tooltip' 
        },
        position: {
          my: 'bottom left', 
          at: 'top right', 
          target: "mouse"
        }
      })
    );
  }
}
