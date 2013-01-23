var cache = require('memory-cache');
var guid = require('node-guid');
var events = require('events');

var GameState = function() {
  this.MAX = 10;
  this.WIDTH = 900;
  this.HEIGHT = 465;
  this.players = cache;
};
GameState.prototype = Object.create(events.EventEmitter.prototype);
GameState.prototype.random = function(from, to) {
  if (!to) {
    to = from;
    from = 0;
  }
  return Math.floor((Math.random() * to) + from);
};
GameState.prototype.join = function() {
  if (this.players.size() < this.MAX) {
    var id = guid();
    this.players.put(id, p);
    this.emit('game:state-change');
    return id;
  } return false;
};

GameState.prototype.quit = function(id) {
  this.players.del(id);
};

module.exports = exports = GameState;