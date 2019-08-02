'use strict';

const BaseController = require(__dirname + '/base_controller');

class ErrorController extends BaseController {

  async index() {
    await this.render('404');
  }
}

module.exports = ErrorController;
