import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import styled from 'react-emotion';

import UserTableContainer from '../../containers/UserTableContainer';

const Container = styled('div')``;

@observer
class UserPage extends Component {
  static propTypes = {};

  render() {
    return (
      <Container>
        <UserTableContainer />
      </Container>
    );
  }
}

export default UserPage;
