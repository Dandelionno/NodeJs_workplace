'use strict';

module.exports = options => {
  return async function auth(ctx, next) {
    const menuAuthMap = await ctx.service.menuAuth.getMenuAuthMap();
    
    await next();
  };
};
