import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'react-emotion';

const Container = styled('div')`
  height: 100%;
`;

@observer
class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return <Container>{this.props.children}</Container>;
  }
}

export default App;
