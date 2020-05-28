import React, { Component } from "react";
import autobind from "autobind-decorator";
import { inject, observer } from "mobx-react";
import { Form, Input, Select, Checkbox } from "antd";
const Option = Select.Option;
const { Item: FormItem } = Form;
export const USER_FORM_MODE_ADD = "add";
export const USER_FORM_MODE_UPDATE = "update";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@observer
class UserForm extends Component {
  render() {
    const { form, user, mode, groups, jobs, department } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false,
    };
    const isUpdate = mode === USER_FORM_MODE_UPDATE;

    getFieldDecorator("id", { initialValue: user ? user.id : "" });

    return (
      <Form className="form-user">
        <FormItem {...defaultItemProps} label="用户名">
          {getFieldDecorator("username", {
            initialValue: user ? user.username : "",
            rules: [
              {
                required: true,
                message: "请输入用户名",
              },
            ],
          })(
            <Input
              placeholder="输入用户名"
              autoComplete="off"
              disabled={isUpdate}
            />
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="手机号">
          {getFieldDecorator("phone", {
            initialValue: user ? user.phone : "",
            rules: [
              {
                required: false,
                message: "请输入手机号",
              },
            ],
          })(<Input placeholder="输入手机号" disabled={isUpdate} />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="别名">
          {getFieldDecorator("alias", {
            initialValue: user ? user.alias : "",
          })(<Input placeholder="输入别名" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="用户组">
          {getFieldDecorator("group", {
            initialValue:
              user && user.groups
                ? user.groups.map(v => {
                    return v.id;
                  })
                : [],
            rules: [
              {
                required: true,
                message: "请选择用户组",
              },
            ],
          })(
            <Select
              mode="multiple"
              placeholder="选择用户组"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {groups
                ? groups.map((v, index) => {
                    return (
                      <Option value={v.id} key={index}>
                        {v.name}
                      </Option>
                    );
                  })
                : []}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="工作岗位">
          {getFieldDecorator("job", {
            initialValue:
              user && user.jobs
                ? user.jobs.map(v => {
                    return v.id;
                  })
                : [],
            rules: [
              {
                required: false,
                message: "请选择工作岗位",
              },
            ],
          })(
            <Select
              mode="multiple"
              placeholder="选择工作岗位"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {jobs
                ? jobs.map((v, index) => {
                    return (
                      <Option value={v.id} key={index}>
                        {v.name}
                      </Option>
                    );
                  })
                : []}
            </Select>
          )}
        </FormItem>
        {/* <FormItem {...defaultItemProps} label="部门">
          {getFieldDecorator("department", {
            initialValue: user ? user.department : "",
            rules: [
              {
                required: false,
                message: "请选择部门",
              },
            ],
          })(
            <Select>
              {department
                ? department.map((v, index) => {
                    return (
                      <Option value={v.id} key={index}>
                        {v.name}
                      </Option>
                    );
                  })
                : []}
            </Select>
          )}
        </FormItem> */}
        <FormItem {...defaultItemProps} label="是否激活">
          {getFieldDecorator("isActive", {
            valuePropName: "checked",
            initialValue: user && user.isActive == 1 ? true : false,
          })(<Checkbox />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UserForm);
