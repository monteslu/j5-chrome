var $ = require('jquery');
var _ = require('lodash');
var five = require('johnny-five');
var firmata = require('firmata');
var skynet = require('skynet');
var SerialPort = require('./lib/postSerial').SerialPort;

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
  var source = event.source;
  //console.log('sandbox message received', event.data);
  var command = event.data.command;
  if(command === 'runScript') {
      var portName = event.data.portName;
      var error = null;
      var respObj = {
        command: 'handleResponse'
      };

      function runScript(fstr){
        eval("var results = (function(){"+fstr+"\n})();");
        return results;
      }

      function reply(){
        event.source.postMessage(respObj, event.origin);
      }


      connectedSerial = new SerialPort(event.source, event.origin);
      console.log('starting firmata');

      io = new firmata.Board(connectedSerial, {repl: false, skipHandshake: true});
      io.on('ready', function(ir){
        console.log('io ready', ir);
      });
      io.on('error', function(err){
        respObj.error = '' + e;
        reply();
      });

      board = new five.Board({io: io, repl: false});
      //board.on('ready', function(fr){
        //console.log('five ready', fr)
        try{
          runScript(event.data.functionStr);
          respObj.result = 'ok';
          reply();
        }catch(e){
          respObj.error = '' + e;
          reply();
        }
      //});
      board.on('error', function(err){
        respObj.error = '' + e;
        reply();
      });


  } else if(command === 'serial'){
    console.log('serial into sandbox', event.data);
    if(connectedSerial && event.data && event.data.data){
      connectedSerial.simulateRead(event.data.data);
    }

  }
});
