/*
 * @Author: eds
 * @Date: 2020-05-27 11:04:00
 * @LastEditTime: 2020-05-27 11:15:16
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\service\SmsService.js
 */

const Service = require("egg").Service;

class CompanyService extends Service {
  constructor(ctx) {
    super(ctx);
    this.SmsCodeModel = ctx.model.SmsCodeModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * insert sms record
   * @param {*} { masid, phone, code }
   * @memberof CompanyService
   */
  async insertSmsCode({ masid, phone, code }) {
    await this.SmsCodeModel.create({ masid, phone, code });
    return this.ServerResponse.createBySuccessMsg("短信发送成功");
  }

  /**
   * verify sms code by time < 60s [desc]
   * @param {*} { phone, code }
   * @memberof CompanyService
   */
  async verifySmsCode(phone) {
    const record = await this.SmsCodeModel.findOne({
      where: { phone },
      order: [["updated_at", "DESC"]],
    });
    return this.ServerResponse.createBySuccessData(record);
  }
}

module.exports = CompanyService;
