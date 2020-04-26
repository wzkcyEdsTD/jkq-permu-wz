module.exports = options => {
  return async function checkPrivileges(ctx, next) {
    // const { ServerResponse, BusinessCode } = ctx.response;
    // const { NO_PRIVILEGES } = BusinessCode;

    // const menus = ctx.session.menus;
    // const pmenus = menus.map(v => {
    //   return v.key;
    // });
    // if (!~pmenus.indexOf('console')) {
    //   ctx.body = ServerResponse.createByErrorCodeMsg(
    //     NO_PRIVILEGES,
    //     '无权限操作'
    //   );
    //   return;
    // }

    await next();
  };
};
