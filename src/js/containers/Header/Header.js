import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';

import { Layout, Menu, Button } from 'antd';

import Logo from '../../components/Logo';

const { Header: AntHeader, Content } = Layout;

@inject('sessionStore')
@observer
class Header extends Component {
  static propTypes = {
    children: PropTypes.node,
    sessionStore: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const defaultSelectedKeys = this.props.location.pathname.split('/').filter(path => path !== '');

    return (
      <Layout>
        <AntHeader
          css="
            display: flex;
            justify-content: space-between;
            background: #ffffff;
            padding: 0 24px;
          "
        >
          <div css="display: flex;">
            <Logo />
            <Menu
              mode="horizontal"
              defaultSelectedKeys={defaultSelectedKeys}
              css="
                line-height: inherit;
              "
            >
              <Menu.Item key="users">Users</Menu.Item>
            </Menu>
          </div>

          <div>
            <Button icon="poweroff" onClick={this.props.sessionStore.logout}>
              Log Out
            </Button>
          </div>
        </AntHeader>
        <Content css="padding: 3% 5%">{this.props.children}</Content>
      </Layout>
    );
  }
}

export default Header;
