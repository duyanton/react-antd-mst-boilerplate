import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';

// An overlay whole page loading, should be using with React Loadable when downloading a JS chunk
export default () =>
  ReactDOM.createPortal(
    <div
      css="
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom; 0;
      z-index: 1000;
    "
    >
      <Spin size="large" />
    </div>,
    document.getElementById('portal-anchor'),
  );
