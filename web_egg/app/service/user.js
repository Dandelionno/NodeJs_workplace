'use strict';

const BaseService = require(__dirname + '/base_service');

class UserService extends BaseService {
  // 登录
  async login(params) {
    const cacheKey = await this.ser('utils.redis').getCacheKey('captcha');
    const captcha = await this.ser('utils.redis').get(cacheKey);
    if (params.captcha !== captcha) {
      throw new Error('验证码错误');
    }

    let user = await this.getUserByCon({
      where: {
        username: params.username,
      },
    });

    if (user.length <= 0) {
      throw new Error('用户不存在');
    }
    user = user[0];

    if (user.password !== this.ctx.helper.md5(params.pwd)) {
      const auth = await this.ser('utils.redis').auth('pwd_err_times', 3, 5 * 60);
      const err_msg = auth ? '密码错误太多次，请5分钟后再尝试' : '密码错误';
      throw new Error(err_msg);
    }

    // 保存session
    this.ctx.session.userinfo = user;
    this.setCurUser();
    return true;
  }

  // 登出
  async logout() {
    this.ctx.session.userinfo = null;
  }

  // 设置当前用户信息
  setCurUser() {
    if (!this.ctx.session.userinfo) {
      this.ctx._user = {
        isGuest: false,
        id: null,
        identiy: null,
      };
    } else {
      this.ctx._user = {
        isGuest: true,
        id: this.ctx.session.userinfo.id,
        identiy: this.ctx.session.userinfo,
      };
    }
  }

  async getUser(userid) {
    const user = await this.app.mysql.get('tbl_user', {
      id: userid,
    });
    return { user };
  }

  async getUserByCon(conditions) {
    const result = this.select('user', conditions);
    return result;
  }

  async create(tbl_name, columns) {
    await this.insert(tbl_name, columns);
  }

}

module.exports = UserService;
