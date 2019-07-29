'use strict';

const BaseController = require(__dirname + '/../core/base_controller');

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
      console.log(123);

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
