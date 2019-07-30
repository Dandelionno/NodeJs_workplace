'use strict';

const Helper = {
  sleep: (sec) => new Promise ((resolve) => {
    setTimeout(resolve, sec);
  }),
  test() {
    console.log(this.app);
  },
};

module.exports = Helper;
