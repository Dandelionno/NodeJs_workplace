'use strict';

const BaseService = require(__dirname + '/base_service');

class menuAuthService extends BaseService {
  async getMenuAuthMap() {
    return {
      11: [
        '/',
        '/login',
      ],
    };
  }
}

module.exports = menuAuthService;
