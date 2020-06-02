import React, { PureComponent } from "react";
import { Form, Input, Row, Col, Divider, Button } from "antd";
import shortid from "shortid";
import autobind from "autobind-decorator";
import { checkMobile, checkUuid, positiveNumber } from "utils/validation";

const SINGLE_ELEC = {
  uuid: undefined,
  name: 2,
  elec: undefined,
  link: undefined,
  linkphone: undefined,
};
const formt1 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formt2 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
class CompanyElecForm extends PureComponent {
  state = {
    elecList: [],
  };

  /**
   * 表单企业组新增标识
   * @memberof CompanyElecForm
   */
  addCompany = () => {
    const { elecList } = this.state;
    this.setState({
      elecList: elecList.concat(
        _.cloneDeep({ ...SINGLE_ELEC, id: shortid.generate() })
      ),
    });
  };

  /**
   * 根据标识删除表单企业组
   * @param {String} 标识
   * @memberof CompanyElecForm
   */
  removeCompany = id => {
    const { elecList } = this.state;
    this.setState({ elecList: elecList.filter(v => v.id != id) });
  };

  /**
   * 获取企业名称
   * @param {*} uuid
   * @param {*} id
   */
  async fetchCompanyNameByUuid(uuid, id) {
    const { setFieldsValue } = this.props.form;
    const { fetchCompanyNameByUuid } = this.props;
    if (!reg.test(uuid)) return false;
    const company = await fetchCompanyNameByUuid([uuid]);
    setFieldsValue({ [`name-${id}`]: company[uuid] || "未找到企业信息" });
  }

  /**
   * 表单组
   * @returns
   * @memberof CompanyElecForm
   */
  @autobind
  renderElecItem() {
    const { getFieldDecorator } = this.props.form;
    const { elecList } = this.state;
    return _.map(elecList, (single_elec, key) => (
      <div key={key}>
        <Row gutter={24}>
          <Col span={9}>
            <Form.Item {...formt1} label="统一信用代码">
              {getFieldDecorator(`uuid-${single_elec.id}`, {
                rules: [
                  { required: true, message: "请填写统一信用代码" },
                  { validator: checkUuid },
                ],
              })(
                <Input
                  onBlur={e => {
                    this.fetchCompanyNameByUuid(
                      e.currentTarget.value,
                      single_elec.id
                    );
                  }}
                  onChange={e => {
                    this.fetchCompanyNameByUuid(
                      e.currentTarget.value,
                      single_elec.id
                    );
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item {...formt1} label="企业名称">
              {getFieldDecorator(`name-${single_elec.id}`)(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item {...formt2} offset={2} label="用电量">
              {getFieldDecorator(`elec-${single_elec.id}`, {
                rules: [
                  { required: true, message: "请填写用电量" },
                  {
                    validator: positiveNumber,
                  },
                ],
              })(<Input type="number" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...formt2} label="联系人">
              {getFieldDecorator(`link-${single_elec.id}`, {
                rules: [{ required: true, message: "请填写联系人" }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...formt2} label="联系人方式">
              {getFieldDecorator(`linkphone-${single_elec.id}`, {
                rules: [
                  { required: true, message: "请填写联系人方式" },
                  { validator: checkMobile },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={2}>
            <Button onClick={e => this.removeCompany(single_elec.id)}>
              删除
            </Button>
          </Col>
        </Row>
        <Divider />
      </div>
    ));
  }

  render() {
    return (
      <div>
        <Button onClick={this.addCompany}>新增企业用电记录</Button>
        <Form>{this.renderElecItem()}</Form>
      </div>
    );
  }
}

export default Form.create()(CompanyElecForm);
