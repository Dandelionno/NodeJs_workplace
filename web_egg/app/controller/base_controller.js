'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);

    // 如果有post的数据，则保存到this._post中
    if (this.ctx.request.body) {
      this.ctx._post = this.ctx.request.body;
    }

    // 用户信息
    this.ser('user').setCurUser();
  }

  async upload() {
    const files = this.request.files;
    for (const file in files) {
      console.log(file);
    }
  }

  async render(filename, params = {}) {
    const tpl_params = Object.assign({
      public_path: '/public',
    }, params);
    await this.ctx.render(filename, tpl_params);
  }

  asJson(data) {
    data = Object.assign({
      status: 200,
    }, data);
    this.ctx.response.body = data;
  }

  asResult(res, msg, datas) {
    this.asJson({
      result: res,
      message: msg,
      data: datas,
    });
  }

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

module.exports = BaseController;
