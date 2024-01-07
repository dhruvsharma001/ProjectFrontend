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
// nodejs library that concatenates classes
import classnames from 'classnames';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
// core components
import ReactBSAlert from 'react-bootstrap-sweetalert';

import AuthHeader from 'components/Headers/AuthHeader.js';

import jwt_decode from 'jwt-decode';

// import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../../actions/user_actions';
import { config } from '../../../siteDetails';
import axios from 'axios';
class Register extends React.Component {
  state = {
    email: '',
    name: '',
    password: '',
    isAuth: false,
    isChecked: false,
    isAdmin: false,
    role: 'employee',
    notifyAlert: null,
  };

  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };
  onChangeHandler = (e) => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    let { email, password, name, role } = this.state;
    this.props.register(name, email, password, role).then((res) => {
      // console.log(res, 'sign in res');
      if (res === true) {
        this.setState({
          name: '',
          email: '',
          password: '',
          isChecked: false,
        });

        this.successAlert();
        // console.log('login');
      } else {
        this.setState({ error: res });
      }
    });
  };
  hideAlert = () => {
    this.setState({
      notifyAlert: null,
    });
  };
  successAlert = () => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '100px' }}
          title='User Registered Successfully'
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='success'
          confirmBtnText='Ok'
          btnSize=''
        >
          Success..
        </ReactBSAlert>
      ),
    });
  };
  authCheck = () => {
    try {
      if (localStorage.authToken) {
        // const axiosConfig = {
        //   headers: {
        //     'x-auth-token': localStorage.authToken
        //   }
        // };
        axios({
          method: 'GET',
          url: `${config.serverUrl}login/validToken`,
          headers: {
            'x-auth-token': localStorage.authToken,
          },
        })
          .then((res) => {
            // console.log(res, 'auth check');
            if (res.data.message === 'valid') {
              // this.props.setUser(localStorage.authToken, this.state.isChecked);

              this.setState({ isAuth: true });
              // window.ipcRenderer.sendSync('logIn', 'login');
            } else {
              this.setState({ isAuth: false });
              // window.ipcRenderer.sendSync('logOut', 'logout');
            }
          })
          .catch((err) => {
            this.setState({ isAuth: false });
            // window.ipcRenderer.sendSync('logOut', 'logout');
          });
      } else {
        if (localStorage.email) {
          this.setState({
            email: localStorage.email,
          });
        }
        this.setState({ isAuth: false });
        // window.ipcRenderer.sendSync('logOut', 'logout');
      }
    } catch (err) {
      this.setState({ isAuth: false });
      // window.ipcRenderer.sendSync('logOut', 'logout');
    }
  };
  checkExpiry = () => {
    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        // window.ipcRenderer.sendSync('logOut', 'logout');
      } else {
        if (decoded.user.role === 'admin') {
          this.setState({ isAdmin: true });
        } else if (decoded.user.role === 'employee') {
          this.setState({ isAdmin: false });
        }
        // console.log(decoded.user.role, decoded.user.uid, 'token still valid');
      }
    } else {
      console.log('no token found');
    }
  };
  componentDidMount() {
    this.checkExpiry();
    this.authCheck();
  }
  render() {
    return (
      <>
        {this.state.isAdmin === true ? (
          <>
            {this.state.notifyAlert}
            <AuthHeader
              title='Whispering Homes Inventory:'
              lead='Create new user account..'
            />
            <Container className='mt--8 pb-5'>
              <Row className='justify-content-center'>
                <Col lg='6' md='8'>
                  <Card className='bg-secondary border-0'>
                    <CardHeader className='bg-transparent pb-5'>
                      <div className='text-muted text-center mt-2 mb-4'>
                        <small>Sign up with</small>
                      </div>
                      <div className='text-center'>
                        <Button
                          className='btn-neutral btn-icon mr-4'
                          color='default'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className='btn-inner--icon mr-1'>
                            <img
                              alt='...'
                              src={require('assets/img/icons/common/github.svg')}
                            />
                          </span>
                          <span className='btn-inner--text'>Github</span>
                        </Button>
                        <Button
                          className='btn-neutral btn-icon'
                          color='default'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className='btn-inner--icon mr-1'>
                            <img
                              alt='...'
                              src={require('assets/img/icons/common/google.svg')}
                            />
                          </span>
                          <span className='btn-inner--text'>Google</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody className='px-lg-5 py-lg-5'>
                      <div className='text-center text-muted mb-4'>
                        <small>Or sign up with credentials</small>
                      </div>
                      <Form role='form'>
                        <FormGroup
                          className={classnames({
                            focused: this.state.focusedName,
                          })}
                        >
                          <InputGroup className='input-group-merge input-group-alternative mb-3'>
                            <InputGroupAddon addonType='prepend'>
                              <InputGroupText>
                                <i className='ni ni-single-02' />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder='Name'
                              type='text'
                              name='name'
                              onFocus={() =>
                                this.setState({ focusedName: true })
                              }
                              onBlur={() =>
                                this.setState({ focusedName: false })
                              }
                              value={this.state.name}
                              onChange={this.onChangeHandler}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.focusedEmail,
                          })}
                        >
                          <InputGroup className='input-group-merge input-group-alternative mb-3'>
                            <InputGroupAddon addonType='prepend'>
                              <InputGroupText>
                                <i className='ni ni-email-83' />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder='Role'
                              type='hidden'
                              name='role'
                              onFocus={() =>
                                this.setState({ focusedEmail: true })
                              }
                              onBlur={() =>
                                this.setState({ focusedEmail: false })
                              }
                              value={this.state.role}
                              onChange={this.onChangeHandler}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.focusedName,
                          })}
                        >
                          <InputGroup className='input-group-merge input-group-alternative mb-3'>
                            <InputGroupAddon addonType='prepend'>
                              <InputGroupText>
                                <i className='ni ni-hat-3' />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder='Email'
                              type='text'
                              name='email'
                              onFocus={() =>
                                this.setState({ focusedName: true })
                              }
                              onBlur={() =>
                                this.setState({ focusedName: false })
                              }
                              value={this.state.email}
                              onChange={this.onChangeHandler}
                            />
                          </InputGroup>
                        </FormGroup>

                        <FormGroup
                          className={classnames({
                            focused: this.state.focusedPassword,
                          })}
                        >
                          <InputGroup className='input-group-merge input-group-alternative'>
                            <InputGroupAddon addonType='prepend'>
                              <InputGroupText>
                                <i className='ni ni-lock-circle-open' />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder='Password'
                              type='password'
                              name='password'
                              onFocus={() =>
                                this.setState({ focusedPassword: true })
                              }
                              onBlur={() =>
                                this.setState({ focusedPassword: false })
                              }
                              value={this.state.password}
                              onChange={this.onChangeHandler}
                            />
                          </InputGroup>
                        </FormGroup>
                        {this.state.password.length > 4 ? (
                          <div className='text-muted font-italic'>
                            <small>
                              password strength:{' '}
                              <span className='text-success font-weight-700'>
                                strong
                              </span>
                            </small>
                          </div>
                        ) : (
                          <div className='text-muted font-italic'>
                            <small>
                              password strength:{' '}
                              <span className='text-warning font-weight-700'>
                                weak
                              </span>
                            </small>
                          </div>
                        )}
                        <Row className='my-4'>
                          <Col xs='12'>
                            <div className='custom-control custom-control-alternative custom-checkbox'>
                              <input
                                className='custom-control-input'
                                id='customCheckRegister'
                                type='checkbox'
                                checked={this.state.isChecked}
                                onChange={this.toggleChange}
                              />
                              <label
                                className='custom-control-label'
                                htmlFor='customCheckRegister'
                              >
                                <span className='text-muted'>
                                  I agree with the{' '}
                                  <a
                                    href='#pablo'
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Privacy Policy
                                  </a>
                                </span>
                              </label>
                            </div>
                          </Col>
                        </Row>
                        <div className='text-center'>
                          <Button
                            className='mt-4'
                            color='info'
                            type='button'
                            onClick={this.onSubmitHandler}
                          >
                            Create account
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>{' '}
          </>
        ) : (
          <AuthHeader
            title='Insufficient Rights to create an account'
            lead='Login with the admin account to creat an account..'
          />
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {
  register,
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
