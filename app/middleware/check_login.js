module.exports = options => {
  return async function checkLogin(ctx, next) {
    const user = ctx.session.currentUser;
    const { ServerResponse, BusinessCode } = ctx.response;
    const { NEED_LOGIN } = BusinessCode;
    if (!user) {
      ctx.status = 401;
      ctx.body = ServerResponse.createByErrorCodeMsg(NEED_LOGIN, '用户未登录');
      // 消除session和sessionpool的映射
      ctx.session = null;
      return;
    }
    await next();
  };
};
