import React, { Component } from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import { List, Icon, Button, Tooltip } from "antd";

@observer
export default class CompanyUploadIndicator extends Component {
  state = {
    listIndex: [
      { title: "实缴税金(万)", v: "tax", value: 0, check: false },
      { title: "主营业收入(万)", v: "revenue", value: 0, check: false },
      { title: "纳税登记时间", v: "taxtime", value: 0, check: false },
      { title: "工业增加值(万)", v: "industrial", value: 0, check: false },
      { title: "年平均员工数(人)", v: "staff", value: 0, check: false },
      { title: "年综合能耗(吨标煤)", v: "energy", value: 0, check: false },
      { title: "研发经费(万)", v: "rde", value: 0, check: false },
    ],
    scale: "规上工业",
  };

  UNSAFE_componentWillReceiveProps() {
    const { listIndex } = this.state;
    const { company } = this.props;
  }

  @autobind
  checkIcon(index) {
    const { listIndex } = this.state;
    // listIndex[index].check = listIndex[index].check || !listIndex[index].check;
    listIndex[index].check = !listIndex[index].check;
    this.setState({ listIndex });
  }

  render() {
    const { company, upload, savingLoad } = this.props;
    const { listIndex, scale } = this.state;
    return (
      <div>
        <List
          header={
            <div>
              <span style={{ fontWeight: "bold" }}>[2019年度]</span>
              {` ${company.name || " 公司名"} - ${scale}`}
            </div>
          }
          footer={
            <div>
              {
                <Button
                  type="primary"
                  onClick={(e) => {
                    upload(listIndex);
                  }}
                  loading={savingLoad}
                >
                  核对确认
                </Button>
              }
            </div>
          }
          bordered
          dataSource={listIndex}
          renderItem={({ title, value, check }, index) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Tooltip title="prompt text">
                    <span style={{ fontSize: 16, verticalAlign: "middle" }}>
                      {title}
                    </span>
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
                description={value}
                style={{ fontSize: 18 }}
              />
              <Icon
                style={{
                  color: check ? "#00f900" : "#525252",
                  fontSize: 20,
                }}
                onClick={(e) => this.checkIcon(index)}
                type="check-circle"
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
