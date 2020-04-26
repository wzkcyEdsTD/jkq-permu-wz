"use strict";

const Controller = require("egg").Controller;

class PageController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async login() {
    const { ctx } = this;
    await ctx.render("login.js");
  }
  async index() {
    const { ctx } = this;
    console.log(ctx.url);
    if (!ctx.session.currentUser) {
      return ctx.redirect(`/login`);
    } else {
      const menus = ctx.session.menus;
      if (!menus || ctx.url == "/") {
        await ctx.render("app.js");
      } else {
        const pmenus = menus.map((v) => v.p_link);
        if (!~pmenus.indexOf(ctx.url)) {
          return (ctx.body = this.ServerResponse.createByErrorMsg(
            "无权限操作"
          ));
        } else {
          await ctx.render("app.js");
        }
      }
    }
  }
}

module.exports = PageController;
