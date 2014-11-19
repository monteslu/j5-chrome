"use strict";

function SerialPort(parentWindow, myWindow) {
  console.log("SerialPort constructed.");
  this.parentWindow = parentWindow;
  this.myWindow = myWindow;

  var self = this;
  window.addEventListener('message', function(event) {
    var command = event.data.command;
    if(command === 'serial'){
      var data = event.data;
      if(data.data){
        self.simulateRead(data.data);
      }
    }

  });
}

SerialPort.prototype.connectionId = -1;

SerialPort.prototype.comName = "";

SerialPort.prototype.eventListeners = {};

SerialPort.prototype.open = function (callback) {
  console.log("Opening ", this.comName);
};

SerialPort.prototype.onOpen = function (callback, openInfo) {
  console.log("onOpen", callback, openInfo);

  this.publishEvent("open", openInfo);

  typeof callback == "function" && callback(openInfo);

};

SerialPort.prototype.simulateRead = function (data) {

  var uint8View = new Uint8Array(data);
  var string = "";
  for (var i = 0; i < data.byteLength; i++) {
    string += String.fromCharCode(uint8View[i]);
  }

  //console.log("Got data", string, data);

  //Maybe this should be a Buffer()
  this.publishEvent("data", uint8View);
  this.publishEvent("dataString", string);

}

SerialPort.prototype.write = function (buffer, callback) {
  if (typeof callback != "function") { callback = function() {}; }

  //Make sure its not a browserify faux Buffer.
  if (buffer instanceof ArrayBuffer == false) {
    buffer = buffer2ArrayBuffer(buffer);
  }
  //console.log('posting serial data', buffer);

  this.parentWindow.postMessage({
    command: 'serial',
    data: buffer
  }, '*');

};

SerialPort.prototype.writeString = function (string, callback) {
  this.write(str2ab(string), callback);
};

SerialPort.prototype.close = function (callback) {
  // chrome.serial.disconnect(this.connectionId, this.proxy('onClose', callback));
};

SerialPort.prototype.onClose = function (callback) {
  console.log("Closed port", arguments);
  this.publishEvent("close");
  typeof callback == "function" && callback(openInfo);
};

SerialPort.prototype.flush = function (callback) {

};

//Expecting: data, error
SerialPort.prototype.on = function (eventName, callback) {
  if (this.eventListeners[eventName] == undefined) {
    this.eventListeners[eventName] = [];
  }
  if (typeof callback == "function") {
    this.eventListeners[eventName].push(callback);
  } else {
    throw "can not subscribe with a non function callback";
  }
}

SerialPort.prototype.publishEvent = function (eventName, data) {
  if (this.eventListeners[eventName] != undefined) {
    for (var i = 0; i < this.eventListeners[eventName].length; i++) {
      this.eventListeners[eventName][i](data);
    }
  }
}

SerialPort.prototype.proxy = function () {
  var self = this;
  var proxyArgs = [];

  //arguments isnt actually an array.
  for (var i = 0; i < arguments.length; i++) {
      proxyArgs[i] = arguments[i];
  }

  var functionName = proxyArgs.splice(0, 1)[0];

  var func = function() {
    var funcArgs = [];
    for (var i = 0; i < arguments.length; i++) {
        funcArgs[i] = arguments[i];
    }
    var allArgs = proxyArgs.concat(funcArgs);

    self[functionName].apply(self, allArgs);
  }

  return func;
}


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

module.exports = {
  SerialPort: SerialPort,
  used: [] //TODO: Populate this somewhere.
};
