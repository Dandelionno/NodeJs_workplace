var crypto = require('crypto');

var Helper = {	
	md5: function(data){
		var md5 = crypto.createHash('md5');
		return md5.update(data).digest('hex');
	},
}

module.exports = Helper;