import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _values from 'lodash/values';

import { Router, Route, Redirect, browserHistory } from 'react-router';
import Loadable from 'react-loadable';

import withRole from './HOC/withRole';
import App from './containers/App';
import OverlayWholePageLoading from './components/OverlayWholePageLoading';

import roles from './constants/roles';

import stores from './stores';

const Loading = ({ pastDelay }) => (pastDelay ? <OverlayWholePageLoading /> : null);
Loading.propTypes = {
  pastDelay: PropTypes.bool,
};

const AsyncHeader = Loadable({
  loader: () => import(/* webpackChunkName: "Header" */ './containers/Header'),
  loading: Loading,
  delay: 1000,
});

const AsyncLoginPage = Loadable({
  loader: () => import(/* webpackChunkName: "LoginPage" */ './pages/LoginPage'),
  loading: Loading,
  delay: 1000,
});

const AsyncUserPage = Loadable({
  loader: () => import(/* webpackChunkName: "UserPage" */ './pages/UserPage'),
  loading: Loading,
  delay: 1000,
});

const requireLoggedIn = () => {
  const {
    uiStore: { sessionStore },
  } = stores;
  if (!sessionStore.isLogged) return browserHistory.push('/');
  return sessionStore.isLogged;
};

const redirectIfLoggedIn = () => {
  const {
    uiStore: { sessionStore },
  } = stores;
  if (sessionStore.isLogged) return browserHistory.push('/users');
  return sessionStore.isLogged;
};

// const User = withRole([roles.ROLE_USER]);
const Admin = withRole([roles.ROLE_ADMIN]);
const Guest = withRole([roles.ROLE_GUEST]);
const Anyone = withRole(_values(roles));

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>
          <Redirect from="/" to="/login" />

          <Route component={Anyone(AsyncHeader)}>
            <Route path="/users" component={Admin(AsyncUserPage)} onEnter={requireLoggedIn} />
          </Route>

          <Route path="/login" component={Guest(AsyncLoginPage)} onEnter={redirectIfLoggedIn} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
