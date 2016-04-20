'use strict';

var cache = {
  "firmata": require('firmata'),
  "johnny-five": require('johnny-five'),
  "johnny-five/lib/repl": require('johnny-five/lib/repl'),
  "keypress": require('keypress'),
  "leapjs": require('leapjs'),
  "lodash": require('lodash'),
  "meshblu": require('meshblu'),
  "mqtt": require('mqtt'),
  "mqtt-serial": require('mqtt-serial'),
  "node-pixel": require('node-pixel'),
  "oled-js": require('oled-js'),
  "request": require('browser-request'),
  "rest": require('rest'),
  "rest/interceptor": require('rest/interceptor'),
  "rest/interceptor/errorCode": require('rest/interceptor/errorCode'),
  "rest/interceptor/pathPrefix": require('rest/interceptor/pathPrefix'),
  "rest/interceptor/entity": require('rest/interceptor/entity'),
  "rest/interceptor/mime": require('rest/interceptor/mime'),
  "socket.io-client": require('socket.io-client'),
  "socket.io-serial": require('socket.io-serial'),
  "temporal": require('temporal'),
  "tharp": require('tharp'),
  "vektor": require('vektor')
};

function cachedRequire(packageName){
  return cache[packageName];
}

module.exports = cachedRequire;
