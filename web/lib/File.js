var fs = require('fs')
var myHelper = require(global.DIR_LIB + '/Helper');

// function File(cb) {
// 	this.read_file = function(path){
		
// 		return fs.readFileSync(path).toString();	
// 	}

// 	this.saveUploadFile = function(){

// 	}
// }

var File = {
	read_file : function(path){
		
		return fs.readFileSync(path).toString();	
	},
	/**
	* @param files: 上传的文件信息
	* @param savePath: 保存路径
	* @param use_ori_name: 是否用文件原名
	*/
	saveUploadFile : function(files, use_ori_name=false, savePath=global.DIR_UPLOAD){
		var res = [];
		for(var i in files) {
			var file = files[i];
			var ori_fileName_info = file.originalname.split('.');
			var ext = ori_fileName_info[ori_fileName_info.length-1] ? '.'+ori_fileName_info[ori_fileName_info.length-1] : '';
			var fileName = true===use_ori_name ? myHelper.md5(file.originalname)+ext : file.originalname;
			var savePath = savePath + '/' + fileName;			
			fs.readFile(file.path, function(err, data){
				fs.writeFile(savePath, data, function(err){
					if( err ){
	            		console.log( err );
	         		}else{
         				res.push(savePath);
	         		}
				});				
			});
		}
		return res;
	},
}

module.exports = File