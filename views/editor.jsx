'use strict';

var React = require('react');
// var CodeMirror = require('react-code-mirror');
var scriptfs = require('../lib/scriptfs');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/dialog/dialog.css');
require('codemirror/addon/search/search');
require('codemirror/addon/selection/mark-selection');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');

var CodeMirror = require('codemirror');


var Editor = React.createClass({
  getInitialState: function(){
    return {
      content: ''
    };
  },

  updateContent: function(e){
    //console.log('updateContent', e);
    this.setState({
      content: e.getValue()
    });
  },

  componentDidMount: function() {
    console.log('editor component did mount');
    var self = this;
    var container = React.findDOMNode(this);

    scriptfs.get(function(err, data){
      self.setState({
        content: data
      });

      self.codeEditor = CodeMirror(container, {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        value: data,
      });

      self.codeEditor.on('change', self.updateContent);

    });
  },

  render: function(){
    return (
      <div
        value={this.state.content}
        className='flexbox-item fill-area content flexbox-item-grow'
      />
    );
  }
});

module.exports = Editor;
