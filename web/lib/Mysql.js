var mysql = require('mysql');

var _Mysql = function (){
	this.conn = null;
	this.connect = function(config = {}){
		this.conn = mysql.createConnection({
			host     : config.host,
			user     : config.user,
			password : config.password,
			database : config.database,
		});
		this.conn.connect()
		return this.conn;
	}

	this.query = function(sql){
		this.conn.query(sql, function (error, results, fields) {
			if (error) throw error;
			console.log(results);
			console.log(fields);
		});
	}

	this.close = function(){
		this.conn.end();
	}
}

module.exports = _Mysql;