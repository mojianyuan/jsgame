!(function(r) {

  var static = r('node-static');
  var socket_io = r('socket.io');
  var GS = r('./gamestate');
  var file = new(static.Server)('./public');

  var server = r('http').createServer(function(request, response) {
    request.addListener('end', function() {
      file.serve(request, response);
    });
  }).listen(process.env.PORT || 8080);

  var io = socket_io.listen(server);


  var gs = new GS();

  io.sockets.on('connection', function(socket) {
    
    if (true) {
      socket.send('welcome..');
      socket.emit('game:start',{left:gs.random(gs.WIDTH),top:gs.random(gs.HEIGHT)});
      socket.broadcast.emit('game:changed',{});
    } 
    else {
      socket.send('server full.');
      setTimeout(socket.disconnect, 1000);
    }

    socket.on('disconnect',function(){
      console.log('disconnected..');
    });

  });

})(require);