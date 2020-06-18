const buildKss = require('../server/build-kss');

async function main() {

  try {
    await buildKss();
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(1);
  }
}

main();
