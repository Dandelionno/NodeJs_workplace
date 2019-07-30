'use strict';

/** @type Egg.EggPlugin */

module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
//   assets: {
//     enable: true,
//     package: 'egg-view-assets',
//   },
};

