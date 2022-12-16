import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import Update from '../pages/Update';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

const router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <>
                <PrivateRoute />
                <Chat />
              </>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="edit"
            element={
              <>
                <PrivateRoute />
                <Update />
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default router;
