import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { Layout, Menu } from 'antd';

import Logo from '../../components/Logo';

const { Header: AntHeader, Content } = Layout;

@observer
class Header extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Layout>
        <AntHeader
          css="
            display: flex;
            background: #ffffff;
            padding: 0 24px;
          "
        >
          <Logo />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            css="
              line-height: inherit;
            "
          >
            <Menu.Item key="1">Nav 1</Menu.Item>
            <Menu.Item key="2">Nav 2</Menu.Item>
            <Menu.Item key="3">Nav 3</Menu.Item>
          </Menu>
        </AntHeader>
        <Content css="padding: 24px 36px">{this.props.children}</Content>
      </Layout>
    );
  }
}

export default Header;
