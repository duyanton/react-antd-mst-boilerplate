import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'react-emotion';

const Container = styled('div')``;

const Heading = styled('div')`
  display: flex;
  font-size: 20px;
  justify-content: center;
`;

@observer
class DashboardPage extends Component {
  static propTypes = {};

  render() {
    return (
      <Container>
        <Heading>Dashboard Page</Heading>
      </Container>
    );
  }
}

export default DashboardPage;
