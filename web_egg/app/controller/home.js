'use strict';

const BaseController = require(__dirname + '/base_controller');

class HomeController extends BaseController {

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

      // 登录
      try {
        await this.ser('user').login(this.ctx._post);
      } catch (error) {
        this.asResult(false, error.message);
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

      // 生成验证码
      const captcha = this.ctx.helper.createCaptcha();
      const cacheKey = await this.ser('utils.redis').getCacheKey('captcha');
      await this.ser('utils.redis').set(cacheKey, captcha, 10 * 60);

      await this.render('login', {
        title: 'egg-test',
        list: JSON.stringify(list),
        captcha: `${captcha}`,
      });
    }
  }
}

module.exports = HomeController;
