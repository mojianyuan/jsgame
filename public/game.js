//const and declarations
var fps = 1000/60;
var canvasSize = 465;
fabric.Object.prototype.selectable = false;
var random = function(from,to) {
  return Math.floor((Math.random()*to)+from);
};

//class
var Game = function(id){
  this.canvas = new fabric.Canvas(id,{
    intercative:false,
    renderOnAddition: false,
    selection: false
  });
  this.height = this.canvas.getHeight();
};
Game.prototype.draw = function(){
  this.canvas.renderAll();
};
Game.prototype.logic = function(){
  //logic
  var that = this;
  that.canvas.forEachObject(function(i){
    var top = i.getTop();
    i.animate('top',top+1, {duration:i.speed});
    if (top >= this.height) {
      that.canvas.remove(i);
    }
  });
  
  var x = Math.floor((Math.random()*this.height)+1);
  var circle = new fabric.Circle({
    left:x,
    top:0,
    radius:2
  });
  circle.speed = random(1,100);
  this.canvas.add(circle);
};
Game.prototype.now = function(){return (new Date()).getTime();};
Game.prototype.run = function() {
  var that = this,
      stamp = that.now(),
      diff;
  
  var run = function() {
    that.logic();
    that.draw();
    var timeout = (diff = that.now()-stamp) >= fps ? fps : diff;
    stamp = that.now();
    setTimeout(run, timeout);
  };
  run();
};

// run
var g = new Game('c');
    g.run();