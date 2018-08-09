import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import stores from '../stores';

const {
  uiStore: { sessionStore },
} = stores;

/**
 * Currying higher-order component to authorize and inject role to wrapped component
 * Check if current user's role is in allowed roles array,
 * then inject role props to component
 * If not allowed, return null
 * @param {array(string)} allowedRoles - array of allowed roles
 * @param {React Component} WrappedComponent - component will be injected with props 'role'
 */
const withRole = allowedRoles => WrappedComponent =>
  class WithRoleComponent extends Component {
    render() {
      const { currentUserRole } = sessionStore;
      if (!currentUserRole) {
        browserHistory.push('/');
        return null;
      }

      if (allowedRoles.includes(currentUserRole)) {
        return <WrappedComponent role={currentUserRole} {...this.props} />;
      }

      return null;
    }
  };

export default withRole;
