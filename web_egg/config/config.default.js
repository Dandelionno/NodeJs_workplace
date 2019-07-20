/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  // console.log(appInfo);

  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1563527486936_8193';

  // add your middleware config here
  config.middleware = [];

  // 模板配置
  config.view= {
      root: [
        path.join(appInfo.baseDir, 'app/view'),
      ].join(','),
      mapping: {
        '.html': 'nunjucks',
        // '.js': 'assets',
      },
      defaultExtension: '.html',
  };

  // config.assets = {
  //   templatePath: path.join(appInfo.baseDir, 'app/view/template.html'),
  //   templateViewEngine: 'nunjucks',
  // };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
