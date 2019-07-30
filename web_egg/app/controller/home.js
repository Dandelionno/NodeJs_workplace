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

      const user = await this.ctx.service.user.getUser(1);

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

      // this.ctx.service.user.is_transaction = true;
      const res = await this.ctx.service.user.query('select * from tbl_user');
      console.log(res[0].username);

      await this.render('login', {
        title: 'egg-test',
        list: JSON.stringify(list),
      });
    }
  }
}

module.exports = HomeController;
