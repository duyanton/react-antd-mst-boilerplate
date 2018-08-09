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

  render() {
    const { userStore } = this.props;
    const { userList } = userStore;

    return <UserTable users={userList} loading={!userStore.isInited || userStore.isLoading} />;
  }
}

export default UserTableContainer;
