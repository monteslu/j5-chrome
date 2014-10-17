var $ = require('jquery');
var _ = require('lodash');

window.$ = $;
window.jQuery = $;
window._ = _;

var selectList;

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
  //TODO handle this with bootstrap?
  $( window ).resize(resizeEditor);
  resizeEditor();
  loadDevices();
  $("#refreshBtn").click(loadDevices);
  $("#runBtn").click(runCode);
  setEditorText();

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
        var option = document.createElement("option");
        option.value = i;
        option.text = ports[i].path;
        selectList.appendChild(option);
        console.log(option);
        console.log(selectList);
    }


  });

}

function runCode(){
  //WOW this a nasty way to talk to the sandbox
  var sandboxWindow = window.opener.document.getElementById('sandboxFrame').contentWindow;

  var message = {
                 command: 'runScript',
                 functionStr: window.funcEditor.getText()
               };
  sandboxWindow.postMessage(message, '*');
}

window.startApp = startApp;
