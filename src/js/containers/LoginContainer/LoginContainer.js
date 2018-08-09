import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';

import styled from 'react-emotion';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

const Container = styled('div')`
  background-color: #ffffff;
  padding: 50px 50px 30px 50px;
  max-width: 450px;
`;

const Heading = styled('div')`
  margin-bottom: 20px;
  font-size: 30px;
  line-height: 35px;
  color: #313131;
  text-align: center;
`;

const MESSAGES = defineMessages({
  email: {
    id: 'Login.email',
    defaultMessage: 'Email',
  },
  emailRequired: {
    id: 'Login.emailRequired',
    defaultMessage: 'Please input your email',
  },
  emailInvalid: {
    id: 'Login.emailInvalid',
    defaultMessage: 'Please input a valid email address',
  },
  password: {
    id: 'Login.password',
    defaultMessage: 'Password',
  },
  passwordRequired: {
    id: 'Login.passwordRequired',
    defaultMessage: 'Please input your password',
  },
});

@injectIntl
@inject('sessionStore')
@observer
@Form.create()
class LoginContainer extends Component {
  static propTypes = {
    form: PropTypes.object,
    sessionStore: PropTypes.object,
    intl: PropTypes.object,
  };

  handleSubmit = (e) => {
    const { sessionStore } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password, rememberMe } = values;
        sessionStore.login(email, password, rememberMe);
      }
    });
  };

  render() {
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Container>
        <Heading>
          <FormattedMessage id="Login" defaultMessage="Log In" />
        </Heading>

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: intl.formatMessage(MESSAGES.emailRequired) },
                {
                  type: 'email',
                  message: intl.formatMessage(MESSAGES.emailInvalid),
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={intl.formatMessage(MESSAGES.email)}
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: intl.formatMessage(MESSAGES.passwordRequired) }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder={intl.formatMessage(MESSAGES.password)}
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('rememberMe', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>
                <FormattedMessage id="Login.rememberMe" defaultMessage="Remember me" />
              </Checkbox>,
            )}
            <a
              css="
                float: right;
              "
              href=""
            >
              <FormattedMessage id="Login.forgotPassword" defaultMessage="Forgot password" />
            </a>
            <Button
              css="
                width: 100%;
                margin: 10px 0;
              "
              type="primary"
              htmlType="submit"
              size="large"
            >
              <FormattedMessage id="Login" defaultMessage="Log In" />
            </Button>
          </FormItem>
        </Form>
      </Container>
    );
  }
}

LoginContainer.propTypes = {};

export default LoginContainer;
