import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser, signInn, signOut, checkExpiry } from '../../actions/user_actions';
import { config } from '../../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function withAuth(ComponentToBeRendered) {
  class Authenticate extends Component {
    state = {
      isAuth: false,
    };
    authCheck = () => {
      try {
        if (localStorage.authToken) {
          axios({
            method: 'GET',
            url: `${config.serverUrl}login/validToken`,
            headers: {
              'x-auth-token': localStorage.authToken,
            },
          })
            .then((res) => {
              if (res.data.message === 'valid') {

              } else {
                this.props.signOut();
                localStorage.removeItem('authToken');
              }
            })
            .catch((err) => {
              this.props.signOut();
              localStorage.removeItem('authToken');
            });
        } else {
          this.props.signOut();
        }
      } catch (err) {
        this.props.signOut();
      }
    };
    checkExpiry = () => {

      if (localStorage.authToken) {
        const decoded = jwt_decode(localStorage.authToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('authToken');
          this.props.history.push('/auth/login');
        } else {
          this.props.setUser(localStorage.authToken);
        }
      } else {
        console.log('no token found');
        this.props.history.push('/auth/login');
      }
    };

    componentDidMount() {
      this.checkExpiry();
      this.authCheck();

    }

    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      User: state.User,
    };
  };
  const mapDispatchToProps = {
    setUser,
    checkExpiry,
    signOut,
    signInn,
  };

  return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
}
