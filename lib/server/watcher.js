const kss = require('kss');
const kssConfig = require('../../kss-config.json');
const nodeSass = require('node-sass');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const util = require('util');

// promisifying:
const readdirPromise = util.promisify(fs.readdir); 
const sassRenderPromise = util.promisify(nodeSass.render);
const writeFilePromise = util.promisify(fs.writeFile);

async function build() {

  try {

    if (process.env.KSS_VERBOSE === 'yes') console.log('kssConfig', kssConfig); 
   
    let scssFiles = [];
   
    for (let i = 0, l = kssConfig.source.length; i < l; i++) {
      const result = (await readdirPromise(kssConfig.source[i]))
        .filter((f) => f.match(/\.scss$/));
      scssFiles = scssFiles.concat(result); 
    }

    for (let i = 0, l = scssFiles.length; i < l; i++) {
      const scssFile = scssFiles[i];
      const cssFileName = scssFile.split('.')[0] + '.css';
      const outPath = `dist/${cssFileName}`; 
      const cssResult = await sassRenderPromise({
        file: `${kssConfig.source}${scssFiles[i]}`
      }); 
      writeFilePromise(outPath, cssResult.css);
      if (process.env.CSS_VERBOSE === 'yes') console.log('cssResult', cssResult); 
    }

    const kssResult = await kss(kssConfig);

    if (process.env.KSS_VERBOSE === 'yes') console.log('kssResult', kssResult);
  } catch (err) {

    console.error(err);
  }
}


module.exports = async function watcher(wsServer) {

  try {
    const watchOptions = {
      persistent: true
    };

    const srcWatcher = chokidar.watch('src/**/*', watchOptions);
    const styleguideWatcher = chokidar.watch('styleguide/*.html', watchOptions);

    srcWatcher.on('error', (err) => {
      console.error(err); 
    });
    
    styleguideWatcher.on('error', (err) => {
      console.error(err); 
    });
    
    await build();

    srcWatcher.on('change', async (path) => {
      
      try {
        console.log('srcWatcher path', path);   
      
        await build();
      } catch (err) {
        
        console.log(err);
      }
    });

    // prevent cumulating watchers due to browser reload

    wsServer.on('connection', async (socket) => {

      socket.on('message', (msg) => {
        // The only incoming message is 'ping' 
      });
      
      styleguideWatcher.on('change', async (path) => {
        
        try {
          socket.send(JSON.stringify({path}));
        } catch (err) {
          
          console.log(err);
        }
      });
    });
  } catch (err) {
    
    console.error(err);
  }
};
