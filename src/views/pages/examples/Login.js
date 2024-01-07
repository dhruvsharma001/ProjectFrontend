/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Whispering Homes (https://www.creative-tim.com)

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
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Badge,
  Col,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, signInn } from '../../../actions/user_actions';
import { config } from '../../../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// core components

import AuthHeader from 'components/Headers/AuthHeader.jsx';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      focusedEmail: '',
      focusedPassword: '',
      error: '',
      loginRender: '',
      isAuth: false,
      userRole: '',
      isChecked: true,
    };
  }
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
    let { email, password } = this.state;
    // console.log(email, password, 'input');
    this.props.signInn(email, password).then((res) => {
      // console.log(res, 'sign in res');
      if (res === true) {
        // console.log('login');
        this.authCheck();
      } else {
        this.setState({ error: res });
      }
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
    if (this.state.isAuth === true) {
      return <Redirect to='/admin/alternative-dashboard' />;
    } else
      return (
        <>
          <AuthHeader title='Welcome!' lead='WhisperingHomes Inventory CRM.' />
          <Container className='mt--8 pb-5'>
            <Row className='justify-content-center'>
              <Col lg='5' md='7'>
                <Card className='bg-secondary border-0 mb-0'>
                  {/* <CardHeader className='bg-transparent pb-5'>
                  <div className='text-muted text-center mt-2 mb-3'>
                    <large>Big-Berry-Books</large>
                  </div> */}
                  {/* <div className="btn-wrapper text-center">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                    >
                      <span className="btn-inner--icon mr-1">
                        <img
                          alt="..."
                          src={require("assets/img/icons/common/github.svg")}
                        />
                      </span>
                      <span className="btn-inner--text">Github</span>
                    </Button>
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                    >
                      <span className="btn-inner--icon mr-1">
                        <img
                          alt="..."
                          src={require("assets/img/icons/common/google.svg")}
                        />
                      </span>
                      <span className="btn-inner--text">Google</span>
                    </Button>
                  </div> */}
                  {/* </CardHeader> */}
                  <CardBody className='px-lg-5 py-lg-5'>
                    <div className='text-center text-muted mb-4'>
                      <small>Sign in with your credentials</small>
                    </div>
                    <Form role='form'>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-email-83' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Email'
                            type='text'
                            name='email'
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
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
                            onFocus={() =>
                              this.setState({ focusedPassword: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedPassword: false })
                            }
                            name='password'
                            // autoComplete='current-password'
                            // value={this.state.password}
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                      <Badge href='#' color='warning'>
                        {this.state.error}
                      </Badge>
                      <div className='custom-control custom-control-alternative custom-checkbox'>
                        <input
                          className='custom-control-input'
                          id=' customCheckLogin'
                          type='checkbox'
                          checked={this.state.isChecked}
                          onChange={this.toggleChange}
                        />
                        <label
                          className='custom-control-label'
                          htmlFor=' customCheckLogin'
                        >
                          <span className='text-muted'>Remember me</span>
                        </label>
                      </div>
                      <div className='text-center'>
                        <Button
                          className='my-4'
                          color='info'
                          type='submit'
                          onClick={this.onSubmitHandler}
                        >
                          Sign in
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Row className='mt-3'>
                  <Col xs='6'>
                    <a
                      className='text-light'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                    >
                      <small>Forgot password?</small>
                    </a>
                  </Col>
                  {/* <Col className='text-right' xs='6'>
                  <a
                    className='text-light'
                    href='#pablo'
                    onClick={e => e.preventDefault()}
                  >
                    <small>Create new account</small>
                  </a>
                </Col> */}
                </Row>
              </Col>
            </Row>
          </Container>
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
  setUser,
  // signOut,
  signInn,
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
