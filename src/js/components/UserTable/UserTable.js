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

const Image = styled('img')`
  width: 35px;
  height: 35px;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const UserTable = observer(
  ({
    loading, users, pageSize, total, onEdit, onDelete, onClickRow, onPageChange,
  }) => {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 80,
        render: (text, record) => <Image src={record.avatar} />,
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
                onEdit(record.id);
              }}
            >
              Edit
            </ActionButton>
            <ActionButton
              type="danger"
              ghost
              icon="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record.id);
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClickRow: PropTypes.func,
  onPageChange: PropTypes.func,
};

UserTable.defaultProps = {
  users: [],
  onEdit: () => {},
  onDelete: () => {},
  onClickRow: () => {},
  onPageChange: () => {},
};

export default UserTable;
