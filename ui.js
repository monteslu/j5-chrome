var $ = require('jquery');
var _ = require('lodash');

var SerialPort = require('browser-serialport').SerialPort;

window.$ = $;
window.jQuery = $;
window._ = _;

var selectList;
var connectedSerial;
var sandboxWindow, sandboxFrame;
var queuedMsg;
var infoQueue = [];
var INFO_QUEUE_SIZE = 15;

var DEFAULT_SCRIPT = '/* \n'
  + ' This script is executed when johnny-five is connected\n\n'
  + ' You have the following variables availaible to your script:\n'
  + '   five  = The full johnny-five API !\n'
  + '   board = this connected johnny-five instance\n'
  + '   io    = the firmata instance for the board\n'
  + '   $     = jQuery, because you might already know jQuery\n'
  + '   _     = lodash, because lodash is awesome\n'
  + '*/ \n\n\n'
  + '// Default to pin 13\n'
  + 'var led = new five.Led(13);\n'
  + 'led.blink();';



function startApp(){
  console.log('starting app');
  sandboxFrame = document.getElementById('sandboxFrame');
  sandboxWindow = sandboxFrame.contentWindow;

  //TODO handle this with bootstrap?
  $( window ).resize(resizeEditor);
  resizeEditor();
  loadDevices();
  $("#refreshBtn").click(loadDevices);
  $("#runBtn").click(runCode);
  setEditorText();

  window.addEventListener('message', function(event) {
    var source = event.source;
    //console.log('sandbox message received', event.data);
    var command = event.data.command;
    var data = event.data;
    if(command === 'serial' && connectedSerial && data.data) {
      //console.log('serial into ui', event.data);
      connectedSerial.write(data.data, function(err){
        //console.log('wrote data', data, err);
      });
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
      _.forEach(infoQueue, function(info){
        var infoMsg = document.createElement("div");
        //TOTO sanitize message, or use a proper view tech
        infoMsg.innerHTML = info.text;
        infoMsg.className = 'alert thinAlert alert-' + info.type;
        infoArea.appendChild(infoMsg);
      });
    }
  });

}

function setEditorText(){
  window.funcEditor.setText(DEFAULT_SCRIPT);
}

function resizeEditor(){
  console.log('resizing');
  $("#input-func-editor").css("height",($( window ).height()-220)+"px");
}

function loadDevices(){

  chrome.serial.getDevices(function (queriedPorts) {
    console.log(queriedPorts);
    ports = queriedPorts;


    selectList = document.getElementById('serialSelect');

    //remove any existing
    $("#serialSelect option").each(function() {
      //console.log('removing');
      $(this).remove();
    });

    //Create and append the options
    for (var i = 0; i < ports.length; i++) {
        console.log('port', ports[i]);
        var option = document.createElement("option");
        option.value = ports[i].path;
        option.text = ports[i].path;
        selectList.appendChild(option);

    }

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

  connectedSerial = new SerialPort($( "#serialSelect" ).val(), {
    baudrate: 57600,
    buffersize: 1
  });
  connectedSerial.on('data', function(data){
    sandboxWindow.postMessage({
      command: 'serial',
      data: data
    }, '*');
  });

  console.log('posting runScript');
  queuedMsg = {
    command: 'runScript',
    functionStr: window.funcEditor.getText()
  };
  sandboxFrame.src = sandboxFrame.src + '';

}

window.startApp = startApp;
