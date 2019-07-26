'use strict';

const BaseController = require(__dirname + '/../core/base_controller');

class HomeController extends BaseController {
	// async render() {
	// 	await this.ctx.render('index.js');
	// }

	async index() {
		this.ctx.response.body = 'hi, egg';		
	}

	async login() {
		if(this.ctx.methods == 'POST'){
			/* >>>>>>>>>>>>> 校验 <<<<<<<<<<<<<<<<<*/
			try{
				this.ctx.validate({
					title: { type: 'string' },
					content: { type: 'string' },
				});
			}catch(errors){
				console.log(errors)
			}
		}		

		let list = [
			{
				title: 'hi there',
				url: '#'
			}
		]
		// this.ctx.response.body = 'hi, there';
		await this.ctx.render('login', {
			title: 'egg-test',
			list: JSON.stringify(list),
		});
	}
}

module.exports = HomeController;
