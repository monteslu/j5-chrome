'use strict';

var React = require('react');
var CodeMirror = require('react-code-mirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');

var DEFAULT_SCRIPT = '/* \n'
  + ' You have the following variables available to your script:\n'
  + '   five  = The full johnny-five API !\n'
  + '   io    = the firmata instance for the board\n'
  + '   $     = jQuery, because you might already know jQuery\n'
  + '   _     = lodash, because lodash is awesome\n'
  + '*/ \n\n'
  + 'var board = new five.Board({io: io});\n\n'
  + 'board.on(\'ready\', function(){\n'
  + '  // Default to pin 13\n'
  + '  var led = new five.Led(13);\n'
  + '  led.blink();\n'
  + '});';


var Editor = React.createClass({
  getInitialState: function(){
    return {
      content: DEFAULT_SCRIPT
    };
  },

  updateContent: function(e){
    this.setState({
      content: e.target.value
    });
  },

  render: function(){
    return (
      <CodeMirror
        value={this.state.content}
        mode='javascript'
        theme='monokai'
        onChange={this.updateContent} />
    );
  }
});

module.exports = Editor;
