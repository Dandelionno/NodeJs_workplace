'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);

    // 如果有post的数据，则保存到this._post中
    if (this.ctx.request.body) {
      this._post = this.ctx.request.body;
    }
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

  async asJson(data) {
    data = Object.assign({
      status: 200,
    }, data);
    this.ctx.response.body = data;
  }

  async asResult(res, msg, datas) {
    await this.asJson({
      result: res,
      message: msg,
      data: datas,
    });
  }
}

module.exports = BaseController;
