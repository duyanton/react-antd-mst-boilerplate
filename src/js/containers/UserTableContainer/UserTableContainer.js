import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';

import UserTable from '../../components/UserTable';

@inject('userStore')
@observer
class UserTableContainer extends Component {
  static propTypes = {
    userStore: PropTypes.object,
  };

  handlePageChange = (page) => {
    // Scroll to top on page change
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    const {
      userStore: { pagination },
    } = this.props;
    pagination.setPage(page);
  };

  render() {
    const { userStore } = this.props;
    const {
 isInited, isLoading, usersFromResponse, pagination,
} = userStore;

    return (
      <UserTable
        loading={!isInited || isLoading}
        users={usersFromResponse}
        pageSize={pagination.limit}
        total={pagination.total}
        onPageChange={this.handlePageChange}
      />
    );
  }
}

export default UserTableContainer;
