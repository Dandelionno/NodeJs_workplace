'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
	async upload() {
		const files = this.request.files;
		for(const file in files){
			
		}
	}
}

module.exports = BaseController