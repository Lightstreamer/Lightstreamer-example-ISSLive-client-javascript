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

define(function() {
  
  var ItemsCollection = function(url,onReady) {
    this.items = {};
    this.onReady = onReady;
    this.load(url);
  };
  
  ItemsCollection.prototype = {
      
    load: function(url) {
      $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        global: false,
        context: this,
        success: this.onLoad,
        error: this.onLoadError,
      });
    },
    
    onLoad: function(xml) {
      var that = this;
      $(xml).find('Discipline').each(function(){
        var disciplineName = $(this).attr("name");
        
         $(this).find("Symbol").each(function(){
           var item = $(this).find("Public_PUI").text();
           var desc = $(this).find("Description").text();
           
           var itemObj = { discipline: disciplineName, name:item, description: desc, subscribed: false };
           that.items[item] = itemObj;
           
         });
         
      });
      
      this.onReady(this);
      
    },
    onLoadError: function() {
      //TODO
    },
    
    getItem: function(itemName) {
      return this.items[itemName];
    },
    
    forEachItem: function(callback) {
      for (var i in this.items) {
        callback(this.items[i]);
      }
    }
      
  };
  
  return ItemsCollection;
  
});