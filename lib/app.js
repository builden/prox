if (!global._babelPolyfill) require('babel-core/polyfill');
import getXiciList from './getXiciList.js';
import fs from 'fs-extra';
import moment from 'moment';
import checkValid from './checkValid.js';
import _ from 'lodash';


async function main() {
  /*  const list = await getXiciList();
    const filename = 'db/xici-' + moment().format('MMDD-HHmm') + '.json';
    fs.outputJsonSync(filename, list);*/

  const proxyList = fs.readJsonSync('db/xici-1124-1226.json');
  try {
    const succList = await checkValid(_.takeRight(proxyList, 1000), 5000);
    // console.log('succList', succList);
    const succFile = 'db/xici-succ-' + moment().format('MMDD-HHmm') + '.json';
    fs.outputJsonSync(succFile, succList);
  } catch (err) {
    console.error(err.stack || err);
  }
}

main();

