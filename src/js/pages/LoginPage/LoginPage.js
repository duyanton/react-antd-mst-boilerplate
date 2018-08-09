import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { observer } from 'mobx-react';

import LoginContainer from '../../containers/LoginContainer';

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

@observer
class LoginPage extends Component {
  render() {
    return (
      <Container>
        <LoginContainer />
      </Container>
    );
  }
}

LoginPage.propTypes = {};

export default LoginPage;
