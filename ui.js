var $ = require('jquery');

var SerialPort = require('browser-serialport').SerialPort;

var selectList;
var connectedSerial;
var sandboxWindow, sandboxFrame;
var queuedMsg;
var infoQueue = [];
var INFO_QUEUE_SIZE = 15;

var Editor = require('./views/editor.jsx');
var Devices = require('./views/devices.jsx');
require('./styles.less');

var React = require('react');

var editor = React.render(React.createElement(Editor), document.getElementById('editor'));
startApp();
var serialSelect;

function createSandbox(){
  var sandbox = document.createElement('iframe');
  sandbox.src = 'sandbox.html';
  sandbox.style.display = 'none';
  document.body.appendChild(sandbox);
  return sandbox;
}

function startApp(){
  console.log('starting app');
  sandboxFrame = createSandbox();
  sandboxWindow = sandboxFrame.contentWindow;

  loadDevices();
  $("#refreshBtn").click(loadDevices);
  $("#runBtn").click(runCode);

  window.addEventListener('message', function(event) {
    var data = event.data;
    var command = data && data.command;
    var payload = data && data.payload;
    if(command === 'open'){
      console.log(data);
    }
    if(command === 'write' && connectedSerial && payload) {
      connectedSerial.write(payload, function(err){});
    } else if(command === 'ready'){
      $("#runBtn").prop("disabled",false);
      if(queuedMsg){
        sandboxWindow.postMessage(queuedMsg, '*');
        queuedMsg = null;
      }
    } else if(command === 'info'){
      if(data.text){
        infoQueue.unshift(data);
        if(infoQueue.length > INFO_QUEUE_SIZE){
          infoQueue.pop();
        }
      }
      //TODO use a react view.
      var infoArea = document.getElementById('infoArea');
      infoArea.innerHTML = '';
      infoQueue.forEach(function(info){
        var infoMsg = document.createElement("div");
        //TOTO sanitize message, or use a proper view tech
        infoMsg.innerHTML = info.text;
        infoMsg.className = 'alert thinAlert alert-' + info.type;
        infoArea.appendChild(infoMsg);
      });
    }
  });

}

function loadDevices(){

  chrome.serial.getDevices(function (devices) {
    console.log(devices);
    serialSelect = React.render(React.createElement(Devices, { devices: devices }), document.getElementById('devices'));
  });

}

function runCode(){
  $("#runBtn").prop("disabled",true);
  infoQueue = [];
  document.getElementById('infoArea').innerHTML = '';
  if(connectedSerial){
    connectedSerial.on('close', function(){
      setTimeout(startupJ5, 1000);
    });
    connectedSerial.close();
  }
  else{
    startupJ5();
  }

}

function startupJ5(){
  connectedSerial = new SerialPort(serialSelect.state.selectedDevice, {
    baudrate: 57600,
    buffersize: 1
  });
  connectedSerial.on('data', function(data){
    sandboxWindow.postMessage({
      command: 'write',
      payload: data
    }, '*');
  });

  console.log('posting runScript');
  queuedMsg = {
    command: 'runScript',
    payload: editor.state.content
  };
  sandboxFrame.src = sandboxFrame.src + '';
}
