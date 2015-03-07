window.repl = {}; // fake it til you make it

var $ = require('jquery');
var _ = require('lodash');
var five = require('johnny-five');
var firmata = require('firmata');
var SerialPort = require('./lib/postSerial');

var Repl = require('johnny-five/lib/repl');
Repl.prototype.initialize = function(callback){
  console.log('repl initialize stub');
  callback();
}

window.$ = $;
window._ = _;
window.five = five;
window.firmata = firmata;

var connectedSerial, io, board;

console.log('launching sandbox');

//browserify should shim stdin
process.stdin = process.stdin || {};
process.stdin.resume = function(){};
process.stdin.setEncoding = function(){};
process.stdin.once = function(){};


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
      console.log('io ready');
      log('connect success');
      io.name = 'Firmata';
      io.isReady = true;

      try {
        var f = new Function(payload);
        f();
        log('script run ok');
      } catch(e){
        log(e, 'danger');
      }
    });
    io.on('error', function(err){
      log(e, 'danger');
    });
  }
});

window.parent.postMessage({ command: 'ready' }, '*');
