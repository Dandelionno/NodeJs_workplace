// 定义一些全局变量
global.ROOTPATH = __dirname;
global.DIR_STATIC = global.ROOTPATH + '/static';
global.DIR_UPLOAD = global.ROOTPATH + '/upload';
global.DIR_LIB = global.ROOTPATH + '/lib';


var path = require('path');
var util = require('util');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var myFile = require(global.DIR_LIB + '/File');
var Mysql = require(global.DIR_LIB + '/Mysql');


var express = require('express');
var app = express();


app.use('/static', express.static('static'));
app.use('/views', express.static('views'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));



var db = new Mysql();

//引入模板引擎
app.set('view engine', 'pug');
app.set("views", path.resolve(__dirname, "views"));


app.get('/', function (req, res) {
	
	res.render('index', { 
		title: 'Hey', 
		message: 'Hello there!'
	});
})


app.get('/user', function (req, res, next) {
	console.log('用户中心页面');
	// console.log("Cookies: " + util.inspect(req.cookies));
	next();	
}, function(req, res){
	db.connect({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'test',
	});
	db.query('select * from tbl_user');
	
	res.render('user');
})

app.post('/user/add', function (req, res) {
	//保存上传的图片
	if(req.files){
		myFile.saveUploadFile(req.files, true);
	}

	var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   res.end(JSON.stringify(response));
})

var server = app.listen(8888, function () {

	var host = server.address().address
	var port = server.address().port
 
	console.log("应用实例，访问地址为 http://%s:%s", host, port)

})