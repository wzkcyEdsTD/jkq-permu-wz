"use strict";

const Controller = require("egg").Controller;

class PageController extends Controller {
  async login() {
    const { ctx } = this;
    await ctx.render("login.js");
  }
  async index() {
    const { ctx } = this;
    await ctx.render("app.js");
  }
}

module.exports = PageController;
