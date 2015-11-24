// support https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import Promise from 'bluebird';
import superagent from 'superagent';
require('superagent-proxy')(superagent);
import _ from 'lodash';
import cheerio from 'cheerio';

const checkUrls = [
  'http://www.baidu.com',
];

function getProxyUrl(oneProxy) {
  let pre = 'http://';
  if (oneProxy.type !== 'HTTP' && oneProxy.type !== 'HTTPS') {
    pre = 'socks://';
  }
  return pre + oneProxy.ip + ':' + oneProxy.port;
}

function checkOne(oneProxy, timeout, succList) {
  return new Promise((resolve, reject) => {
    const proxyUrl = getProxyUrl(oneProxy);
    // console.log('check', proxyUrl);
    const startTime = new Date().valueOf();
    superagent
      .get(checkUrls[0])
      .proxy(proxyUrl)
      .timeout(timeout)
      .end((err, res) => {
        if (!err && res.ok) {
          const $ = cheerio.load(res.text);
          if ($('title').text() === '百度一下，你就知道') {
            const diff = new Date().valueOf() - startTime;
            oneProxy.spend = diff;
            succList.push(oneProxy);
          }
        }
        resolve();
      });
  });
}

/**
 * @param  {array} proxyList
 * @param  {number} timeout=5000    超时时间ms
 * @param  {number} concurrency=10  并发数
 */
async function checkValid(proxyList = [], timeout = 5000, concurrency = 10) {
  const total = proxyList.length;
  let curr = 0;
  const succList = [];
  await Promise.map(proxyList, (oneProxy) => {
    curr++;
    console.log('progress ' + curr + '/' + total);
    return checkOne(oneProxy, timeout, succList);
  }, { concurrency });
  return succList;
}

export default checkValid;
