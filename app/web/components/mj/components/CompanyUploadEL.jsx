import React, { Component } from "react";
import { observer } from "mobx-react";
import {
  Form,
  Divider,
  Table,
  Button,
  Tag,
  Statistic,
  Row,
  Col,
  List,
  Icon,
  Tooltip,
  message,
} from "antd";
import { toJS } from "mobx";
import autobind from "autobind-decorator";
export const COMPANY_DATA_FORM_HASH = Symbol("companydata");
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};

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
  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { company } = this.props;
    const { basicIndex, extraIndex } = this.state;
    if (!company.uuid) return;
    const uuids2names = await this.fetchCompanyNameByUuid([
      ...new Set([
        ...company.company_mj_lands.map((v) => v.uuid),
        ...company.company_mj_land_rent.map((v) => v.to_object),
      ]),
    ]);
    this.setState({
      company_mj_lands: company.company_mj_lands.map((v) => ({
        ...v,
        cname: uuids2names[v.uuid] || "",
        edit: false,
      })),
      company_mj_elecs: company.company_mj_elecs.map((v) => ({
        ...v,
        edit: false,
      })),
      company_mj_land_rent: company.company_mj_land_rent.map((v) => ({
        ...v,
        cname: uuids2names[v.to_object] || "",
        edit: false,
      })),
      basicIndex: basicIndex.map((v) => ({
        ...v,
        check: company.company_mj_data_state[v.v],
        value: company.company_mj_datum[v.v] || 0,
        checkable: company.company_mj_data_state[v.v] ? false : true,
      })),
      extraIndex: extraIndex.map((v) => ({
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
    { title: "电表号", dataIndex: "elecmeter" },
    { title: "年度用电表(千瓦时)", dataIndex: "elec" },
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
    },
    {
      title: "出租企业信息",
      dataIndex: "cname",
      render: (t, r) => (r.type ? "" : t),
    },
    {
      title: "出租企业信用代码",
      dataIndex: "uuid",
      width: 180,
      render: (t, r) => (r.type ? "" : t),
    },
  ];

  landRentColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "出租用地面积(平方米)", dataIndex: "area", key: "area" },
    { title: "承租企业名称", dataIndex: "cname", key: "cname" },
    { title: "承租企业信用代码", dataIndex: "to_object", key: "to_object" },
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
    [...basicIndex, ...extraIndex].map((v) => {
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
          .filter((d) => d.type != 1)
          .map((d) => d.area)
          .join("+")
      ) || 0;
    return (
      <div>
        <div className="companyUploadHeader">
          <span style={{ fontWeight: "bold" }}>[ 2019年度 ]</span>
          {` ${company.name || " 公司名"} - ${scale ? "规上" : "规下"}企业`}
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
                      onClick={(e) => checkable && this.checkIcon(index, true)}
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
          <Table
            dataSource={toJS(company_mj_lands)}
            columns={this.landColumns}
            rowKey={(r) => r.id}
            pagination={false}
            rowClassName={(r) => (r.type ? "_self" : "_other")}
            expandedRowRender={(r) => {
              return r.type ? (
                <Table
                  title={() => "企业用地出租信息"}
                  size="small"
                  columns={this.landRentColumns}
                  pagination={false}
                  rowKey={(_r) => _r.id}
                  dataSource={company_mj_land_rent}
                />
              ) : undefined;
            }}
          />
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
                onClick={(e) =>
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
          <Divider dashed orientation="left" className="elec_divider">
            [ 用电数据确认 ]
          </Divider>
          <Table
            dataSource={toJS(company_mj_elecs)}
            columns={this.elecColumns}
            rowKey={(r) => r.id}
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
                onClick={(e) =>
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
