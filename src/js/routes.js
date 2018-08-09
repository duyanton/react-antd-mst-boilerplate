import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Router, Route, browserHistory } from 'react-router';

import _values from 'lodash/values';

import Loadable from 'react-loadable';

import withRole from './HOC/withRole';
import App from './containers/App';
import OverlayWholePageLoading from './components/OverlayWholePageLoading';

import roles from './constants/roles';

const Loading = ({ pastDelay }) => (pastDelay ? <OverlayWholePageLoading /> : null);
Loading.propTypes = {
  pastDelay: PropTypes.bool,
};

const AsyncHeader = Loadable({
  loader: () => import(/* webpackChunkName: "Header" */ './containers/Header'),
  loading: Loading,
  delay: 1000,
});

const AsyncHomePage = Loadable({
  loader: () => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'),
  loading: Loading,
  delay: 1000,
});

const AsyncLoginPage = Loadable({
  loader: () => import(/* webpackChunkName: "LoginPage" */ './pages/LoginPage'),
  loading: Loading,
  delay: 1000,
});

const AsyncDashboardPage = Loadable({
  loader: () => import(/* webpackChunkName: "DashboardPage" */ './pages/DashboardPage'),
  loading: Loading,
  delay: 1000,
});

// const User = withRole([roles.ROLE_USER]);
// const Admin = withRole([roles.ROLE_ADMIN]);
const Guest = withRole([roles.ROLE_GUEST]);
const Anyone = withRole(_values(roles));

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>
          <Route path="/" component={Guest(AsyncHomePage)} />

          <Route component={Anyone(AsyncHeader)}>
            <Route path="/dashboard" component={AsyncDashboardPage} />
          </Route>

          <Route path="/login" component={AsyncLoginPage} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
