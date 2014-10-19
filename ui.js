var $ = require('jquery');
var _ = require('lodash');

var SerialPort = require('browser-serialport').SerialPort;

window.$ = $;
window.jQuery = $;
window._ = _;

var selectList;
var connectedSerial;
var sandboxWindow;

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

  //WOW this a nasty way to talk to the sandbox
  sandboxWindow = window.opener.document.getElementById('sandboxFrame').contentWindow;


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
    var data = event.data.data;
    if(command === 'serial' && connectedSerial && data) {
      console.log('serial into ui', event.data);
      connectedSerial.write(data, function(err){
        console.log('wrote data', data, err);
      });
    //   var uint8View = new Uint8Array(data);
    //   var string = "";
    //   for (var i = 0; i < data.byteLength; i++) {
    //     string += String.fromCharCode(uint8View[i]);
    //   }

    //   //console.log("Got data", string, readInfo.data);

    //   //Maybe this should be a Buffer()
    //   connectedSerial.publishEvent("data", uint8View);
    //   connectedSerial.publishEvent("dataString", string);
    //
    }
  });

}

function setEditorText(){
  window.funcEditor.setText(DEFAULT_SCRIPT);
}

function resizeEditor(){
  console.log('resizing');
  $("#input-func-editor").css("height",($( window ).height()-175)+"px");
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
        //console.log(option);
        //console.log(selectList);
    }


  });

}

function runCode(){
  if(connectedSerial){
    connectedSerial.close(startupJ5);
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
      functionStr: data
    }, '*');
  });

  console.log('posting runScript');

  sandboxWindow.postMessage({
    command: 'runScript',
    functionStr: window.funcEditor.getText()
  }, '*');
}

window.startApp = startApp;
