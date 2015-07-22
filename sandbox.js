window.repl = {}; // fake it til you make it

//ugh, just ugh
delete window.localStorage;
delete window.beforeunload;

var browserbots = require('browserbots');
console.log('browserbots', browserbots);
var keypress = require('keypress');
process.stdin = require('./lib/stdin');
var SerialPort = require('./lib/postSerial');

var cachedRequire = require('./lib/cachedRequire');
var five = cachedRequire('johnny-five');
var firmata = cachedRequire('firmata');

var Repl = cachedRequire('johnny-five/lib/repl');
Repl.prototype.initialize = function(callback){
  console.log('repl initialize stub');
  callback();
};


window.five = five;
var require = cachedRequire
window.require = require;

window.browserbots = browserbots;

var connectedSerial, io, board;

console.log('launching sandbox');


var process = window.process = process;
process.exit = function(){};

function log(text, type){
  var msg = {
    command: 'info',
    text: String(new Date()) + ' : ' + String(text),
    type: type || 'success'
  };
  window.parent.postMessage(msg, '*');
}

window.log = log;

window.addEventListener('message', function(event) {
  var data = event.data;
  var command = data && data.command;
  var payload = data && data.payload;
  if(command === 'runScript' && payload) {

    connectedSerial = new SerialPort(window.parent);
    log('connecting...', 'info');
    window.io = io = new firmata.Board(connectedSerial, {repl: false, skipHandshake: false, samplingInterval: 300});
    io.once('ready', function(ir){
      log('io connection success');
    });
    io.on('error', function(err){
      log('io error ' + e, 'danger');
    });

    try{
      //execute user's script
      var f = new Function(payload);
      f();
      log('script executed');
    } catch(e){
      log(e, 'danger');
    }
  }

  else if(command === 'keypress' && payload){
    console.log('keypress', payload);
    process.stdin.emit('data', new Buffer([parseInt(payload)]));
  }

});

window.parent.postMessage({ command: 'ready' }, '*');
