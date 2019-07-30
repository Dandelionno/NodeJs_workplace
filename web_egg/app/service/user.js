'use strict';

const BaseService = require(__dirname + '/base_service');

class UserService extends BaseService {
  async getUser(userid) {
    const user = await this.app.mysql.get('tbl_user', {
      id: userid,
    });
    return { user };
  }

  async create(tbl_name, columns) {
    await this.insert(tbl_name, columns);
  }

}

module.exports = UserService;
