import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';

import styled from 'react-emotion';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd';

const FormItem = Form.Item;

const Container = styled('div')`
  background-color: #ffffff;
  padding: 50px 50px 30px 50px;
  max-width: 400px;
  min-width: 25vw;
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
  loginErrorTitle: {
    id: 'Login.loginErrorTitle',
    defaultMessage: 'Login Error',
  },
  loginErrorDescription: {
    id: 'Login.loginErrorDescription',
    defaultMessage: 'Incorrect email or password.',
  },
});

@injectIntl
@Form.create()
@inject('sessionStore', 'router')
@observer
class LoginContainer extends Component {
  static propTypes = {
    form: PropTypes.object,
    sessionStore: PropTypes.object,
    intl: PropTypes.object,
    router: PropTypes.object,
  };

  @action
  setIsSubmitting = (value) => {
    this.isSubmitting = value;
  };

  @observable
  isSubmitting;

  handleSubmit = (e) => {
    e.preventDefault();

    const {
 form, sessionStore, router, intl,
} = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setIsSubmitting(true);

        const { email, password, rememberMe } = values;
        sessionStore.login(
          email,
          password,
          rememberMe,
          () => {
            this.setIsSubmitting(false);
            router.push('/users');
          },
          () => {
            this.setIsSubmitting(false);
            notification.error({
              message: intl.formatMessage(MESSAGES.loginErrorTitle),
              description: intl.formatMessage(MESSAGES.loginErrorDescription),
            });
          },
        );
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
              initialValue: 'admin@example.com',
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
              initialValue: 'password',
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
          </FormItem>

          <Button
            css="width: 100%;"
            type="primary"
            htmlType="submit"
            size="large"
            loading={this.isSubmitting}
          >
            {this.isSubmitting ? (
              <FormattedMessage id="Login.loginButtonLoading" defaultMessage="Logging In..." />
            ) : (
              <FormattedMessage id="Login.loginButton" defaultMessage="Log In" />
            )}
          </Button>
        </Form>
      </Container>
    );
  }
}

LoginContainer.propTypes = {};

export default LoginContainer;
