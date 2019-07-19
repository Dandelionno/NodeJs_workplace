const mysql = require('mysql');

const _mysql = {
	connection: null,
	connect: function(){
		var self = this;
		this.connection = mysql.createConnection({
		    host: 'localhost',
		    user: 'root',
		    password: 'root',
		    database: 'test'
		});
		this.connection.connect(function (err) {
	        if (err) {
	            console.error('error connecting:' + err.stack)
	        }
	        console.log('connected as id ' + self.connection.threadId);
	    })

		return this.connection;
	},
	query: function(sql){
		var self = this;
		return new Promise(function(resolve, reject){
			self.connection.query(sql, function (error, results, fields) {
				if (error) throw error;
				self.close();
				resolve(results);
			});
		});
	},
	close: function(){
		this.connection.end();
	}
}

module.exports = _mysql;