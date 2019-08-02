'use strict';

const BaseController = require(__dirname + '/base_controller');

class HomeController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.userService = this.ctx.service.user;
  }

  async index() {
    this.ctx.response.body = 'hi, egg';
  }

  async login() {
    if (this.ctx.method === 'POST') {
      // try {
      /* >>>>>>>>>>>>> 校验 <<<<<<<<<<<<<<<<<*/
      //   this.ctx.validate({
      //     account: { type: 'string' },
      //     pwd: { type: 'string' },
      //   });
      // } catch (errors) {
      //   console.log(123);
      // }

      const user = await this.userService.getUserByCon({
        where: {
          username: this._post.username,
        },
      });
      if (user.length <= 0) {
        this.asResult(false, '用户不存在');
        return;
      }
      console.log(this.ctx.helper.md5('123123'));
      if (user[0].password !== this.ctx.helper.md5(this._post.pwd)) {
        this.asResult(false, '密码错误');
        return;
      }

      this.asJson({
        result: true,
      });

    } else {
      const list = [
        {
          title: 'hi there',
          url: '#',
        },
      ];

      await this.render('login', {
        title: 'egg-test',
        list: JSON.stringify(list),
      });
    }
  }
}

module.exports = HomeController;
