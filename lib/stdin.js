'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Stdin(){}

util.inherits(Stdin, EventEmitter);

function noop(){};

Stdin.prototype.resume = noop;
Stdin.prototype.setEncoding = noop;
Stdin.prototype.write = function(){};
Stdin.prototype.setRawMode = noop;

module.exports = new Stdin();
