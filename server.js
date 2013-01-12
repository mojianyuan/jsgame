!(function(r) {
  
  var static = r('node-static');
  var file = new(static.Server)('./public');

  r('http').createServer(function(request, response) {
    request.addListener('end', function() {
      file.serve(request, response);
    });
  }).listen(8080);

})(require);