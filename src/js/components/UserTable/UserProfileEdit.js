import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import styled from 'react-emotion';

import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

const Container = styled('div')`
  padding: 12px 6px;
`;

const Heading = styled('div')`
  font-size: 18px;
  color: 'rgba(0,0,0,0.65)';
  margin-bottom: 24px;
`;

const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create({
  mapPropsToFields({ user }) {
    return {
      full_name: Form.createFormField({
        value: user.full_name,
      }),
      job_title: Form.createFormField({
        value: user.job_title,
      }),
      address: Form.createFormField({
        value: user.address,
      }),
      email: Form.createFormField({
        value: user.email,
      }),
      phone: Form.createFormField({
        value: user.phone,
      }),
    };
  },
})
@observer
class UserProfileEdit extends Component {
  static propTypes = {
    user: PropTypes.object,
    form: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { form, onSave } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        onSave(values);
      }
    });
  };

  render() {
    const { form, onCancel } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Container>
        <Heading>Edit Profile</Heading>

        <Form onSubmit={this.handleSubmit}>
          <FormItem label="Full name" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('full_name', {
              rules: [{ required: true, message: 'Please input your name' }],
            })(<Input placeholder="Input name" />)}
          </FormItem>

          <FormItem label="Job title" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('job_title', {
              rules: [{ required: true, message: 'Please input your job title' }],
            })(<Input placeholder="Input job title" />)}
          </FormItem>

          <FormItem label="Address" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: 'Please input your address' }],
            })(<Input placeholder="Input address" />)}
          </FormItem>

          <FormItem label="Email" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your email' },
                {
                  type: 'email',
                  message: 'Please input a valid email address',
                },
              ],
            })(<Input placeholder="Input email" />)}
          </FormItem>

          <FormItem label="Phone" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone' }],
            })(<Input placeholder="Input phone" />)}
          </FormItem>

          <div css="float: right">
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              Save
            </Button>
            <Button css="margin-left: 8px" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Container>
    );
  }
}

export default UserProfileEdit;
