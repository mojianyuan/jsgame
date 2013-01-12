//const and declarations
var fps = 1000 / 60;
fabric.Object.prototype.selectable = false;
var Util = {
  now: function() {
    return(new Date()).getTime();
  },
  random: function(from, to) {
    return Math.floor((Math.random() * to) + from);
  }
};
var Key = {
  _pressed: {},
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE:32,
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  onKeydown: function(event) {
    //console.log('keydown');
    this._pressed[event.keyCode] = Util.now();
  },
  onKeyup: function(event) {
    //console.log('keyup');
    delete this._pressed[event.keyCode];
  }
};

//class
var Unit = function(name, opts, game) {
    var elem = document.getElementById(name);
    this.initialize(elem, opts);
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.game = game;
  };
Unit.prototype = new fabric.Image({width:0,height:0});
Unit.prototype.constructor = fabric.Image;
Unit.prototype.move = function(dir) {
  var d = {'duration': 1};
  var step = 2;
  var inc = '+'+step;
  var dec = '-'+step;
  switch(dir.toLowerCase()) {
  case 'up':
    this.animate('top', dec, d);
    break;
  case 'down':
    this.animate('top', inc, d);
    break;
  case 'left':
    this.animate('left', dec, d);
    break;
  case 'right':
    this.animate('left', inc, d);
    break;
  }
};
Unit.prototype.update = function() {
  if (Key.isDown(Key.UP)) this.move('up');
  if (Key.isDown(Key.LEFT)) this.move('left');
  if (Key.isDown(Key.DOWN)) this.move('down');
  if (Key.isDown(Key.RIGHT)) this.move('right');
  if (Key.isDown(Key.SPACE)) this.pop();

  if (this.get('top') < 0) this.set('top', this.game.height);
  if (this.get('top') > this.game.height) this.set('top', 0);
  if (this.get('left') < 0) this.set('left', this.game.width);
  if (this.get('left') > this.game.width) this.set('left', 0);
};

Unit.prototype.pop = function() {
  var that = this;
  this.scale(1.2);
  setTimeout(function(){that.scale(1)},1);
};

var Game = function(id) {
    this.canvas = new fabric.Canvas(id, {
      intercative: false,
      renderOnAddition: false,
      selection: false
    });
    this.height = this.canvas.getHeight();
    this.width = this.canvas.getWidth();
  };
Game.prototype.init = function() {
  var opts = {
    left: this.width/2,
    top: this.height/2
  };
  this.unit = new Unit('robot1', opts, this);
  this.canvas.add(this.unit);
};
Game.prototype.draw = function() {
  this.canvas.renderAll();
};
Game.prototype.logic = function() {
  //no logic
  this.unit.update();
};

Game.prototype.run = function() {
  var that = this,
    stamp = Util.now(),
    diff;

  var run = function() {
      that.logic();
      that.draw();
      var timeout = (diff = Util.now() - stamp) >= fps ? fps : diff;
      stamp = Util.now();
      setTimeout(run, timeout);
    };
  run();
};

// init and run
window.addEventListener('keyup', function(event) {
  Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
  Key.onKeydown(event);
}, false);

var g = new Game('c');
g.init();
g.run();