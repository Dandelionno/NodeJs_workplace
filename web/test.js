var events = require('events')
var util = require('util')

var file = require('./lib/File')


//>>>>>>>>>>>>>>>> 获取执行命令的参数
// console.log( '脚本参数：', process.argv)
// console.log('系统：', process.platform)
// console.log('Node的版本：', process.version)
//// 输出到终端
// process.stdout.write("heiheihei\n")



//>>>>>>>>>>>>>>>>  测试自己写的模块
var F = new file()
var res = F.read_file('./data/input.txt')
console.log(res)



var eventsEmitter = events.EventEmitter
var event = new eventsEmitter()
event.on('test_event', function(){
    console.log('triggered event')
})


event.emit('test_event')


/*============== Stream =================*/
/* >>>>>>>> 读取文件 <<<<<<<< */
var fs = require('fs')
var input_file_path = './data/input.txt'
var output_file_path = './data/output.txt'
var data = ''


// var readerStream = fs.createReadStream(input_file_path)

// readerStream.setEncoding('utf-8')

// readerStream.on('data', function(chunk){
// 	data += chunk
// })

// readerStream.on('end', function(){
// 	console.log(data)
// })

// readerStream.on('error', function(err){
//    console.log(err.stack)
// });

/* >>>>>>>> 写入文件 <<<<<<<< */
// var writerStream = fs.createWriteStream(output_file_path)
// var content = '要写入的内容';
// // 使用 utf8 编码写入数据
// writerStream.write(content, 'utf8')
// // 标记文件末尾
// writerStream.end()

// writerStream.on('finish', function() {
//     console.log("写入完成。");
// });
// writerStream.on('error', function(err){
//    console.log(err.stack);
// });

/* >>>>>>>> 管道流 <<<<<<<< */
// readerStream.pipe(writerStream) //将input.txt的内容写入output.txt中

/* >>>>>>>> 链式流 <<<<<<<< */
// var zlib = require('zlib')
// 压缩 input.txt 文件为 input.txt.gz
// fs.createReadStream(input_file_path)
//   .pipe(zlib.createGzip())
//   .pipe(fs.createWriteStream('./data/input.txt.gz'))

// 解压 input.txt.gz 文件为 input.txt
// fs.createReadStream('./data/input.txt.gz')
// 	.pipe(zlib.createGunzip())
// 	.pipe(fs.createWriteStream('./data/test.txt'))

