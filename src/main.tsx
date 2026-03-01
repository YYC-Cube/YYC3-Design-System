/**
 * @file YYC³ Design System — Main Entry Point
 * @description 应用程序入口文件
 * @module main
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-28
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
