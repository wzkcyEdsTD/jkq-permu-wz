module.exports = options => {
  return async function forwardPrivileges(ctx, next) {
    // const user = ctx.session.currentUser;
    // const { ServerResponse, BusinessCode } = ctx.response;
    // const { NO_PRIVILEGES } = BusinessCode;

    // const menus = ctx.session.menus;
    // const keys = ctx.request.header.referer.split('/').reverse()[1];
    // const pmenus = menus.map(v => {
    //   return v.key;
    // });
    // if (!~pmenus.indexOf(keys)) {
    //   ctx.body = ServerResponse.createByErrorCodeMsg(
    //     NO_PRIVILEGES,
    //     '无权限操作'
    //   );
    //   return;
    // }

    await next();
  };
};
