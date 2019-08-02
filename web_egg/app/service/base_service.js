'use strict';

const MysqlService = require(__dirname + '/mysql_service');

class BaseService extends MysqlService {
  // 获取指定的service
  ser(name) {
    const nameSet = name.split('.');
    let res = this.ctx.service;
    for (const i in nameSet) {
      res = res[nameSet[i]];
    }
    return res;
  }
}

module.exports = BaseService;
