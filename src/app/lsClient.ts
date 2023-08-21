import {ConsoleLogLevel, ConsoleLoggerProvider, LightstreamerClient, StatusWidget} from 'lightstreamer-client-web/lightstreamer.esm'

declare var $:any;

LightstreamerClient.setLoggerProvider(new ConsoleLoggerProvider(ConsoleLogLevel.WARN));

export const lsClient = new LightstreamerClient("https://push.lightstreamer.com","ISSLIVE");
lsClient.addListener(new StatusWidget("left", "0px", true));
lsClient.addListener({
  onStatusChange: function(newStatus) {
    console.log("Client status:" + newStatus);
  }
});
lsClient.connect();

var MAX_BW = 100.5;
var INIT_BW = MAX_BW;

function formatBandwidthValue(value: number) {
  if (value == MAX_BW) {
    return "unlimited";
  } else if (Math.round(value) == value ) {
    return value+".0"; 
  } else {
    return value;
  }
}

$("#bandwidthSlider").slider({
  animate: true,
  min: 0.5,
  max: MAX_BW,
  step: 1, 
  values: [ INIT_BW ],
  slide: function( event: any, ui: any ) {
    $("#currentRequestedBandwidth").text(formatBandwidthValue(ui.value));
  },
  change: function(event: any, ui: any) { 
    var v = formatBandwidthValue(ui.value);
    $("#currentRequestedBandwidth").text(v);
    // @ts-ignore
    lsClient.connectionOptions.setRequestedMaxBandwidth(v);
  }
});

var initialValue = formatBandwidthValue(INIT_BW);
// @ts-ignore
lsClient.connectionOptions.setRequestedMaxBandwidth(initialValue);
$("#currentRequestedBandwidth").text(initialValue);