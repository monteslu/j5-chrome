var $ = require('jquery');
var _ = require('lodash');
var five = require('johnny-five');
var firmata = require('firmata');
var skynet = require('skynet');
var SerialPort = require('browser-serialport').SerialPort;

window.$ = $;
window._ = _;
window.five = five;
window.firmata = firmata;
window.skynet = skynet;

var connectedSerial, io;


console.log('launching sandbox');



window.alert = function(){};

function cleanResult(result, name){
  if((typeof result != 'object') && (!Array.isArray(result))){
    return {payload: result};
  }
  return result;
}

window.addEventListener('message', function(event) {
  //console.log('sandbox message received', event.data);
  var command = event.data.command;
  if(command == 'runScript') {
      var portName = event.data.portName;
      var error = null;
      var respObj = {
        command: 'handleResponse'
      };

      function runScript(fstr){
        eval("var results = (function(msg){"+fstr+"\n})(msg);");
        return results;
      }

      function reply(){
        event.source.postMessage(respObj, event.origin);
      }

      function startupJ5(){
        connectedSerial = new SerialPort(portName, {
                              baudrate: 57600,
                              buffersize: 1
                          });
        io = new firmata.Board(connectedSerial);
        board = new five.Board(io);
        board.on('ready', function(){
          try{
            runScript(event.data.functionStr);
            respObj.result = 'ok';
            reply();
          }catch(e){
            respObj.error = '' + e;
            reply();
          }
        });
        board.on('error', function(err){
          respObj.error = '' + e;
          reply();
        });
      }

      if(connectedSerial){
        connectedSerial.close(startupJ5);
      }
      else{
        startupJ5();
      }




  }
});
