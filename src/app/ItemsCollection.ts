declare var $:any;

export interface Discipline {
  discipline: string, 
  name: string, 
  description: string, 
  subscribed: boolean,
  expanded: boolean
}

type DisciplineMap = { 
  [id: string]: Discipline; 
}
  
export class ItemsCollection {
  items: DisciplineMap;
  onReady: (items: ItemsCollection)=>void;

  constructor(url: string, onReady: (items: ItemsCollection)=>void) {
    this.items = {};
    this.onReady = onReady;
    this.load(url);
  }
    
  load(url: string) {
    $.ajax({
      type: "GET",
      url: url,
      dataType: "xml",
      global: false,
      context: this,
      success: this.onLoad,
      error: this.onLoadError,
    });
  }

  onLoad(xml: any) {
    var that = this;
    $(xml).find('Discipline').each(function(){
      // @ts-ignore
      var disciplineName = $(this).attr("name");

        // @ts-ignore
        $(this).find("Symbol").each(function(){
          // @ts-ignore
          var item = $(this).find("Public_PUI").text();
          // @ts-ignore
          var desc = $(this).find("Description").text();
          
          var itemObj = { discipline: disciplineName, name:item, description: desc, subscribed: false, expanded: false };
          that.items[item] = itemObj;
          
        });
        
    });
    
    this.onReady(this);
    
  }

  onLoadError() {
    console.error(arguments)
  }
  
  getItem(itemName: string) {
    return this.items[itemName];
  }
  
  forEachItem(callback: any) {
    for (var i in this.items) {
      callback(this.items[i]);
    }
  }
    
}
