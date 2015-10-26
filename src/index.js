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

function MenuController($scope) {
  $scope.active= false;
  require(["js/MenuController"],function(MenuController) {
    MenuController.setScope($scope);
    $scope.active= true;
  });
}



var MAX_BW = 100.5;
var INIT_BW = MAX_BW;
function formatBandwidthValue(value) {
  if (value == MAX_BW) {
    return "unlimited";
  } else if (Math.round(value) == value ) {
    return value+".0"; 
  } else {
    return value;
  }
}


require(["js/MenuController","js/ItemsCollection","js/Subscriber"], 
    function(MenuController,ItemsCollection,Subscriber) {
  
  
  var items = new ItemsCollection("PUIList.xml",function(items) {
    var subscriptions = new Subscriber("grid",items);
    MenuController.setup(subscriptions,items);
  });
    
  
});

require(["js/lsClient"],function(lsClient) {
  
  $("#bandwidthSlider").slider({
    animate: true,
    min: 0.5,
    max: MAX_BW,
    step: 1, 
    values: [ INIT_BW ],
    slide: function( event, ui ) {
      $("#currentRequestedBandwidth").text(formatBandwidthValue(ui.value));
    },
    change: function(event, ui) { 
      var v = formatBandwidthValue(ui.value);
      $("#currentRequestedBandwidth").text(v);
      lsClient.connectionOptions.setMaxBandwidth(v);
    }
  });
  
  var initialValue = formatBandwidthValue(INIT_BW);
  lsClient.connectionOptions.setMaxBandwidth(initialValue);
  $("#currentRequestedBandwidth").text(initialValue);
 
  
  
 
  
});