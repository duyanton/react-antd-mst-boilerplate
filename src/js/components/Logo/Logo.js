import React from 'react';

import styled from 'react-emotion';

import { Link } from 'react-router';

const LogoContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  font-size: 20px;
`;

const Logo = props => (
  <LogoContainer {...props}>
    <Link to="/">Logo</Link>
  </LogoContainer>
);

export default Logo;
