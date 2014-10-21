var $ = require('jquery');
var _ = require('lodash');
var five = require('johnny-five');
var firmata = require('firmata');
var skynet = require('skynet');
var SerialPort = require('./lib/postSerial').SerialPort;

var Repl = require('johnny-five/lib/repl');
Repl.isBlocked = true;

window.$ = $;
window._ = _;
window.five = five;
window.firmata = firmata;
window.skynet = skynet;

var connectedSerial, io, board;


console.log('launching sandbox');


window.alert = function(){};

function cleanResult(result, name){
  if((typeof result != 'object') && (!Array.isArray(result))){
    return {payload: result};
  }
  return result;
}

function log(text, type){
  var msg = {
    command: 'info',
    text: String(new Date()) + ' : ' + String(text),
    type: type || 'success'
  };
  window.parent.postMessage(msg, '*');
}

window.addEventListener('message', function(event) {
  var source = event.source;
  //console.log('sandbox message received', event.data);
  var command = event.data.command;
  var data = event.data;
  if(command === 'runScript') {
      var error = null;

      function runScript(fstr){
        console.log('running script');
        eval("var results = (function(){"+fstr+"\n})();");
        return results;
      }


      connectedSerial = new SerialPort(window.parent);
      log('connecting...', 'warning');

      io = new firmata.Board(connectedSerial, {repl: false, skipHandshake: false, samplingInterval: 300});
      io.once('ready', function(ir){
        console.log('io ready', ir);
        log('connect success');
        io.name = 'fake serial';
        io.isReady = true;
        io.ready = true;
        board = new five.Board({io: io, repl: false});
        //board.on('ready', function(fr){
          //console.log('five ready', fr)
        try{
          runScript(event.data.functionStr);
          log('script run ok');
        }catch(e){
          log(e, 'danger');
        }
        //});
        board.on('error', function(err){
          log(e, 'danger');
        });
      });
      io.on('error', function(err){
        log(e, 'danger');
      });



  } else if(command === 'serial'){
    //console.log('serial into sandbox', data, connectedSerial);
    if(connectedSerial && data && data.data){
      connectedSerial.simulateRead(data.data);
    }

  }
});

window.parent.postMessage({
    command: 'ready'
}, '*');
