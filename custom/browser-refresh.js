(function() {
  var socket = new WebSocket('wss://devel.fmh.de:3002');
  socket.onopen = function () {
    console.log('Listening for change');
  };
  socket.onmessage = function (event) {
    console.log('Change received' + event.data);
    location.reload(); 
  };
  socket.onclose = function () {
    console.log('Lost connection!');
  };
  socket.onerror = function (err) {
    console.error('Socket error', err);
  };
})();

