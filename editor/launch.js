
require(["orion/editor/edit"], function(edit) {

  window.funcEditor = edit({
      parent:document.getElementById('input-func-editor'),
      lang:"js"
  });

  //have to do this here to make sure editor is ready
  startApp();
});
