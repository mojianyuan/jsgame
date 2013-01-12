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

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
var Unit = function(name, opts, game) {
    if (!name) return;
    var elem = document.getElementById(name);
    this.initialize(elem, opts);
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.game = game;
  };
Unit.prototype = new fabric.Image({width:0,height:0});
Unit.prototype.constructor = fabric.Image;
Unit.prototype.move = function(dir, step, duration) {
  var opt = {'duration': duration || 1};
  step = step || 2;
  var inc = '+'+step;
  var dec = '-'+step;
  switch(dir.toLowerCase()) {
  case 'up':
    this.animate('top', dec, opt);
    break;
  case 'down':
    this.animate('top', inc, opt);
    break;
  case 'left':
    this.animate('left', dec, opt);
    break;
  case 'right':
    this.animate('left', inc, opt);
    break;
  }
};

Unit.prototype.update = function() {
  if (this.get('top') < 0) this.set('top', this.game.height);
  if (this.get('top') > this.game.height) this.set('top', 0);
  if (this.get('left') < 0) this.set('left', this.game.width);
  if (this.get('left') > this.game.width) this.set('left', 0);
};

Unit.prototype.pop = function(to,scale) {
  var that = this;
  to = to || 1;
  scale = scale || 1.2; 
  this.scale(scale);
  setTimeout(function(){that.scale(1)},to);
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
var Star = function(name,opts,game){
  if (!name) return;
  this.constructor(name,opts,game);
  this.popTime = Util.random(60,240);
  this.updateTime = 0;
};
Star.prototype = new Unit();
Star.prototype.constructor = Unit;
Star.prototype.update = function() {
  // super
  this.constructor.prototype.update.call(this);
  //Unit.prototype.update.call(this);
  // override
  this.updateTime += 1;
  if (this.updateTime >= this.popTime) {
    this.updateTime = 0;
    this.pop();
  }
  var dir = ['up','down','left','right'][Util.random(0,4)];
  this.move(dir,5,200);
};
Star.prototype.pop = function() {
  this.constructor.prototype.pop.call(this, 300, 0.7);
  //Unit.prototype.pop.call(this, 300, 2);
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
var Player = function(name, opts, game) {
  if (!name) return;
  this.constructor(name,opts,game);
};
Player.prototype = new Unit();
Player.prototype.constructor =  Unit;
Player.prototype.update = function() {
  // super
  //Unit.prototype.update.call(this);
  this.constructor.prototype.update.call(this);
  //override
  if (Key.isDown(Key.UP)) this.move('up');
  if (Key.isDown(Key.LEFT)) this.move('left');
  if (Key.isDown(Key.DOWN)) this.move('down');
  if (Key.isDown(Key.RIGHT)) this.move('right');
  if (Key.isDown(Key.SPACE)) this.pop();
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
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
  // stars
  this.stars = [];
  for (var i=0;i<50;i++){
    var opts = {left:Util.random(0,this.width),top:Util.random(0,this.height)};
    var star = new Star('star1',opts,this);
    this.canvas.add(star);
    this.stars.push(star);
  }

  //player
  var opts = {
    left: this.width/2,
    top: this.height/2
  };
  this.player = new Player('robot1', opts, this);
  this.canvas.add(this.player);
};
Game.prototype.draw = function() {
  this.canvas.renderAll();
};
Game.prototype.logic = function() {
  this.player.update();
  for(var i in this.stars)  {this.stars[i].update();}
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