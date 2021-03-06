import React, { Component } from "react";
import { observer } from "mobx-react";
import shortid from "shortid";
import {
  Form,
  Input,
  Divider,
  Table,
  Tag,
  Select,
  Statistic,
  Row,
  Col,
  Tooltip,
  Icon,
  Upload,
  AutoComplete,
  Button,
  message,
} from "antd";
const AutoCompleteOption = AutoComplete.Option;
const Option = Select.Option;
import _ from "lodash";
import { toJS } from "mobx";
const { Item: FormItem } = Form;
import { checkMobile } from "utils/validation";
import autobind from "autobind-decorator";
export const COMPANY_DATA_FORM_HASH = Symbol("companydata");
const COMPANY_LAND_HASH = Symbol("landtag");
const COMPANY_ELEC_HASH = Symbol("electag");
import { villageOption } from "enums/Village";
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
const vreg = /^3303710[0-9]{5}$/;
const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/;

/**
 * 企业信息填报核对
 * @class CompanyDataForm
 * @extends {Component}
 */
@observer
class CompanyDataForm extends Component {
  state = {
    exportLoad: false,
    company_mj_lands: [],
    company_mj_land_rent: [],
    fileList: [],
    autoResult: [],
  };

  @autobind
  async componentDidMount() {
    const { company } = this.props;
    const uuids2names = await this.fetchCompanyNameByUuid([
      ...new Set([
        ...company.company_mj_lands.map(v => v.uuid),
        ...company.company_mj_land_rent.map(v => v.to_object),
      ]),
    ]);
    this.setState({
      company_mj_lands: company.company_mj_lands.map((v, index) => ({
        ...v,
        key: `t${index}`,
        cname: uuids2names[v.uuid] || "",
        edit: false,
      })),
      company_mj_land_rent: company.company_mj_land_rent.map((v, index) => ({
        ...v,
        key: `_t${index}`,
        cname: uuids2names[v.to_object] || "",
        edit: false,
      })),
      fileList: company.company_evidences.map((v, index) => ({
        name: `${v.filename}  | 【上传时间】${new Date(
          v.createdAt
        ).toLocaleString()}`,
        status: "done",
        uid: v.id,
        url: `http://${window.location.host}${v.fileurl}`,
      })),
    });
  }

  landColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    {
      title: "用地类别",
      dataIndex: "type",
      render: (t, r) => (
        <Tag color={t ? "geekblue" : "green"}>
          {t ? "自有用地" : "租赁用地"}
        </Tag>
      ),
    },
    {
      title: "用地面积(亩)",
      dataIndex: "area",
      width: 180,
      render: (t, r) =>
        r.edit ? (
          <Input
            className={`area_${r.id}`}
            defaultValue={t}
            type="number"
            placeholder="输入用地面积"
          />
        ) : (
          t
        ),
    },
    {
      title: (
        <Tooltip title={"多个用电户号用'逗号'隔开"}>
          企业用电户号
          <Icon
            type="question-circle"
            style={{
              fontSize: 18,
              marginLeft: 10,
              verticalAlign: "middle",
            }}
          />
        </Tooltip>
      ),
      dataIndex: "elecmeter",
      render: (t, r) =>
        r.edit ? (
          <Input
            className={`elecmeter_${r.id}`}
            defaultValue={t}
            placeholder="输入电表号"
          />
        ) : (
          t
        ),
    },
    {
      title: "用电量(千瓦时)",
      dataIndex: "elec",
      render: (t, r) =>
        r.edit ? (
          <Input
            defaultValue={t}
            className={`elec_${r.id}`}
            type="number"
            placeholder="输入用电量"
          />
        ) : (
          t
        ),
    },
    {
      title: "出租对象",
      dataIndex: "cname",
      render: (t, r) => (r.type ? "" : t),
    },
    {
      title: "统一信用代码/行政区划代码",
      dataIndex: "uuid",
      width: 280,
      render: (t, r) =>
        r.edit ? (
          <AutoComplete
            className={`uuid_${r.id}`}
            defaultValue={t}
            onSearch={value => {
              const autoResult = villageOption.filter(v => ~v.indexOf(value));
              this.setState({ autoResult });
            }}
            placeholder="输入统一信用代码/行政区划代码"
          >
            {this.state.autoResult.map((v, index) => (
              <AutoCompleteOption key={v} value={v}>
                {v}
              </AutoCompleteOption>
            ))}
          </AutoComplete>
        ) : (
          t
        ),
    },
    {
      title: "操作",
      width: 180,
      dataIndex: "action",
      render: (t, r) => (
        <span>
          {r.edit ? (
            <span>
              <Button
                type="primary"
                onClick={e =>
                  this.editConfirmRecord(COMPANY_LAND_HASH, false, false, r, e)
                }
              >
                确认
              </Button>
              <Button
                onClick={() =>
                  this.editConfirmRecord(COMPANY_LAND_HASH, false, true, r)
                }
              >
                取消
              </Button>
            </span>
          ) : (
            <Button
              onClick={() =>
                this.editConfirmRecord(COMPANY_LAND_HASH, true, false, r)
              }
            >
              编辑
            </Button>
          )}
          {r.type ? undefined : (
            <a
              style={{ marginLeft: 10 }}
              onClick={() => this.removeRecord(COMPANY_LAND_HASH, r)}
            >
              删除
            </a>
          )}
        </span>
      ),
    },
  ];

  landRentColumns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      render: (t, r, index) => ++index,
    },
    { title: "承租企业信用代码", dataIndex: "to_object", key: "to_object" },
    { title: "承租企业名称", dataIndex: "cname", key: "cname" },
    { title: "出租用地面积(亩)", dataIndex: "area", key: "area" },
    { title: "企业用电户号", dataIndex: "elecmeter", key: "elecmeter" },
    { title: "用电量(千瓦时)", dataIndex: "elec", key: "elec" },
  ];

  /**
   * 传输返回
   * @param {*} info
   * @memberof CompanyUploadLE
   */
  @autobind
  UploadEvidenceChange(e) {
    const _fileList_ = [...e.fileList];
    let fileList = _fileList_.map(v => {
      if (v.response && e.file.uid == v.uid && e.file.status == "done") {
        v.url = `http://${window.location.host}${v.response.msg.msg}`;
        v.name = `${v.name}  | 【上传时间】${new Date().toLocaleString()}`;
      }
      return v;
    });
    if (e.file.status == "done") {
      const _single_ = fileList.pop();
      fileList = [_single_].concat(fileList);
      fileList.length = fileList.length > 3 ? 3 : fileList.length;
      this.setState({ fileList });
    } else {
      this.setState({ fileList });
    }
  }

  /**
   * 获取企业名称
   * @param {*} uuids
   * @memberof CompanyDataForm
   */
  @autobind
  async fetchCompanyNameByUuid(uuids) {
    const { fetchCompanyNameByUuid } = this.props;
    const uuids2names = await fetchCompanyNameByUuid(uuids);
    return uuids2names;
  }

  /**
   * 增加表格记录
   * @param {*} HASH
   * @memberof CompanyDataForm
   */
  @autobind
  addRecord(HASH) {
    const { company_mj_lands } = this.state;
    console.log("[addRecord]", HASH);
    switch (HASH) {
      case COMPANY_LAND_HASH: {
        this.setState({
          company_mj_lands: company_mj_lands.concat([
            {
              type: 0,
              area: 0,
              elecmeter: "",
              elec: 0,
              uuid: "",
              id: shortid.generate(),
              edit: true,
            },
          ]),
        });
        break;
      }
    }
  }
  /**
   * 删除表格记录
   * @param {*} HASH
   * @param {*} r 条目信息
   * @memberof CompanyDataForm
   */
  @autobind
  removeRecord(HASH, r) {
    const { company_mj_lands } = this.state;
    console.log("[removeRecord]", HASH);
    switch (HASH) {
      case COMPANY_LAND_HASH: {
        this.setState({
          company_mj_lands: company_mj_lands.filter(v => v.id != r.id),
        });
        break;
      }
    }
  }

  /**
   * 获取村行政代码
   * @param {*} id
   * @returns
   * @memberof CompanyUploadLE
   */
  @autobind
  getVillageCode(id) {
    const value = document
      .getElementsByClassName(`uuid_${id}`)[0]
      .getElementsByClassName("ant-input")[0].value;
    return ~value.indexOf("]") ? value.split("]")[1] : value;
  }

  @autobind
  getElecMeter(id) {
    return document.getElementsByClassName(`elecmeter_${id}`)[0].value;
  }

  /**
   * 编辑|确认表格记录
   * @param {*} HASH
   * @param {*} edit
   * @param {*} isCancel
   * @param {*} r
   * @param {*} event
   * @memberof CompanyDataForm
   */
  @autobind
  async editConfirmRecord(HASH, edit, isCancel, r, event) {
    const { company_mj_lands } = this.state;
    console.log(`[${isCancel ? "cancel" : edit ? "edit" : "confirm"}]`, HASH);
    const _uuid_ = !edit
      ? HASH == COMPANY_LAND_HASH
        ? this.getVillageCode(r.id)
        : this.getElecMeter(r.id)
      : undefined;
    if (!this.verifyEdit(HASH, edit, isCancel, r, _uuid_)) return;
    const uuids2names =
      HASH == COMPANY_LAND_HASH && !edit && !isCancel
        ? await this.fetchCompanyNameByUuid([_uuid_])
        : "";
    switch (HASH) {
      case COMPANY_LAND_HASH: {
        edit
          ? this.setState({
              company_mj_lands: company_mj_lands.map(v =>
                v.id == r.id ? { ...v, edit } : v
              ),
            })
          : this.setState({
              company_mj_lands: company_mj_lands.map(v =>
                v.id == r.id
                  ? {
                      ...r,
                      cname: isCancel ? r.cname : uuids2names[_uuid_],
                      area: isCancel
                        ? r.area
                        : document.getElementsByClassName(`area_${r.id}`)[0]
                            .value,
                      elecmeter: isCancel
                        ? r.elecmeter
                        : document.getElementsByClassName(
                            `elecmeter_${r.id}`
                          )[0].value,
                      elec: isCancel
                        ? r.elec
                        : document.getElementsByClassName(`elec_${r.id}`)[0]
                            .value,
                      uuid: isCancel ? r.uuid : _uuid_,
                      edit,
                    }
                  : v
              ),
            });
        break;
      }
    }
  }

  /**
   * 验证是否可以编辑
   * @param {*} edit
   * @param {*} isCancel
   * @param {*} r
   * @memberof CompanyDataForm
   */
  @autobind
  verifyEdit(HASH, edit, isCancel, r, _uuid_) {
    const { company_mj_lands } = this.state;
    //  若为请求编辑或取消编辑
    if (edit || isCancel) return true;
    //  若为编辑结束
    switch (HASH) {
      case COMPANY_LAND_HASH: {
        const uuid = _.trim(_uuid_);
        const area = document.getElementsByClassName(`area_${r.id}`)[0].value;
        const elec = document.getElementsByClassName(`elec_${r.id}`)[0].value;
        if (!reg.test(uuid) && !vreg.test(uuid)) {
          message.error(`请输入正确的统一信用代码/行政区划代码`);
          return false;
        }
        if (
          ~company_mj_lands.map(v => v.uuid).indexOf(uuid) &&
          company_mj_lands.filter(v => v.uuid == uuid)[0].id != r.id
        ) {
          message.error(`该企业已存在 [${uuid}] 出租企业数据`);
          return false;
        }
        if (area < 0) {
          message.error(`请输入正确的用地数据`);
          return false;
        }
        if (elec < 0) {
          message.error(`请输入正确的用电数据`);
          return false;
        }
        return true;
      }
    }
  }

  /**
   * 下载凭证模板
   * @memberof CompanyUploadLE
   */
  @autobind
  async downLoadEvidence() {
    const { company, exportEvidence } = this.props;
    const { company_mj_lands, company_mj_land_rent } = this.state;
    this.setState({ exportLoad: true });
    try {
      const { fileURL } = await exportEvidence(
        company,
        company_mj_lands,
        company_mj_land_rent
      );
      message.success("凭证生成成功");
      window.open(`http://${window.location.host}${fileURL}`);
    } catch (e) {
    } finally {
      this.setState({ exportLoad: false });
    }
  }

  /**
   * 获取统计界面
   * @param {*} hash
   * @returns
   * @memberof CompanyUploadLE
   */
  getstastic(hash) {
    const { company } = this.props;
    const { extraIndex, company_mj_lands } = this.state;
    const isLand = hash == COMPANY_LAND_HASH;
    const index = isLand ? 0 : 1;
    let self = 0,
      get = 0;
    company_mj_lands.map(d => {
      self += d.type == 1 ? parseFloat(isLand ? d.area : d.elec) : 0;
      get += d.type != 1 ? parseFloat(isLand ? d.area : d.elec) : 0;
    });
    const rent = isLand ? company.landr : company.elecr;
    return (
      <Row gutter={24} style={{ marginTop: 10, marginBottom: 8 }}>
        <Col span={3} offset={4}>
          <Statistic
            title={isLand ? "自有用地(亩)" : "自有用电(千瓦时)"}
            value={self}
          />
        </Col>
        <Col span={1} className="char">
          +
        </Col>
        <Col span={3}>
          <Statistic
            title={isLand ? "租赁用地(亩)" : "租赁用电(千瓦时)"}
            value={get}
          />
        </Col>
        <Col span={1} className="char">
          -
        </Col>
        <Col span={3}>
          <Statistic
            title={isLand ? "出租用地(亩)" : "出租用电(千瓦时)"}
            value={rent}
          />
        </Col>
        <Col span={1} className="char">
          =
        </Col>
        <Col span={3}>
          <Statistic
            title={isLand ? "实际用地(亩)" : "实际用电(千瓦时)"}
            value={self + get - rent}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const { form, company, status } = this.props;
    const {
      exportLoad,
      company_mj_lands,
      company_mj_land_rent,
      fileList,
    } = this.state;
    const { getFieldDecorator } = form;
    // getFieldDecorator("id", { initialValue: company.id });
    return (
      <Form className="form-companyUploadBasic">
        <Divider dashed orientation="left" className="basic_divider">
          [ {company.name} ] 基本信息
        </Divider>
        <FormItem {...formItemLayout} label="公司名称">
          {getFieldDecorator("name", {
            initialValue: company.name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="企业信用代码">
          {getFieldDecorator("uuid", {
            initialValue: company.uuid,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="企业地址">
          {getFieldDecorator("address", {
            initialValue: company.address,
          })(<Input placeholder="请输入企业地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="法人联系方式">
          {getFieldDecorator("legalphone", {
            initialValue: company.legalphone,
            rules: [{ validator: checkMobile }],
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="企业状态">
          {getFieldDecorator("state", {
            initialValue: company.state,
          })(
            <Select>
              {status.map(item => (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Divider dashed orientation="left" className="land_divider">
          [ 用地用电凭证上传 ]
          {
            <Tooltip title={`用地用电凭证以最新一条凭证为准`}>
              <Icon
                type="question-circle"
                style={{
                  fontSize: 18,
                  marginLeft: 10,
                  verticalAlign: "middle",
                }}
              />
            </Tooltip>
          }
        </Divider>
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          loading={exportLoad}
          onClick={this.downLoadEvidence}
        >
          生成凭证
        </Button>
        <Upload
          accept="image/gif,image/jpeg,image/jpg,image/png"
          action={`${window.__API_CONFIG__.fwGateway.baseURL}/mj/evidence/upload/${company.pch}/${company.uuid}`}
          onChange={this.UploadEvidenceChange}
          fileList={fileList}
        >
          <Button type="primary">上传凭证</Button>
        </Upload>
        <Divider dashed orientation="left" className="land_divider">
          [ {company.name} ] 用地用电数据登记
        </Divider>
        <Button
          type="primary"
          onClick={() => this.addRecord(COMPANY_LAND_HASH)}
        >
          新增用地/用电数据
        </Button>
        {company_mj_lands.length ? (
          <Table
            dataSource={toJS(company_mj_lands)}
            columns={this.landColumns}
            pagination={false}
            bordered
            rowClassName={r =>
              `sub-table-row-${r.type} ${r.type ? "_self" : "_other"}`
            }
            rowKey={r => `land_${r.id}`}
            defaultExpandedRowKeys={["t0"]}
            expandedRowRender={r => {
              return r.type ? (
                <Table
                  title={() => "企业用地出租信息"}
                  rowKey={r => `landr_${r.id}`}
                  size="small"
                  bordered
                  columns={this.landRentColumns}
                  pagination={false}
                  dataSource={company_mj_land_rent}
                />
              ) : undefined;
            }}
          />
        ) : undefined}
        {this.getstastic(COMPANY_LAND_HASH)}
        {this.getstastic(COMPANY_ELEC_HASH)}
      </Form>
    );
  }
}

export default Form.create()(CompanyDataForm);
