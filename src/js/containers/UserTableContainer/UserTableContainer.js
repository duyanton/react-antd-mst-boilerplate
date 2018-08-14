import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { observable, computed, action } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Modal } from 'antd';

import UserTable from '../../components/UserTable';
import UserDrawer from './UserDrawer';

@inject('userStore')
@observer
class UserTableContainer extends Component {
  static propTypes = {
    userStore: PropTypes.object,
  };

  @computed
  get selectedUser() {
    return this.props.userStore.getById(this.selectedUserId);
  }

  @computed
  get drawerVisible() {
    return !!(this.selectedUserId && this.selectedUser);
  }

  @observable
  selectedUserId;
  @observable
  isEditing;

  @action
  handleClickRow = (userId) => {
    this.selectedUserId = userId;
  };

  @action
  handleEdit = (userId) => {
    this.selectedUserId = userId;
    this.isEditing = true;
  };

  @action
  handleDelete = (userId) => {
    const user = this.props.userStore.getById(userId);
    Modal.confirm({
      title: 'Confirm delete user',
      content: 'Are you sure you want to delete this user?',
      onOk: () => {
        user.remove();
        this.handleCloseDrawer();
      },
      onCancel: () => {},
    });
  };

  @action
  handleCloseDrawer = () => {
    this.selectedUserId = undefined;
    this.isEditing = false;
  };

  handleSave = (newValues) => {
    this.selectedUser.update(newValues);
    this.handleCloseDrawer();
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
      <Fragment>
        <UserTable
          loading={!isInited || isLoading}
          users={usersFromResponse.toJSON()}
          pageSize={pagination.limit}
          total={pagination.total}
          onClickRow={this.handleClickRow}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onPageChange={this.handlePageChange}
        />
        <UserDrawer
          user={this.selectedUser}
          visible={this.drawerVisible}
          onClose={this.handleCloseDrawer}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onSave={this.handleSave}
          mode={this.isEditing ? 'edit' : 'view'}
        />
      </Fragment>
    );
  }
}

export default UserTableContainer;
