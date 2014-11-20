'use strict';

var React = require('react');

var DevicesList = React.createClass({

  getInitialState: function(){
    return {
      selectedDevice: this.props.devices[0]
    };
  },

  getDefaultProps: function(){
    return {
      devices: []
    }
  },

  onChange: function(e){
    console.log(e);
    this.setState({
      selectedDevice: e.target.value
    });
  },

  render: function(){
    var options = this.props.devices.map(function(device){
      return (
        <option key={device.path} value={device.path}>{device.path}</option>
      );
    });

    return (
      <select value={this.state.selectedDevice} onChange={this.onChange} className="form-control">
        {options}
      </select>
    );
  }
});

module.exports = DevicesList;
