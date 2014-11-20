'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function SerialPort(parentWindow, options, openImmediately, callback) {
  var self = this;

  options = options || {};

  self.parent = parentWindow;
  self.window = options.window || window;
  self.targetOrigin = options.targetOrigin || '*';

  self.comName = 'postMessage';

  if(openImmediately !== false){
    process.nextTick(function(){
      self.open(callback);
    });
  }
}

util.inherits(SerialPort, EventEmitter);

SerialPort.prototype.connectionId = -1;

SerialPort.prototype.comName = "";

SerialPort.prototype.open = function (callback) {
  this.window.addEventListener('message', this.onRead.bind(this));
  this.parent.postMessage({ command: 'open' }, this.targetOrigin);
  this.emit('open');

  if(callback){
    callback();
  }
};

SerialPort.prototype.onRead = function(event) {
  var data = event.data;
  var command = data && data.command;
  var payload = data && data.payload;
  if(command === 'write' && payload){
    this.simulateRead(payload);
  }
};

SerialPort.prototype.simulateRead = function (data) {
  var uint8View = new Uint8Array(data);
  var string = '';
  for (var i = 0; i < data.byteLength; i++) {
    string += String.fromCharCode(uint8View[i]);
  }

  //Maybe this should be a Buffer()
  this.emit('data', uint8View);
  this.emit('dataString', string);
}

SerialPort.prototype.write = function (buffer, callback) {
  //Make sure its not a browserify faux Buffer.
  if (buffer instanceof ArrayBuffer == false) {
    buffer = buffer2ArrayBuffer(buffer);
  }

  this.parent.postMessage({ command: 'write', payload: buffer }, this.targetOrigin);

  if(callback){
    callback();
  }
};

SerialPort.prototype.writeString = function (string, callback) {
  this.write(str2ab(string), callback);
};

SerialPort.prototype.close = function (callback) {
  this.parent.postMessage({ command: 'close' }, this.targetOrigin);
  this.emit('close');

  if(callback){
    callback();
  }
};

SerialPort.prototype.flush = function (callback) {
  this.parent.postMessage({ command: 'flush' }, this.targetOrigin);
  this.emit('flush');

  if(callback){
    callback();
  }
};

// Convert string to ArrayBuffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert buffer to ArrayBuffer
function buffer2ArrayBuffer(buffer) {
  var buf = new ArrayBuffer(buffer.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < buffer.length; i++) {
    bufView[i] = buffer[i];
  }
  return buf;
}

module.exports = SerialPort;
