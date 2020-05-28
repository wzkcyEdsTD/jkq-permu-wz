import React, { Component } from "react";
import { observer } from "mobx-react";
import shortid from "shortid";
import {
  Form,
  Input,
  Divider,
  Table,
  Button,
  Tag,
  Select,
  message,
  Statistic,
  Row,
  Col,
  List,
  Icon,
  Tooltip,
} from "antd";
import _ from "lodash";
import { toJS } from "mobx";
import autobind from "autobind-decorator";
export const COMPANY_DATA_FORM_HASH = Symbol("companydata");
const COMPANY_LAND_HASH = Symbol("landtag");
const COMPANY_ELEC_HASH = Symbol("electag");
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const vreg = /^3303710[0-9]{5}/g;
const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;

/**
 * 企业信息填报核对
 * @class CompanyDataForm
 * @extends {Component}
 */
@observer
class CompanyUploadEL extends Component {
  state = {
    savingLoad: false,
    company_mj_lands: [],
    company_mj_elecs: [],
    company_mj_land_rent: [],
    basicIndex: [
      { title: "实缴税金(万)", v: "tax", value: 0, check: false },
      { title: "主营业收入(万)", v: "revenue", value: 0, check: false },
      { title: "纳税登记时间", v: "taxtime", value: 0, check: false },
      { title: "工业增加值(万)", v: "industrial", value: 0, check: false },
      { title: "年平均员工数(人)", v: "staff", value: 0, check: false },
      { title: "年综合能耗(吨标煤)", v: "energy", value: 0, check: false },
      { title: "研发经费(万)", v: "rde", value: 0, check: false },
      { title: "排污量(吨)", v: "sewage", value: 0, check: false },
    ],
    extraIndex: [
      { title: "用地数据", v: "land", check: false },
      { title: "用电数据", v: "elec", check: false },
    ],
    scale: 1,
  };

  @autobind
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.doProps();
  }

  @autobind
  componentDidMount() {
    this.doProps();
  }

  /**
   * 公司赋值
   * @returns
   * @memberof CompanyUploadEL
   */
  @autobind
  async doProps() {
    const { company } = this.props;
    const { basicIndex, extraIndex } = this.state;
    if (!company.uuid) return;
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
      company_mj_elecs: company.company_mj_elecs.map(v => ({
        ...v,
        edit: false,
      })),
      company_mj_land_rent: company.company_mj_land_rent.map((v, index) => ({
        ...v,
        key: `_t${index}`,
        cname: uuids2names[v.to_object] || "",
        edit: false,
      })),
      basicIndex: basicIndex.map(v => ({
        ...v,
        check: company.company_mj_data_state[v.v],
        value: company.company_mj_datum[v.v] || 0,
        checkable: company.company_mj_data_state[v.v] ? false : true,
      })),
      extraIndex: extraIndex.map(v => ({
        ...v,
        check: company.company_mj_data_state[v.v],
        checkable: company.company_mj_data_state[v.v] ? false : true,
      })),
    });
  }

  elecColumns = [
    {
      title: "序号",
      dataIndex: "id",
      width: 80,
      render: (t, r, index) => ++index,
    },
    {
      title: (
        <Tooltip title={"若无电表号则填写统一信用代码"}>
          企业电表号
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
        r.edit ? <Input className={`elecmeter_${r.id}`} defaultValue={t} /> : t,
    },
    {
      title: "年度用电表(千瓦时)",
      dataIndex: "elec",
      render: (t, r) =>
        r.edit ? (
          <Input defaultValue={t} className={`elec_${r.id}`} type="number" />
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
                  this.editConfirmRecord(COMPANY_ELEC_HASH, false, false, r, e)
                }
              >
                确认
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                onClick={() =>
                  this.editConfirmRecord(COMPANY_ELEC_HASH, false, true, r)
                }
              >
                取消
              </Button>
            </span>
          ) : (
            <Button
              onClick={() =>
                this.editConfirmRecord(COMPANY_ELEC_HASH, true, false, r)
              }
            >
              编辑
            </Button>
          )}
          <a
            style={{ marginLeft: 10 }}
            onClick={() => this.removeRecord(COMPANY_ELEC_HASH, r)}
          >
            删除
          </a>
        </span>
      ),
    },
  ];

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
      title: "用地面积(平方米)",
      dataIndex: "area",
      width: 180,
      render: (t, r) =>
        r.edit ? (
          <Input className={`area_${r.id}`} defaultValue={t} type="number" />
        ) : (
          t
        ),
    },
    {
      title: "出租对象信息",
      dataIndex: "cname",
      render: (t, r) => (r.type ? "" : t),
    },
    {
      title: "统一信用代码/行政区划代码",
      dataIndex: "uuid",
      width: 200,
      render: (t, r) =>
        r.edit ? (
          <Input className={`uuid_${r.id}`} defaultValue={t} />
        ) : r.type ? (
          ""
        ) : (
          t
        ),
    },
    {
      title: "操作",
      width: 260,
      dataIndex: "action",
      render: (t, r) => (
        <span>
          {r.type ? (
            ""
          ) : r.edit ? (
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
                style={{ marginLeft: 10 }}
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
            <Button style={{ marginLeft: 10 }} type="primary">
              上传凭证
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
    // { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "承租企业信用代码", dataIndex: "to_object", key: "to_object" },
    { title: "承租企业名称", dataIndex: "cname", key: "cname" },
    { title: "出租用地面积(平方米)", dataIndex: "area", key: "area" },
    {
      title: "操作",
      dataIndex: "action",
      render: (t, r) => <Button type="primary">上传凭证</Button>,
    },
  ];

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
    const { company_mj_elecs, company_mj_lands } = this.state;
    console.log("[addRecord]", HASH);
    switch (HASH) {
      case COMPANY_ELEC_HASH: {
        this.setState({
          company_mj_elecs: company_mj_elecs.concat([
            {
              elecmeter: "",
              elec: 0,
              id: shortid.generate(),
              edit: true,
            },
          ]),
        });
        break;
      }
      case COMPANY_LAND_HASH: {
        this.setState({
          company_mj_lands: company_mj_lands.concat([
            {
              type: 0,
              area: 0,
              uuid: 0,
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
    const { company_mj_elecs, company_mj_lands } = this.state;
    console.log("[removeRecord]", HASH);
    switch (HASH) {
      case COMPANY_ELEC_HASH: {
        this.setState({
          company_mj_elecs: company_mj_elecs.filter(v => v.id != r.id),
        });
        break;
      }
      case COMPANY_LAND_HASH: {
        this.setState({
          company_mj_lands: company_mj_lands.filter(v => v.id != r.id),
        });
        break;
      }
    }
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
    const { company_mj_elecs, company_mj_lands } = this.state;
    console.log(`[${isCancel ? "cancel" : edit ? "edit" : "confirm"}]`, HASH);
    if (!this.verifyEdit(HASH, edit, isCancel, r)) return;
    const uuids2names =
      HASH == COMPANY_LAND_HASH && !edit && !isCancel
        ? await this.fetchCompanyNameByUuid([
            document.getElementsByClassName(`uuid_${r.id}`)[0].value,
          ])
        : "";
    switch (HASH) {
      case COMPANY_ELEC_HASH: {
        edit
          ? this.setState({
              company_mj_elecs: company_mj_elecs.map(v =>
                v.id == r.id ? { ...v, edit } : v
              ),
            })
          : this.setState({
              company_mj_elecs: company_mj_elecs.map(v =>
                v.id == r.id
                  ? {
                      ...r,
                      elecmeter: isCancel
                        ? r.elecmeter
                        : document.getElementsByClassName(
                            `elecmeter_${r.id}`
                          )[0].value,
                      elec: isCancel
                        ? r.elec
                        : document.getElementsByClassName(`elec_${r.id}`)[0]
                            .value,
                      edit,
                    }
                  : v
              ),
            });
        break;
      }
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
                      cname: isCancel
                        ? r.cname
                        : uuids2names[
                            document.getElementsByClassName(`uuid_${r.id}`)[0]
                              .value
                          ],
                      area: isCancel
                        ? r.area
                        : document.getElementsByClassName(`area_${r.id}`)[0]
                            .value,
                      uuid: isCancel
                        ? r.uuid
                        : document.getElementsByClassName(`uuid_${r.id}`)[0]
                            .value,
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
  verifyEdit(HASH, edit, isCancel, r) {
    const { company_mj_elecs, company_mj_lands } = this.state;
    //  若为请求编辑或取消编辑
    if (edit || isCancel) return true;
    //  若为编辑结束
    switch (HASH) {
      case COMPANY_ELEC_HASH: {
        const elecmeter = document.getElementsByClassName(
          `elecmeter_${r.id}`
        )[0].value;
        const elec = document.getElementsByClassName(`elec_${r.id}`)[0].value;
        if (
          ~company_mj_elecs.map(v => v.elecmeter).indexOf(elecmeter) &&
          company_mj_elecs.filter(v => v.elecmeter == elecmeter)[0].id != r.id
        ) {
          message.error(`该企业已存在 [${elecmeter}] 电表数据`);
          return false;
        }
        if (elec <= 0) {
          message.error(`请输入正确的用电数据`);
          return false;
        }
        return true;
      }
      case COMPANY_LAND_HASH: {
        const uuid = _.trim(
          document.getElementsByClassName(`uuid_${r.id}`)[0].value
        );
        const area = document.getElementsByClassName(`area_${r.id}`)[0].value;
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
        if (area <= 0) {
          message.error(`请输入正确的用地数据`);
          return false;
        }
        return true;
      }
    }
  }

  /**
   * 状态确认
   * @param {*} index
   * @param {*} isb [true] basic [false] land&elec
   * @memberof CompanyUploadEL
   */
  @autobind
  checkIcon(index, isb) {
    const { basicIndex, extraIndex } = this.state;
    const Index = isb ? basicIndex : extraIndex;
    Index[index].check = !Index[index].check;
    this.setState({ [isb ? "basicIndex" : "extraIndex"]: Index });
  }

  /**
   * 更新企业指标状态
   * @memberof CompanyUploadEL
   */
  @autobind
  async updateCompanyDataState() {
    const { company, updateCompanyDataState } = this.props;
    const { basicIndex, extraIndex } = this.state;
    const states = {};
    [...basicIndex, ...extraIndex].map(v => {
      states[v.v] = v.check;
    });
    this.setState({ savingLoad: true });
    try {
      await updateCompanyDataState({
        uuid: company.uuid,
        pch: company.pch,
        name: company.name,
        states,
      });
    } finally {
      this.setState({ savingLoad: false });
    }
  }

  render() {
    const { company } = this.props;
    const {
      savingLoad,
      company_mj_elecs,
      company_mj_lands,
      company_mj_land_rent,
      scale,
      basicIndex,
      extraIndex,
    } = this.state;

    const landget =
      eval(
        company_mj_lands
          .filter(d => d.type != 1)
          .map(d => d.area)
          .join("+")
      ) || 0;
    return (
      <div>
        <div className="companyUploadHeader">
          <span style={{ fontWeight: "bold" }}>[ 2019年度 ]</span>
          {` ${company.name || " 公司名"} - ${scale ? "规上" : "规下"}企业 - ${
            company.street
          }`}
        </div>
        <Form className="form-companyUploadBasic">
          <Divider dashed orientation="left" className="basic_divider">
            [ 指标数据确认 ]
            {
              <Tooltip title={`如有疑问请联系 [${company.street}] 工作人员`}>
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
          <List
            size="small"
            grid={{ gutter: 16, column: 4 }}
            style={{ textAlign: "center" }}
            dataSource={basicIndex}
            renderItem={({ title, value, check, checkable }, index) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <span style={{ fontSize: 16, verticalAlign: "middle" }}>
                      {title}
                    </span>
                  }
                  description={
                    <span
                      className="lspan"
                      onClick={e => checkable && this.checkIcon(index, true)}
                    >
                      <i>{value}</i>
                      {
                        <Tag color={!checkable ? "" : check ? "green" : "red"}>
                          {!checkable ? "已确认" : check ? "确认" : "未确认"}
                        </Tag>
                      }
                    </span>
                  }
                  style={{ fontSize: 18 }}
                />
              </List.Item>
            )}
          />
          <Divider dashed orientation="left" className="land_divider">
            [ 用地数据确认 ]
          </Divider>
          <Row>
            <Col span={22} offset={1}>
              <Button
                type="primary"
                onClick={() => this.addRecord(COMPANY_LAND_HASH)}
              >
                新增用地数据
              </Button>
              {company_mj_lands.length ? (
                <Table
                  dataSource={toJS(company_mj_lands)}
                  columns={this.landColumns}
                  pagination={false}
                  rowClassName={r => (r.type ? "_self" : "_other")}
                  rowKey={r => r.key}
                  defaultExpandedRowKeys={["t0"]}
                  expandedRowRender={r => {
                    return r.type ? (
                      <Table
                        title={() => "企业用地出租信息"}
                        rowKey={r => r.key}
                        size="small"
                        columns={this.landRentColumns}
                        pagination={false}
                        dataSource={company_mj_land_rent}
                      />
                    ) : undefined;
                  }}
                />
              ) : undefined}
              <Row gutter={24} style={{ marginTop: 10, marginBottom: 8 }}>
                <Col span={3} offset={4}>
                  <Statistic title="自由用地(㎡)" value={company.landself} />
                </Col>
                <Col span={1} className="char">
                  +
                </Col>
                <Col span={3}>
                  <Statistic title="租赁用地(㎡)" value={landget} />
                </Col>
                <Col span={1} className="char">
                  -
                </Col>
                <Col span={3}>
                  <Statistic title="出租用地(㎡)" value={company.landr} />
                </Col>
                <Col span={1} className="char">
                  =
                </Col>
                <Col span={3}>
                  <Statistic
                    title="实际用地(㎡)"
                    value={company.landself + landget - company.landr}
                  />
                </Col>
                <Col span={2} className="charCheck">
                  <Tag
                    color={
                      !extraIndex[0].checkable
                        ? ""
                        : extraIndex[0].check
                        ? "green"
                        : "red"
                    }
                    onClick={e =>
                      extraIndex[0].checkable && this.checkIcon(0, false)
                    }
                  >
                    {!extraIndex[0].checkable
                      ? "已确认"
                      : extraIndex[0].check
                      ? "确认"
                      : "未确认"}
                  </Tag>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider dashed orientation="left" className="elec_divider">
            [ 用电数据确认 ]
          </Divider>
          <Row>
            <Col span={22} offset={1}>
              <Button
                type="primary"
                onClick={() => this.addRecord(COMPANY_ELEC_HASH)}
              >
                新增用电数据
              </Button>
              <Table
                dataSource={toJS(company_mj_elecs)}
                columns={this.elecColumns}
                rowKey={r => r.id}
                pagination={false}
              />
              <Row gutter={24} style={{ marginTop: 10, marginBottom: 8 }}>
                <Col span={3} offset={10}>
                  <Statistic title="总用电量(千瓦时)" value={company.elecd} />
                </Col>
                <Col span={2} className="charCheck">
                  <Tag
                    color={
                      !extraIndex[1].checkable
                        ? ""
                        : extraIndex[1].check
                        ? "green"
                        : "red"
                    }
                    onClick={e =>
                      extraIndex[1].checkable && this.checkIcon(1, false)
                    }
                  >
                    {!extraIndex[1].checkable
                      ? "已确认"
                      : extraIndex[1].check
                      ? "确认"
                      : "未确认"}
                  </Tag>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ marginTop: 10, textAlign: "center" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.updateCompanyDataState}
              loading={savingLoad}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CompanyUploadEL);
