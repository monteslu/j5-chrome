'use strict';

var storage = require('localforage');

var DEFAULT_SCRIPT = '/* \n'
  + ' You have the following variables available to your script:\n\n'
  + ' io  = the firmata instance for the connected hardware\n'
  + ' require  = subset of the NodeJS require with bundled robotics, IoT, and utility libs \n'
  + '*/ \n\n'
  + 'var five = require(\'johnny-five\');\n\n'
  + 'var board = new five.Board();\n\n'
  + 'board.on(\'ready\', function(){\n'
  + '  // Default to pin 13\n'
  + '  var led = new five.Led(13);\n'
  + '  led.blink(1000);\n'
  + '});\n\n';

var SCRIPT_NAME = 'scripttext';

function getScript(callback){
  storage.getItem(SCRIPT_NAME, function(err, data){
    if(!data || data === ''){
      return callback(null, DEFAULT_SCRIPT);
    }

    callback(null, data);
  })
}

function setScript(scriptText, callback){
  storage.setItem(SCRIPT_NAME, scriptText);
  callback();
}

module.exports = {
  get: getScript,
  set: setScript
};
