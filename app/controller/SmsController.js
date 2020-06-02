/*
 * @Author: eds
 * @Date: 2020-04-23 11:27:48
 * @LastEditTime: 2020-06-02 15:58:25
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\smsController.js
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
    this.UserService = ctx.service.userService;
    this.CompanyService = ctx.service.companyService;
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
    const params = this.ctx.request.body;
    if (params.code == code) {
      if (+new Date() - +new Date(updatedAt) > _TIMEOUT_) {
        this.ctx.body = this.ServerResponse.createByErrorMsg("验证码已失效");
      } else {
        //  verify success
        //  uuid in companys by pch
        const company = await this.CompanyService.getCompanyInfoByPchSimple({
          uuid: params.username,
        });
        if (!company.getData())
          return (this.ctx.body = this.ServerResponse.createByErrorMsg(
            "该企业不在本年度亩均论英雄考核范围内,请联系街道"
          ));
        //  uuid in users by username
        const user = await this.UserService.getUserByUsername(params.username);
        if (user.getData())
          return (this.ctx.body = this.ServerResponse.createByErrorMsg(
            "该企业已注册"
          ));
        //  add user by username
        const response = await this.UserService.createUser(this.ctx, {
          ...params,
          department: 0,
          group: [3],
          isActive: 1,
          job: [],
        });
        if (response.isSuccess() && response.data) {
          this.ctx.session.currentUser = response.getData();
        }
        this.ctx.body = response;
      }
    } else {
      this.ctx.body = this.ServerResponse.createByErrorMsg("验证码错误");
    }
  }
}

module.exports = SmsController;
