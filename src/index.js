// Init development branch

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import AuthPage from 'containers/AuthPage';
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import UploadList from "views/UploadList/UploadList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";

import "assets/css/material-dashboard-react.css";

import indexRoutes from "routes/index.jsx";

// This component ios HoC that prevents the user from accessing a route if he's not logged in
import PrivateRoute from 'containers/PrivateRoute/index.js';

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
    <Route path="/auth/:authType/:id?" component={AuthPage} />
    {indexRoutes.map((prop, key) => {
      return <PrivateRoute path={prop.path} component={prop.component} key={key} />;
    })}
      })}
    </Switch>
  </Router>,
  document.getElementById("root")
);
