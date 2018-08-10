import React from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import styled from 'react-emotion';

import { Table as AntdTable, Button } from 'antd';

const Table = styled(AntdTable)`
  border: 1px solid #ebedf0;

  .ant-table-thead > tr > th {
    background-color: #f6f6f6;
  }

  .ant-table-tbody {
    background-color: #ffffff;

    .ant-table-row {
      cursor: pointer;
    }
  }

  .ant-table-placeholder {
    padding: 50px;
  }
`;

const ActionButton = styled(Button)`
  border: none;
  padding: 0;

  &:first-child {
    margin-right: 16px;
  }
`;

const UserTable = observer(
  ({
 loading, users, pageSize, total, onClickEdit, onClickDelete, onClickRow, onPageChange,
}) => {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Full name',
        dataIndex: 'full_name',
        key: 'full_name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Job title',
        dataIndex: 'job_title',
        key: 'job_title',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'actions',
        render: (text, record) => (
          <div>
            <ActionButton
              type="primary"
              ghost
              icon="edit"
              onClick={(e) => {
                e.stopPropagation();
                onClickEdit(record.id);
              }}
            >
              Edit
            </ActionButton>
            <ActionButton
              type="primary"
              ghost
              icon="delete"
              onClick={(e) => {
                e.stopPropagation();
                onClickDelete(record.id);
              }}
            >
              Delete
            </ActionButton>
          </div>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={users}
        pagination={{
          hideOnSinglePage: true,
          showQuickJumper: true,
          pageSize,
          total,
          onChange: onPageChange,
        }}
        rowKey="id"
        onRow={record => ({
          onClick: () => onClickRow(record.id),
        })}
        loading={loading}
      />
    );
  },
);

UserTable.propTypes = {
  loading: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onClickEdit: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickRow: PropTypes.func,
  onPageChange: PropTypes.func,
};

UserTable.defaultProps = {
  users: [],
  onClickEdit: () => {},
  onClickDelete: () => {},
  onClickRow: () => {},
  onPageChange: () => {},
};

export default UserTable;
