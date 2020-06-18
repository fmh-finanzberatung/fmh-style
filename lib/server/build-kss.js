const kss = require('kss');
const fs = require('fs-extra');
const util = require('util');
const nodeSass = require('node-sass');
const sassRenderPromise = util.promisify(nodeSass.render);
const readdirPromise = util.promisify(fs.readdir); 
const kssConfig = require('../../kss-config.json');
const writeFilePromise = util.promisify(fs.writeFile);

module.exports = async function buildKss() {

  try {

    if (process.env.KSS_VERBOSE === 'yes') console.log('kssConfig', kssConfig); 
   
    let scssFiles = [];

    if (process.env.BROWSER_REFRESH === 'no') {
      const foundIndex = kssConfig.js.findIndex( item => item.match(/refresh/)); 
      if (foundIndex !== -1) {
        kssConfig.js.splice(foundIndex, 1);
      }
    }


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
};


