const chokidar = require('chokidar');
const fs = require('fs-extra');
const util = require('util');
const buildKss = require('./build-kss');

// initial styleguide build
buildKss();

const watchOptions = {
  persistent: true
};

const srcWatcher = chokidar.watch('src/**/*', watchOptions);
const styleguideWatcher = chokidar.watch('styleguide/*.html', watchOptions);


module.exports = async function watcher(req, res) {

  try {
 
    res.connection.setTimeout(0);
    
    // creating stream connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    //await res.write('\n'); 

    srcWatcher.on('error', (err) => {
      console.error(err); 
    });
    
    styleguideWatcher.on('error', (err) => {
      console.error(err); 
    });

    srcWatcher.on('change', async (path) => {
      await buildKss();
    });

    // example source:
    // https://jasonbutz.info/2018/08/server-sent-events-with-node
    styleguideWatcher.on('change', async(path) => {
      res.write(
        `id: ${new Date().getTime()}\n` +  
        'retry: 5000\n' +
        `data: ${JSON.stringify({path})}\n\n\n`
      );
    });

  } catch (err) {
    
    console.error(err);
  }
};
