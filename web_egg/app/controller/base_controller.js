'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  // constructor() {
  //   super();
  //   console.log(13222);
  // }

  async upload() {
    const files = this.request.files;
    for (const file in files) {
      console.log(file);
    }
  }

  async asJson(data) {
    this.ctx.response.body = data;
  }

  async render(filename, params = {}) {
    const tpl_params = Object.assign({
      public_path: '/public',
    }, params);
    await this.ctx.render(filename, tpl_params);
  }

}

module.exports = BaseController;
