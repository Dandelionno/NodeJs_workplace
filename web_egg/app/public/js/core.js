'use strict';

function json_r(json_str) {
  return JSON.parse(json_str.replace(/&quot;/g, '"'));
}

var core = {
   run_vue: function(options) {
      var options = Object.assign({
         el : '#page',
         delimiters: ['{$', '$}'],         
      }, options);
      var vue = new Vue(options);
      return vue;
   },
   axios: function(url,config){
      var headers = {};
      if(config.method && config.method.toLowerCase() == "post")
      {
         headers['Content-type'] = 'application/x-www-form-urlencoded';
         headers['x-csrf-token'] = core.getCookie('csrfToken');
         if(config.data)
         {
            config.data = Qs.stringify(config.data);
         }
      }
      var instance  = axios.create(Object.assign({
         baseURL:url,
         timeout: 8000,
         headers: headers
      },config));
      var complete = function(success,response){
         if(success)
         {
            if(config.success)
            {
               config.success(response);
            }
         }else{
            Vue.prototype.$message({
               type: "error",
               message: "服务器响应失败，请稍后再试"
            });
            if(config.error)
            {
               config.error(response);
            }
         }
         if(config.complete)
         {
            config.complete(response);
         }
      }
      instance.request().then(function(response){
         if(response.status == 200)
         {
            complete(true,response);
         }else{
            complete(false,response);
         }
      },function(error){
         complete(false,error.response);
      }).catch(function(error){
         complete(false,error.response);
      });
   },
   getCookie: function(sName) {
      var aCookie = document.cookie.split("; ");
      for (var i=0; i < aCookie.length; i++)
      {
         var aCrumb = aCookie[i].split("=");
         if (sName == aCrumb[0])
         return unescape(aCrumb[1]);
      }
      return null;
   }
}