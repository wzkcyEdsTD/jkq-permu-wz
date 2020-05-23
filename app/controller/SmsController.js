/*
 * @Author: your name
 * @Date: 2020-04-23 11:27:48
 * @LastEditTime: 2020-05-21 21:15:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jkq-permu-wz\app\controller\SmsController.js
 */

const Controller = require("egg").Controller;
const soap = require("soap");

/**
 * webService params
 * @param {array} destinationAddresses phoneNumber
 * @return {object}
 */
const verifySmsParam = (destinationAddresses = ["13967756333"]) => {
  return {
    destinationAddresses,
    message: "123",
    extendCode: "3",
    applicationId: "8032001",
    password: "ekvlRpoKsjRG",
  };
};
class SmsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 短信机webservice
   * @memberof SmsController
   */
  async index() {
    const { ctx } = this;
    const { smsURL } = ctx.app.config.externalAPI.oGateway;
    soap.createClient("http://wz023.openmas.net:9080/OpenMasService?wsdl", (err, client) => {
      console.log("[client]", client);
      client.SendMessage3(verifySmsParam(), (err, result) => {
        console.log(err || result);
      });
    });
    ctx.body = this.ServerResponse.createBySuccessMsg("done");
  }
}

module.exports = SmsController;
