const express = require('express');
const chokidar = require('chokidar');
const path = require('path');
const app = express();
const port = 3003;
const http = require('http');
const SocketServer = require('websocket').server;
const server = http.createServer(app);

const wsServer = new SocketServer({
  httpServer: server,
  autoAcceptConnections: true 
});

app.use(express.static(__dirname + '/styleguide/'));
app.use('/custom/', express.static(__dirname + '/custom/'));
app.use('/dist/', express.static(__dirname + '/dist/'));

app.get('/', (req, res) => {
  res.redirect('index.html');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const watcher = chokidar.watch('src/**/*', {
  persistent: true
});

watcher.on('error', (err) => {
  console.error(err); 
});


wsServer.on('request', (request) => {
  console.log('request', request);

});
wsServer.on('connection', (socket) => {

  console.log('connection established');

  watcher.on('change', (path) => {
    setTimeout(() => {
      // need a little delay here to allow for
      // css to build
      console.log('path changed', path);
      socket.sendUTF(path);
    }, 1000);
  });

});

