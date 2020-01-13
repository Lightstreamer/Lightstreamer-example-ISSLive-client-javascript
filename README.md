# Lightstreamer - ISSLive Demo - HTML Client

The Lightstreamer ISSLive Demo is a simple dashboard application fed with live telemetry data from the [International Space Station](https://www.nasa.gov/mission_pages/station/main/).

## Live Demo

[![screenshot](snapshot_large.png)](http://demos.lightstreamer.com/ISSLive)

### [![](http://demos.lightstreamer.com/site/img/play.png) View live demo](http://demos.lightstreamer.com/ISSLive)

## Details

This *ISSLive Demo* shows a simple dashboard containing a list of items, which can be subscribed with a click against the 
public Lightstreamer Server at push.lightstreamer.com. The incoming data is retrieved by such Lightstreamer Server from a public NASA feed and bridged 
to the clients subscribing to it: 
the pushed data is not simulated, is the actual telemetry data from the International Space Station.

The demo contains a list of categories: select a category to show the list of available symbols. Both categories and symbols are currently hard coded into the application;
you can check out the full dictionary on the [official ISS Live! website](http://www.isslive.com). 

Each symbol is represented as an item in the Lightstreamer data model: single-item subscriptions are used to add/remove elements to the list of monitored symbols.
Through the Lightstreamer client library it is possible to limit the frequency of the updates per each single item and the bandwidth of the whole dashboard: 
sliders to control such aspects are available in this demo.

A minimal version of this application is also available on this project under the src_minimal folder (you can [see it live here](http://demos.lightstreamer.com/ISSLive/issmin.html) ). This version is only comprised of a single html file that subscribes to a fixed set of symbols (the space station position and velocity data): you can use it as 
an "hello world" to help you write your own client application based on the data offered by the public server.

## Install

The adapter set used by this demo application is not available to be installed on a local Lightstreamer Server. As per now, and for the foreseeable future, the
server hosted at push.lightstreamer.com can be used to feed a local version of the client application.

* Download this project.
* Deploy this demo on the Lightstreamer Server (used as Web server) or in any external Web Server: copy there the contents of the `/src` folder of this project.
The client demo configuration is already pointing to the correct Lightstreamer Server.
* Lightstreamer JS client, RequireJS, AngularJS and jQuery are currently hot-linked in the html page: you may want to replace them with a local version and/or to 
upgrade their version.
* Open your browser and point it to to the newly deployed folder.

## See Also

* [ISS Live!](http://www.isslive.com)
* [Space Station Telemetry App 2015 Challenge](https://2015.spaceappschallenge.org/challenge/space-station-telemetry-app/)

## Lightstreamer Compatibility Notes

* Compatible with Lightstreamer JavaScript Client library version 8.0 or newer.

* For a version of this example compatible with Lightstreamer SDK for JavaScript Clients version 7.x or earlier, please refer to [this tag](https://github.com/Lightstreamer/Lightstreamer-example-ISSLive-client-javascript/releases/tag/latest-for-client-7.x).
