import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import styled from 'react-emotion';

import { Link } from 'react-router';

const Container = styled('div')`
  margin: 50px;
`;

const Heading = styled('div')`
  display: flex;
  font-size: 20px;
  justify-content: center;
`;

@observer
class HomePage extends Component {
  static propTypes = {};

  render() {
    return (
      <Container>
        <Heading>Home Page</Heading>
        <div>
          <Link to="dashboard">Dashboard</Link>
        </div>
        <div>
          <Link to="login">Login</Link>
        </div>
      </Container>
    );
  }
}

export default HomePage;
