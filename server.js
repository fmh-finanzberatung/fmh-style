const express = require('express');
const app = express();
const port = 3003;
const http = require('http');
const httpServer = http.createServer(app);
const path = require('path');
const watcher = require('./lib/server/sse-watcher');

app.use(express.static(__dirname + '/styleguide/'));
app.use('/custom/', express.static(__dirname + '/custom/'));
app.use('/lib/browser/', express.static(__dirname + '/lib/browser/'));
app.use('/dist/', express.static(__dirname + '/dist/'));

app.get('/favicon.ico', (req, res) => {
  // don't have one 
  res.status(200).send('');
});

app.get('/event-stream', watcher); 

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

