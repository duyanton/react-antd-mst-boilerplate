import React from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import styled from 'react-emotion';

import { Row, Col, Button } from 'antd';

const Container = styled('div')`
  padding: 12px 6px;
`;

const Heading = styled('div')`
  font-size: 18px;
  color: 'rgba(0,0,0,0.65)';
  margin-bottom: 24px;
`;

const ProfileItemWrapper = styled('div')`
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
`;

const FieldKey = styled('div')`
  margin-right: 8px;
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
`;

const Image = styled('img')`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Button)`
  &:first-child {
    margin-right: 16px;
  }
`;

const ProfileItem = ({ fieldKey, value }) => (
  <ProfileItemWrapper>
    <FieldKey>{fieldKey}:</FieldKey>
    {value}
  </ProfileItemWrapper>
);
ProfileItem.propTypes = {
  fieldKey: PropTypes.string,
  value: PropTypes.string,
};

const UserProfileView = observer(({ user, onEdit, onDelete }) => (
  <Container>
    <Heading>User Profile</Heading>
    <Row type="flex" justify="space-around" align="middle">
      <Col span={18}>
        <ProfileItem fieldKey="Full name" value={user.full_name} />
        <ProfileItem fieldKey="Job title" value={user.job_title} />
        <ProfileItem fieldKey="Address" value={user.address} />
        <ProfileItem fieldKey="Email" value={user.email} />
        <ProfileItem fieldKey="Phone" value={user.phone} />
      </Col>
      <Col span={6}>
        <Image src={user.avatar} />
      </Col>
    </Row>
    <Row
      type="flex"
      justify="start"
      align="middle"
      css="
        margin-top: 24px;
      "
    >
      <ActionButton type="primary" ghost icon="edit" onClick={onEdit}>
        Edit
      </ActionButton>
      <ActionButton type="danger" ghost icon="delete" onClick={onDelete}>
        Delete
      </ActionButton>
    </Row>
  </Container>
));

UserProfileView.propTypes = {
  user: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default UserProfileView;
