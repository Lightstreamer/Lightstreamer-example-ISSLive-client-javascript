/*
  Copyright 2015 Weswit Srl

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
  
  return {
    disciplines: [],
    
    setScope: function($scope) {
      this.$scope = $scope;
      $scope.disciplines = this.disciplines;
      
     
      var currentlyExpandedDiscipline = null;
      $scope.expandDiscipline = function(discipline) {
        if(currentlyExpandedDiscipline) {
          currentlyExpandedDiscipline.expanded = false;
          if (discipline == currentlyExpandedDiscipline) {
            currentlyExpandedDiscipline = null;
            return;
          } 
        }
        discipline.expanded = true;
        currentlyExpandedDiscipline = discipline;
      };
      
      var that = this;
      $scope.subscribe = function(itemName) {
        if (that.subscriptionHandler.isSubscribed(itemName)) {
          that.subscriptionHandler.remove(itemName);
        } else {
          that.subscriptionHandler.add(itemName);
        }
      };
      
      if (this.subscriptionHandler) {
        this.ready();
      }
    },
    
    setup: function(subscriptionHandler,items) {
      
      this.subscriptionHandler = subscriptionHandler;
      
      var disciplines = {};
      items.forEachItem(function(item) {
        if (!disciplines[item.discipline]) {
          disciplines[item.discipline] = {name: item.discipline, items:[], expanded: false};
        }
        disciplines[item.discipline].items.push(item);
      });
      
      //TODO can I make angular iterate through an object instead of iterating on the array?
      for (var i in disciplines) {
        this.disciplines.push(disciplines[i]);
      }
      
      if (this.$scope) {
        this.ready();
      }
      
    },
    
    ready: function() {
      this.$scope.$apply();
      
      $('[data-tooltip!=""]').qtip({ 
        content: {
            attr: 'data-tooltip' 
        },
        position: {
          my: 'bottom left', 
          at: 'top right', 
          target: "mouse"
        }
      });
    }
    
  };
});