"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.pageController.index);

  require("./router/page")(app);

  require("./router/api")(app);
};
