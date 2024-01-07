
import React from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,

  Media,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { config } from '../../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
class AdminNavbar extends React.Component {
  // function that on mobile devices makes the search open
  openSearch = () => {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  };
  // function that on mobile devices makes the search close
  closeSearch = () => {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  };
  getUid = () => {
    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      return decoded.user.uid;
    } else {
      return null;
    }
  };
  getRole = () => {
    const decoded = jwt_decode(localStorage.authToken);
    return decoded.user.role;
  };
  getName = () => {
    const abc = 'default';
    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      return decoded.user.name;
    } else {
      return abc;
    }
  };
  logout = () => {
    axios({
      method: 'GET',
      url: `${config.serverUrl}login/loggedout`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken,
      },
    })
      .then((response) => {
        // window.ipcRenderer.sendSync('logOut', 'logout');

        localStorage.removeItem('authToken');
        if (response.data.success === 'OK') {
          this.props.history.push('/auth/login');
          // return <Redirect to='/auth/Login' />;
        } else {
          this.props.history.push('/auth/login');
          console.log('could not log out.');
        }
      })
      .catch((err) => console.log(err, 'error logging out!'));
  };
  componentDidMount() {
    // let uid = this.getUid();
    // console.log(uid, '&&');
    // const self = this;
    // window.ipcRenderer.on('message', function(event, data) {
    //   self.props.history.push('/admin/dashboard');
    // });
  }
  render() {
    return (
      <>
        <Navbar
          className={classnames(
            'navbar-top navbar-expand border-bottom',
            { 'navbar-dark bg-info': this.props.theme === 'dark' },
            { 'navbar-light bg-secondary': this.props.theme === 'light' }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen={false}>
              {/* <Form
                className={classnames(
                  'navbar-search form-inline mr-sm-3',
                  { 'navbar-search-light': this.props.theme === 'dark' },
                  { 'navbar-search-dark': this.props.theme === 'light' }
                )}
              >
                <FormGroup className='mb-0'>
                  <InputGroup className='input-group-alternative input-group-merge'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='fas fa-search' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder='Search' type='text' />
                  </InputGroup>
                </FormGroup>
                <button
                  aria-label='Close'
                  className='close'
                  type='button'
                  onClick={this.closeSearch}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </Form> */}

              <Nav className='align-items-center ml-md-auto' navbar>
                {/* <NavItem className='d-xl-none'>
                  <div
                    className={classnames(
                      'pr-3 sidenav-toggler',
                      { active: this.props.sidenavOpen },
                      { 'sidenav-toggler-dark': this.props.theme === 'dark' }
                    )}
                    onClick={this.props.toggleSidenav}
                  >
                    <div className='sidenav-toggler-inner'>
                      <i className='sidenav-toggler-line' />
                      <i className='sidenav-toggler-line' />
                      <i className='sidenav-toggler-line' />
                    </div>
                  </div>
                </NavItem>
                <NavItem className='d-sm-none'>
                  <NavLink onClick={this.openSearch}>
                    <i className='ni ni-zoom-split-in' />
                  </NavLink>
                </NavItem> */}

                {/* <UncontrolledDropdown nav>
                  <DropdownToggle className='nav-link' color='' tag='a'>
                    <i className='ni ni-bell-55' />
                  </DropdownToggle>
                  <DropdownMenu
                    className='dropdown-menu-xl py-0 overflow-hidden'
                    right
                  >
                    <div className='px-3 py-3'>
                      <h6 className='text-sm text-muted m-0'>
                        You have <strong className='text-info'>13</strong>{' '}
                        notifications.
                      </h6>
                    </div>

                    <ListGroup flush>
                      <ListGroupItem
                        className='list-group-item-action'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        tag='a'
                      >
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <img
                              alt='...'
                              className='avatar rounded-circle'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </Col>
                          <div className='col ml--2'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <div>
                                <h4 className='mb-0 text-sm'>John Snow</h4>
                              </div>
                              <div className='text-right text-muted'>
                                <small>2 hrs ago</small>
                              </div>
                            </div>
                            <p className='text-sm mb-0'>
                              Let's meet at Starbucks at 11:30. Wdyt?
                            </p>
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem
                        className='list-group-item-action'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        tag='a'
                      >
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <img
                              alt='...'
                              className='avatar rounded-circle'
                              src={
                                this.props.User.user.profile
                                  ? config.imageUrl +
                                    '/timetracker/profiles/' +
                                    this.props.User.user.profile
                                  : require('assets/img/theme/team-2.jpg')
                              }
                            />
                          </Col>
                          <div className='col ml--2'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <div>
                                <h4 className='mb-0 text-sm'>John Snow</h4>
                              </div>
                              <div className='text-right text-muted'>
                                <small>3 hrs ago</small>
                              </div>
                            </div>
                            <p className='text-sm mb-0'>
                              A new issue has been reported for Argon.
                            </p>
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem
                        className='list-group-item-action'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        tag='a'
                      >
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <img
                              alt='...'
                              className='avatar rounded-circle'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </Col>
                          <div className='col ml--2'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <div>
                                <h4 className='mb-0 text-sm'>John Snow</h4>
                              </div>
                              <div className='text-right text-muted'>
                                <small>5 hrs ago</small>
                              </div>
                            </div>
                            <p className='text-sm mb-0'>
                              Your posts have been liked a lot.
                            </p>
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem
                        className='list-group-item-action'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        tag='a'
                      >
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <img
                              alt='...'
                              className='avatar rounded-circle'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </Col>
                          <div className='col ml--2'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <div>
                                <h4 className='mb-0 text-sm'>John Snow</h4>
                              </div>
                              <div className='text-right text-muted'>
                                <small>2 hrs ago</small>
                              </div>
                            </div>
                            <p className='text-sm mb-0'>
                              Let's meet at Starbucks at 11:30. Wdyt?
                            </p>
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem
                        className='list-group-item-action'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        tag='a'
                      >
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <img
                              alt='...'
                              className='avatar rounded-circle'
                              src={require('assets/img/theme/team-5.jpg')}
                            />
                          </Col>
                          <div className='col ml--2'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <div>
                                <h4 className='mb-0 text-sm'>John Snow</h4>
                              </div>
                              <div className='text-right text-muted'>
                                <small>3 hrs ago</small>
                              </div>
                            </div>
                            <p className='text-sm mb-0'>
                              A new issue has been reported for Argon.
                            </p>
                          </div>
                        </Row>
                      </ListGroupItem>
                    </ListGroup>

                    <DropdownItem
                      className='text-center text-info font-weight-bold py-3'
                      href='#pablo'
                      onClick={e => e.preventDefault()}
                    >
                      View all
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>*/}
                <UncontrolledDropdown nav>
                  <DropdownToggle className='nav-link' color='' tag='a'>
                    <i className='ni ni-ungroup' />
                  </DropdownToggle>
                  <DropdownMenu
                    className='dropdown-menu-lg dropdown-menu-dark bg-default'
                    right
                  >
                    <Row className='shortcuts px-4'>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/orders')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-indigo'>
                          <i className='ni ni-collection' />
                        </span>
                        <small>Orders</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/products')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-orange'>
                          <i className='ni ni-tag' />
                        </span>
                        <small>Products</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/logs')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-yellow'>
                          <i className='ni ni-credit-card' />
                        </span>
                        <small> Logs</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() => this.props.history.push('/admin/revenue')}
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-red'>
                          <i className='ni ni-money-coins' />
                        </span>
                        <small>Revenue</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/sales')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-purple'>
                          <i className='ni ni-cart' />
                        </span>
                        <small>Sales</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/expenses')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-teal'>
                          <i className='ni ni-book-bookmark' />
                        </span>
                        <small>Expenses</small>
                      </Col>

                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/inventoryUpdate')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-pink'>
                          <i className='ni ni-book-bookmark' />
                        </span>
                        <small>Inventory Update</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/orderlogs')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-cyan'>
                          <i className='ni ni-book-bookmark' />
                        </span>
                        <small>Order Logs</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/expenseLogs')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-orange'>
                          <i className='ni ni-book-bookmark' />
                        </span>
                        <small>Expenses Logs</small>
                      </Col>
                      <Col
                        className='shortcut-item'
                        onClick={() =>
                          this.props.history.push('/admin/alternative-dashboard')
                        }
                        xs='4'
                        tag='a'
                      >
                        <span className='shortcut-media avatar rounded-circle bg-gradient-yellow'>
                          <i className='ni ni-basket' />
                        </span>
                        <small>Dashboard</small>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <Nav className='align-items-center ml-auto ml-md-0' navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className='nav-link pr-0' color='' tag='a'>
                    <Media className='align-items-center'>
                      <span className='avatar avatar-sm rounded-circle'>
                        <img
                          alt='...'
                          src={
                            this.props.User.user.profile
                              ? config.imageUrl +
                              '/timetracker/profiles/' +
                              this.props.User.user.profile
                              : require('assets/img/theme/team-4.jpg')
                          }
                        />
                      </span>
                      <Media className='ml-2 d-none d-lg-block'>
                        <span className='mb-0 text-sm font-weight-bold'>
                          {this.getName()}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className='noti-title' header tag='div'>
                      <h6 className='text-overflow m-0'>Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem
                      to='/admin/profile'
                      tag={Link}
                    // href='#/admin/profile'
                    // onClick={() => {
                    //   return <Redirect to='#/admin/employees' />;
                    // }}
                    >
                      <i className='ni ni-single-02' />
                      <span>My profile</span>
                    </DropdownItem>
                    {/* <DropdownItem
                      href='#pablo'
                      onClick={e => e.preventDefault()}
                    >
                      <i className='ni ni-settings-gear-65' />
                      <span>Settings</span>
                    </DropdownItem> */}
                    {/* <DropdownItem
                      href='#pablo'
                      onClick={e => e.preventDefault()}
                    >
                      <i className='ni ni-calendar-grid-58' />
                      <span>Activity</span>
                    </DropdownItem>
                    <DropdownItem
                      href='#pablo'
                      onClick={e => e.preventDefault()}
                    >
                      <i className='ni ni-support-16' />
                      <span>Support</span>
                    </DropdownItem> */}
                    <DropdownItem divider />
                    <DropdownItem onClick={() => this.logout()}>
                      <i className='ni ni-user-run' />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
AdminNavbar.defaultProps = {
  toggleSidenav: () => { },
  sidenavOpen: false,
  theme: 'dark',
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
};

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);
