import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './features/Auth/Login';
import Dashboard from './features/Dashboard/Dashboard';
import Inventory from './features/Inventory/Inventory';
import POS from './features/Sales/POS';
import Reports from './features/Reports/Reports';
import AdminSettings from './features/Admin/AdminSettings';

import socket from './services/socket';

const App: React.FC = () => {
  React.useEffect(() => {
    socket.on('notification', (data) => {
      toast(data.message, {
        type: data.type === 'ALERT' ? 'error' : 'warning',
        theme: 'dark'
      });
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<POS />} />
            <Route path="reports" element={<Reports />} />
            <Route path="admin" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop theme="dark" />
    </AuthProvider>
  );
};

export default App;
