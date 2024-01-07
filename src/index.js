/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Whispering Homes (https://www.creative-tim.com)

* Coded by Whispering Homes

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';
// react library for routing
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// react redux
import { Provider } from 'react-redux';
import Store from './config/configureStore';
// bootstrap rtl for rtl support page
import 'assets/vendor/bootstrap-rtl/bootstrap-rtl.scss';
// plugins styles from node_modules
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
// plugins styles downloaded
import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
// core styles
import 'assets/scss/argon-dashboard-pro-react.scss?v1.1.0';
import withAuth from './components/hocs/withAuth';

import AdminLayout from 'layouts/Admin.js';
// import RTLLayout from 'layouts/RTL.js';
import AuthLayout from 'layouts/Auth.js';
// import IndexView from 'views/Index.js';

ReactDOM.render(
  <Provider store={Store}>
    <BrowserRouter>
      <Switch>
        <Route path='/admin' component={withAuth(AdminLayout)} />
        {/* <Route path='/rtl' render={(props) => <RTLLayout {...props} />} /> */}
        <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
        {/* <Route path='/' render={(props) => <IndexView {...props} />} /> */}
        <Redirect from='*' to='/auth/login' />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
