'use strict';
const crypto = require('crypto');

const Helper = {
  sleep: (sec) => new Promise ((resolve) => {
    setTimeout(resolve, sec);
  }),
  md5(data) {
    const md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
  },
  createCaptcha(len = 4) {
    const chars = [
      '0','1','2','3','4','5','6','7','8','9',
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ];

    let res = '';
    for (let i = 0; i < len; i++) {
      const id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  },
};

module.exports = Helper;
