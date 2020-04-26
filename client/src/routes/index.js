import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import PrivateRoute from './private';

import Dashboard from "../views/Dashboard";
import Header from '../components/Header';
import Login from "../views/Login";
import Register from "../views/Register";
import RecoverPassword from "../views/RecoverPassword";

const routes = () => (
  <BrowserRouter>
    <Header />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover
    />
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/recover-password" component={RecoverPassword} />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
    </Switch>
  </BrowserRouter>
);

export default routes;
