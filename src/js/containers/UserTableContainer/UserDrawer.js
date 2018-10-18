import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { Drawer } from 'antd';

import UserProfileView from '../../components/UserTable/UserProfileView';
import UserProfileEdit from '../../components/UserTable/UserProfileEdit';

const MODE_VIEW = 'view';
const MODE_EDIT = 'edit';

@observer
class UserDrawer extends Component {
  static propTypes = {
    user: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
    mode: PropTypes.oneOf([MODE_EDIT, MODE_VIEW]),
  };

  static defaultProps = {
    user: {},
    visible: false,
    onClose: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onSave: () => {},
    mode: 'view',
  };

  render() {
    const {
      user, visible, onClose, onEdit, onDelete, onSave, mode,
    } = this.props;

    return (
      <Drawer width={480} placement="right" visible={visible} onClose={onClose}>
        {mode === MODE_VIEW && (
          <UserProfileView
            user={user}
            onEdit={() => {
              onEdit(user.id);
            }}
            onDelete={() => {
              onDelete(user.id);
            }}
          />
        )}
        {mode === MODE_EDIT && <UserProfileEdit user={user} onSave={onSave} onCancel={onClose} />}
      </Drawer>
    );
  }
}

export default UserDrawer;
