'use strict';

var React = require('react');

var Editor = require('./editor.jsx');

var Layout = React.createClass({

  render: function(){
    return (
      <div>
        <Editor />
      </div>
    );
  }
});

module.exports = Layout;
