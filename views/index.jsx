'use strict';

var React = require('react');

var Editor = require('./editor.jsx');

var Layout = React.createClass({

  render: function(){
    return (
      <Editor className="flexbox-item fill-area content flexbox-item-grow"/>
    );
  }
});

module.exports = Layout;
