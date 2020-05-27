/*
 * @Author: eds
 * @Date: 2020-04-23 11:27:48
 * @LastEditTime: 2020-05-27 11:35:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\SmsController.js
 */
const Controller = require("egg").Controller;
const soap = require("soap");
const _TIMEOUT_ = 65 * 1000;
/**
 * sendMessage
 * @param {*} ctx
 * @param {*} phone
 * @param {*} code
 */
const sms = async (ctx, phone, code) => {
  return new Promise(resolve => {
    const { smsURL } = ctx.app.config.externalAPI.oGateway;
    const args = {
      _xml: `<SendMessage3 xmlns="http://openmas.chinamobile.com/sms"><destinationAddresses xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><a:string>${phone}</a:string></destinationAddresses><message>温州经开区亩均论英雄 平台验证码【${code}】</message><extendCode>3</extendCode><applicationId>8032001</applicationId><password>ekvlRpoKsjRG</password></SendMessage3>`,
    };
    soap.createClient(smsURL, (err, client) => {
      client.SendMessage3(args, (err, result) => {
        resolve(result);
      });
    });
  });
};

/**
 * 生成n位随机数
 * @param {*} len
 */
const getCode = (len = 4) => {
  return Array(0, 0, 0, 0)
    .map(v => "0123456789"[Math.floor(Math.random() * 10)])
    .join("");
};

/**
 * SmsController
 * @class SmsController
 * @extends {Controller}
 */
class SmsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SmsService = ctx.service.smsService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 短信机webservice
   * @memberof SmsController
   */
  async index() {
    const { ctx } = this;
    const { phone } = ctx.params;
    const code = getCode();
    const { SendMessage3Result } = await sms(ctx, phone, code);
    const response = await this.SmsService.insertSmsCode({
      masid: SendMessage3Result,
      phone,
      code,
    });
    ctx.body = response;
  }

  /**
   * 短信机验证
   * @memberof SmsController
   */
  async verify() {
    const { data } = await this.SmsService.verifySmsCode(this.ctx.params.phone);
    const { code, updatedAt } = data;
    if (this.ctx.request.body.code == code) {
      if (+new Date() - +new Date(updatedAt) > _TIMEOUT_) {
        this.ctx.body = this.ServerResponse.createByErrorMsg("验证码已失效");
      } else {
        this.ctx.body = this.ServerResponse.createBySuccessMsg("验证成功");
      }
    } else {
      this.ctx.body = this.ServerResponse.createByErrorMsg("验证码错误");
    }
  }
}

module.exports = SmsController;
