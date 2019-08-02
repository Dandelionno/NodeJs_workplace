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
};

module.exports = Helper;
