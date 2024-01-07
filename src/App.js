// /*!

// =========================================================
// * Argon Dashboard PRO React - v1.0.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
// * Copyright 2019 Whispering Homes (https://www.creative-tim.com)

// * Coded by Whispering Homes

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
// // import React from 'react';
// import ReactDOM from 'react-dom';
// import React, { Component } from 'react';
// import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// // import { renderRoutes } from 'react-router-config';
// import axios from 'axios';
// import { config } from './siteDetails';

// import jwt_decode from 'jwt-decode';
// // react library for routing

// // react redux
// import { Provider } from 'react-redux';
// import Store from './config/configureStore';
// // plugins styles from node_modules
// import 'react-notification-alert/dist/animate.css';
// import 'react-perfect-scrollbar/dist/css/styles.css';
// // plugins styles downloaded
// import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
// import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
// import 'assets/vendor/select2/dist/css/select2.min.css';
// import 'assets/vendor/quill/dist/quill.core.css';
// import 'assets/vendor/nucleo/css/nucleo.css';
// import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
// // core styles
// import 'assets/scss/argon-dashboard-pro-react.scss?v1.0.0';

// import AdminLayout from 'layouts/Admin.jsx';
// import AuthLayout from 'layouts/Auth.jsx';
// import IndexView from 'views/Index.jsx';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loginRender: '',
//       isAuth: true,
//       userRole: '',
//     };
//     /* redirecting to https */
//     if (window.location.protocol === 'http:') {
//       window.location.href = window.location.href.replace('http', 'https');
//     }
//     this.authSet = this.authSet.bind(this);
//   }
//   authSet() {
//     localStorage.removeItem('authToken');
//     this.setState({
//       isAuth: false,
//     });
//   }

//   authCheck = () => {
//     console.log('reaf on redirect auth  check');
//     try {
//       if (localStorage.authToken) {
//         const axiosConfig = {
//           headers: {
//             'x-auth-token': localStorage.authToken,
//           },
//         };
//         axios({
//           method: 'GET',
//           url: `${config.serverUrl}login/validToken`,
//           headers: {
//             'x-auth-token': localStorage.authToken,
//           },
//         })
//           .then((res) => {
//             if (res.data.message) {
//               this.setState({ isAuth: true });
//             } else {
//               this.setState({ isAuth: false });
//             }
//           })
//           .catch((err) => {
//             this.setState({ isAuth: false });
//           });
//       } else {
//         this.setState({ isAuth: false });
//       }
//     } catch (err) {
//       this.setState({ isAuth: false });
//     }
//   };

//   loginRender = () => {
//     this.authCheck();
//   };
//   getRole = () => {
//     if (localStorage.authToken) {
//       const decoded = jwt_decode(localStorage.authToken);
//       return decoded.user.role;
//     } else {
//       return 0;
//     }
//   };
//   checkExpiry = () => {
//     if (localStorage.authToken) {
//       const decoded = jwt_decode(localStorage.authToken);
//       const currentTime = Date.now() / 1000;
//       if (decoded.exp < currentTime) {
//         localStorage.removeItem('authToken');
//       } else {
//         console.log(decoded.user.role, decoded.user.uid, 'token still valid');
//       }
//     } else {
//       return 0;
//     }
//   };
//   componentDidMount() {
//     this.authCheck();
//     this.checkExpiry();
//   }

//   render() {
//     const isAuthenticated = this.state.isAuth;
//     console.log(isAuthenticated);
//     return (
//       <Provider store={Store}>
//         <BrowserRouter>
//           <Switch>
//             <Route
//               path='/admin'
//               render={(props) => <AdminLayout {...props} />}
//             />
//             <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
//             <Route path='/' render={(props) => <IndexView {...props} />} />
//             <Redirect from='*' to='/' />

//             {/* <Route path="/auth/login"
//                 render={
//                   props => {
//                     if (!isAuthenticated) {
//                       return <AdminLayout loginRender={this.loginRender} {...props} />
//                     } else {
//                       return <Redirect to="/" />
//                     }
//                   }
//                 }
//               />
//               <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
//               <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
//               <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
//               <Route exact path="/pg/:id" name="Payment Link" render={props => <PaymentLink {...props} />} />

//               <Route
//                 path="/" name="Home"
//                 render={
//                   props => {
//                     if (isAuthenticated) {
//                       return <DefaultLayout authSet={this.authSet} {...props} role={this.getRole()} />
//                     } else {
//                       return <Redirect to="/login" />
//                     }
//                   }
//                 }
//               /> */}
//           </Switch>
//         </BrowserRouter>
//       </Provider>
//     );
//   }
// }

// export default App;
