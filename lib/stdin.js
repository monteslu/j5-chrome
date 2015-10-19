'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Stdin(){}

util.inherits(Stdin, EventEmitter);

function noop(){};

Stdin.prototype.resume = noop;
Stdin.prototype.setEncoding = noop;
Stdin.prototype.write = noop;
Stdin.prototype.setRawMode = noop;
Stdin.prototype.pause = noop;

module.exports = new Stdin();
