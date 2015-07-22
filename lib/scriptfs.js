'use strict';

var DEFAULT_SCRIPT = '/* \n'
  + ' You have the following variables available to your script:\n\n'
  + ' io  = the firmata instance for the connected hardware\n'
  + ' browserbots  = namespace of APIs and controls to use in your script\n'
  + ' require  = subset of the NodeJS require with bundled robotics, IoT, and utility libs \n'
  + '*/ \n\n'
  + 'var five = require(\'johnny-five\');\n\n'
  + 'var board = new five.Board({io: io});\n\n'
  + 'board.on(\'ready\', function(){\n'
  + '  // Default to pin 13\n'
  + '  var led = new five.Led(13);\n'
  + '  led.blink();\n'
  + '});\n\n'
  + 'board.on(\'error\', function(err){\n'
  + '  browserbots.speak(\'HEY! \' + err);\n'
  + '});\n';

var SCRIPT_NAME = 'scripttext';

function getScript(callback){
  chrome.storage.local.get(SCRIPT_NAME, function(data){
    if(!data[SCRIPT_NAME] || data[SCRIPT_NAME] === ''){
      return callback(null, DEFAULT_SCRIPT);
    }

    callback(null, data[SCRIPT_NAME]);
  })
}

function setScript(scriptText, callback){
  chrome.storage.local.set({scripttext: scriptText}, callback);
}

module.exports = {
  get: getScript,
  set: setScript
};
