'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 配置文件即将加载，这是最后动态修改配置的时机
  async configWillLoad() {
    global.is_debug = true;
  }

  // 配置文件加载完成
  async configDidLoad() {
    
  }

  // 文件加载完成
  async didLoad() {
    
  }

  // 插件启动完毕
  async willReady() {
    
  }

  // worker 准备就绪
  async didReady() {
    
  }

  // 应用启动完成
  async serverDidReady() {
    
  }

  // 应用即将关闭
  async beforeClose() {
    
  }
}

module.exports = AppBootHook;

