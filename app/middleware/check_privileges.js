/**
 * 中间件权限判断
 * 暂不用
 */
module.exports = (options) => {
  return async function checkPrivileges(ctx, next) {
    return await next();
    const { ServerResponse, BusinessCode } = ctx.response;
    const { NO_PRIVILEGES } = BusinessCode;
    const PATH = ctx.request.body.path || ctx.request.query.path;
    if (ctx.session.menus == undefined) {
      await next();
    } else {
      
      const pmenus = menus.map((v) => v.p_link);
      if (!~pmenus.indexOf(PATH)) {
        return (ctx.body = ServerResponse.createByErrorCodeMsg(
          NO_PRIVILEGES,
          "无权限操作"
        ));
      }
      await next();
    }
  };
};
