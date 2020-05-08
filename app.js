/**
 * doinit with port on
 * update by eds 2020/4/24
 * @param {*} app
 */
const init = async (app) => {
  app.beforeStart(async () => {
    // await app.model.sync({ force: true });
    await app.model.sync();
    console.log("[egg.model] database on");
  });
};
module.exports = init;
