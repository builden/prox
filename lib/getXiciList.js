/**
 * http://www.xicidaili.com/nn/[1 - xxx] 免费代理数据
 */
import agent from 'superagent';
import cheerio from 'cheerio';
import _ from 'lodash';

const preUrl = 'http://www.xicidaili.com/nn/';

function getPageCount($) {
  return Number($('.next_page').prev().text());
}

function request(url) {
  return new Promise((resolve, reject) => {
    agent
      .get(url)
      .end((err, res) => {
        if (err) return reject(err);
        resolve(cheerio.load(res.text));
      });
  });
}

function parseList($) {
  const rst = [];
  const $trs = $('#ip_list').find('tr');
  $trs.each((i, tr) => {
    if (i === 0) return;
    const one = {};
    $(tr).find('td').each((j, td) => {
      if (j === 1) one.cy = $(td).find('img').attr('alt');
      else if (j === 2) one.ip = $(td).text();
      else if (j === 3) one.port = $(td).text();
      else if (j === 4) one.addr = _.trim($(td).text());
      else if (j === 6) one.type = $(td).text();
    });
    rst.push(one);
  });
  return rst;
}

async function getXiciList() {
  const proxyList = [];
  try {
    const $main = await request(preUrl);
    const count = getPageCount($main);
    console.log('pageCount', count);
    proxyList.push(...parseList($main));
    for (const i of _.range(2, count + 1)) {
      console.log('progress ' + i + '/' + count);
      const $ = await request(preUrl + i);
      proxyList.push(...parseList($));
    }
  } catch (err) {
    console.err(err.stack || err);
  }
  return proxyList;
}

export default getXiciList;
