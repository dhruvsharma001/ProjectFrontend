import React from 'react';
// react plugin for creating vector maps
import { VectorMap } from 'react-jvectormap';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
import { config } from '../../../siteDetails';
import axios from 'axios';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { signOut } from '../../../actions/user_actions';

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  ListGroupItem,
  ListGroup,
  Media,
  Progress,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap';
// core components
import AlternativeHeader from 'components/Headers/AlternativeHeader.js';
import { setUser, signInn } from '../../../actions/user_actions';

import {
  chartOptions,
  parseOptions,
  chartExample2,
  chartExample3,
} from 'variables/charts.js';

let mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920,
};

class Alternative extends React.Component {
  constructor(props) {
    super(props);

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  state = {
    productsCount: 0,
    customersCount: 0,
    ordersCount: 0,
    dataset: [],
  };
  async fetchMyData() {
    // console.log(data, this.props.User.user.uid, 'here');
    if (this.props.User.user.role === 'admin') {
      await axios({
        method: 'GET',
        url: `${config.serverUrl}products/count`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
        .then((response) => {
          this.setState({ productsCount: response.data.data });
        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'GET',
        url: `${config.serverUrl}customers/count`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
        .then((response) => {
          this.setState({ customersCount: response.data.data });
        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'GET',
        url: `${config.serverUrl}order/getYearlyChartInfo`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
        .then((response) => {
          // console.log(response.data.data, 'response');
          this.setState({ dataset: response.data.data });
        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'GET',
        url: `${config.serverUrl}order/count`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
        .then((response) => {
          this.setState({ ordersCount: response.data.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  checkExpiry = () => {

    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        this.props.history.push('/auth/login');
      } else {
        this.props.setUser(localStorage.authToken);

        // console.log(decoded.user.role, decoded.user.uid, 'token still valid');
      }
    } else {
      console.log('no token found');
      this.props.history.push('/auth/login');
    }
  };
  async componentDidMount() {
    await this.checkExpiry();
    this.fetchMyData();
  }
  render() {
    let datasample = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Orders",
          data: this.state.dataset[1]
        }
      ]
    }
    let datasample1 = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Orders",
          data: this.state.dataset[0]
        }
      ]
    }
    // console.log(this.state.dataset, 'dataset')

    return (
      <>
        <AlternativeHeader />
        <Container className='mt--6' fluid>
          <Row>
            <Col md='6' xl='3'>
              <Card className='bg-gradient-primary border-0'>
                <CardBody>
                  <Row>
                    <div className='col'>
                      <CardTitle
                        tag='h5'
                        className='text-uppercase text-muted mb-0 text-white'
                      >
                        Total Products
                      </CardTitle>
                      <span className='h2 font-weight-bold mb-0 text-white'>
                        {this.state.productsCount}
                      </span>
                      <Progress
                        className='progress-xs mt-3 mb-0'
                        max='100'
                        value='30'
                        color='success'
                      />
                    </div>
                    <Col className='col-auto'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          size='sm'
                          color='neutral'
                          className='mr-0'
                        >
                          <i className='fas fa-ellipsis-h' />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                  <p className='mt-3 mb-0 text-sm'>
                    <a
                      className='text-nowrap text-white font-weight-600'
                      href='#pablo'
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push('/admin/products');
                      }}
                    >
                      See details
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md='6' xl='3'>
              <Card className='bg-gradient-info border-0'>
                <CardBody>
                  <Row>
                    <div className='col'>
                      <CardTitle
                        tag='h5'
                        className='text-uppercase text-muted mb-0 text-white'
                      >
                        Customers
                      </CardTitle>
                      <span className='h2 font-weight-bold mb-0 text-white'>
                        {this.state.customersCount}
                      </span>
                      <Progress
                        className='progress-xs mt-3 mb-0'
                        max='100'
                        value='50'
                        color='success'
                      />
                    </div>
                    <Col className='col-auto'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          size='sm'
                          color='neutral'
                          className='mr-0'
                        >
                          <i className='fas fa-ellipsis-h' />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                  <p className='mt-3 mb-0 text-sm'>
                    <a
                      className='text-nowrap text-white font-weight-600'
                      href='#pablo'
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push('/admin/customers');
                      }}
                    >
                      See details
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md='6' xl='3'>
              <Card className='bg-gradient-danger border-0'>
                <CardBody>
                  <Row>
                    <div className='col'>
                      <CardTitle
                        tag='h5'
                        className='text-uppercase text-muted mb-0 text-white'
                      >
                        Delivered Orders Count
                      </CardTitle>
                      <span className='h2 font-weight-bold mb-0 text-white'>
                        {this.state.ordersCount}
                      </span>
                      <Progress
                        className='progress-xs mt-3 mb-0'
                        max='100'
                        value='80'
                        color='success'
                      />
                    </div>
                    <Col className='col-auto'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          size='sm'
                          color='neutral'
                          className='mr-0'
                        >
                          <i className='fas fa-ellipsis-h' />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                  <p className='mt-3 mb-0 text-sm'>
                    <a
                      className='text-nowrap text-white font-weight-600'
                      href='#pablo'
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push('/admin/orders');
                      }}
                    >
                      See details
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md='6' xl='3'>
              <Card className='bg-gradient-default border-0'>
                <CardBody>
                  <Row>
                    <div className='col'>
                      <CardTitle
                        tag='h5'
                        className='text-uppercase text-muted mb-0 text-white'
                      >
                        Notifications
                      </CardTitle>
                      <span className='h2 font-weight-bold mb-0 text-white'>
                        50/62
                      </span>
                      <Progress
                        className='progress-xs mt-3 mb-0'
                        max='100'
                        value='90'
                        color='success'
                      />
                    </div>
                    <Col className='col-auto'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          size='sm'
                          color='neutral'
                          className='mr-0'
                        >
                          <i className='fas fa-ellipsis-h' />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                  <p className='mt-3 mb-0 text-sm'>
                    <a
                      className='text-nowrap text-white font-weight-600'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                    >
                      See details
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <div className='card-deck flex-column flex-xl-row'>
            <Card>
              <CardHeader className='bg-transparent'>
                <h6 className='text-muted text-uppercase ls-1 mb-1'>
                  Overview
                </h6>
                <h2 className='h3 mb-0'>Sales value</h2>
              </CardHeader>
              <CardBody>
                <div className='chart'>
                  <Line
                    data={datasample}
                    options={chartExample3.options}
                    id='chart-sales'
                    className='chart-canvas'
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader className='bg-transparent'>
                <Row className='align-items-center'>
                  <div className='col'>
                    <h6 className='text-uppercase text-muted ls-1 mb-1'>
                      Performance
                    </h6>
                    <h2 className='h3 mb-0'>Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className='chart'>
                  <Bar
                    data={datasample1}
                    options={chartExample2.options}
                    className='chart-canvas'
                    id='chart-bars'
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Row className='align-items-center'>
                  <Col xs='8'>
                    <h6 className='surtitle'>Whispering Homes</h6>

                    <h5 className='h3 mb-0'>Progress track</h5>
                  </Col>
                  <Col className='text-right' xs='4'>
                    <Button
                      className='btn-neutral'
                      color='default'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                      size='sm'
                    >
                      Orders
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <ListGroup className='list my--3' flush>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/bootstrap.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Pending Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='60'
                          color='warning'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/angular.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Delivered Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='100'
                          color='success'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/sketch.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Cancelled Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='72'
                          color='danger'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/react.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Orders In-Transit</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='90'
                          color='info'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/vue.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Personal Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='100'
                          color='success'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </div>
          <Row>
            <Col xl='8'>
              <Card>
                <CardHeader className='border-0'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h3 className='mb-0'>Page visits</h3>
                    </div>
                    <div className='col text-right'>
                      <Button
                        color='primary'
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                        size='sm'
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className='align-items-center table-flush' responsive>
                  <thead className='thead-light'>
                    <tr>
                      <th className='sort' data-sort='name' scope='col'>
                        Project
                      </th>
                      <th className='sort' data-sort='budget' scope='col'>
                        Budget
                      </th>
                      <th className='sort' data-sort='status' scope='col'>
                        Status
                      </th>
                      <th scope='col'>Users</th>
                      <th className='sort' data-sort='completion' scope='col'>
                        Completion
                      </th>
                      <th scope='col' />
                    </tr>
                  </thead>
                  <tbody className='list'>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/bootstrap.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              Argon Design System
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$2500 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-warning' />
                          <span className='status'>pending</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip133563378'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip133563378'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip336932279'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip336932279'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip619079522'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip619079522'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip432104658'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip432104658'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>60%</span>
                          <div>
                            <Progress max='100' value='60' color='warning' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/angular.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              Angular Now UI Kit PRO
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$1800 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-success' />
                          <span className='status'>completed</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip634319950'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip634319950'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip493477456'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip493477456'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip556499717'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip556499717'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip106307927'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip106307927'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>100%</span>
                          <div>
                            <Progress max='100' value='100' color='success' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/sketch.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              Black Dashboard
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$3150 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-danger' />
                          <span className='status'>delayed</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip389668727'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip389668727'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip477178747'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip477178747'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip927225283'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip927225283'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip394856270'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip394856270'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>72%</span>
                          <div>
                            <Progress max='100' value='72' color='danger' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/react.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              React Material Dashboard
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$4400 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-info' />
                          <span className='status'>on schedule</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip51649841'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip51649841'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip85562388'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip85562388'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip195204481'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip195204481'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip967941406'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip967941406'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>90%</span>
                          <div>
                            <Progress max='100' value='90' color='info' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/vue.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              Vue Paper UI Kit PRO
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$2200 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-success' />
                          <span className='status'>completed</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip177298166'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip177298166'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip290379011'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip290379011'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip2287293'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip2287293'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip539852250'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip539852250'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>100%</span>
                          <div>
                            <Progress max='100' value='100' color='success' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope='row'>
                        <Media className='align-items-center'>
                          <a
                            className='avatar rounded-circle mr-3'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/bootstrap.jpg')}
                            />
                          </a>
                          <Media>
                            <span className='name mb-0 text-sm'>
                              Argon Design System
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className='budget'>$2500 USD</td>
                      <td>
                        <Badge className='badge-dot mr-4' color=''>
                          <i className='bg-warning' />
                          <span className='status'>pending</span>
                        </Badge>
                      </td>
                      <td>
                        <div className='avatar-group'>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip758997307'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-1.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip758997307'
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip597292977'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-2.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip597292977'
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip443183509'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-3.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip443183509'
                          >
                            Alexander Smith
                          </UncontrolledTooltip>
                          <a
                            className='avatar avatar-sm rounded-circle'
                            href='#pablo'
                            id='tooltip806450131'
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt='...'
                              src={require('assets/img/theme/team-4.jpg')}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip806450131'
                          >
                            Jessica Doe
                          </UncontrolledTooltip>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <span className='completion mr-2'>60%</span>
                          <div>
                            <Progress max='100' value='60' color='warning' />
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color=''
                            size='sm'
                            className='btn-icon-only text-light'
                          >
                            <i className='fas fa-ellipsis-v' />
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-arrow' right>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href='#pablo'
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl='4'>
              <Card className='widget-calendar'>
                <CardHeader>
                  <Row className='align-items-center'>
                    <Col xs='8'>
                      <h5 className='h3 mb-0'>Real time</h5>
                    </Col>
                    <Col className='text-right' xs='4'>
                      <Button
                        className='btn-neutral'
                        color='default'
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                        size='sm'
                      >
                        Action
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <VectorMap
                    containerClassName='vector-map vector-map-sm'
                    containerStyle={{
                      width: '100%',
                      height: '280px',
                    }}
                    map={'world_mill'}
                    zoomOnScroll={false}
                    scaleColors={['#f00', '#0071A4']}
                    normalizeFunction='polynomial'
                    hoverOpacity={0.7}
                    hoverColor={false}
                    backgroundColor='transparent'
                    regionStyle={{
                      initial: {
                        fill: '#e9ecef',
                        'fill-opacity': 0.8,
                        stroke: 'none',
                        'stroke-width': 0,
                        'stroke-opacity': 1,
                      },
                      hover: {
                        fill: '#dee2e6',
                        'fill-opacity': 0.8,
                        cursor: 'pointer',
                      },
                      selected: {
                        fill: 'yellow',
                      },
                      selectedHover: {},
                    }}
                    markerStyle={{
                      initial: {
                        fill: '#fb6340',
                        'stroke-width': 0,
                      },
                      hover: {
                        fill: '#11cdef',
                        'stroke-width': 0,
                      },
                    }}
                    markers={[
                      {
                        latLng: [41.9, 12.45],
                        name: 'Vatican City',
                      },
                      {
                        latLng: [43.73, 7.41],
                        name: 'Monaco',
                      },
                      {
                        latLng: [35.88, 14.5],
                        name: 'Malta',
                      },
                      {
                        latLng: [1.3, 103.8],
                        name: 'Singapore',
                      },
                      {
                        latLng: [1.46, 173.03],
                        name: 'Kiribati',
                      },
                      {
                        latLng: [-21.13, -175.2],
                        name: 'Tonga',
                      },
                      {
                        latLng: [15.3, -61.38],
                        name: 'Dominica',
                      },
                      {
                        latLng: [-20.2, 57.5],
                        name: 'Mauritius',
                      },
                      {
                        latLng: [26.02, 50.55],
                        name: 'Bahrain',
                      },
                    ]}
                    series={{
                      regions: [
                        {
                          values: mapData,
                          scale: ['#ced4da', '#adb5bd'],
                          normalizeFunction: 'polynomial',
                        },
                      ],
                    }}
                  />
                  <ListGroup className='list my--3' flush>
                    <ListGroupItem className='px-0'>
                      <Row className='align-items-center'>
                        <Col className='col-auto'>
                          <img
                            alt='...'
                            src={require('assets/img/icons/flags/US.png')}
                          />
                        </Col>
                        <div className='col'>
                          <small>Country:</small>
                          <h5 className='mb-0'>United States</h5>
                        </div>
                        <div className='col'>
                          <small>Visits:</small>
                          <h5 className='mb-0'>2500</h5>
                        </div>
                        <div className='col'>
                          <small>Bounce:</small>
                          <h5 className='mb-0'>30%</h5>
                        </div>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className='px-0'>
                      <Row className='align-items-center'>
                        <Col className='col-auto'>
                          <img
                            alt='...'
                            src={require('assets/img/icons/flags/DE.png')}
                          />
                        </Col>
                        <div className='col'>
                          <small>Country:</small>
                          <h5 className='mb-0'>Germany</h5>
                        </div>
                        <div className='col'>
                          <small>Visits:</small>
                          <h5 className='mb-0'>2500</h5>
                        </div>
                        <div className='col'>
                          <small>Bounce:</small>
                          <h5 className='mb-0'>30%</h5>
                        </div>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className='px-0'>
                      <Row className='align-items-center'>
                        <Col className='col-auto'>
                          <img
                            alt='...'
                            src={require('assets/img/icons/flags/GB.png')}
                          />
                        </Col>
                        <div className='col'>
                          <small>Country:</small>
                          <h5 className='mb-0'>Great Britain</h5>
                        </div>
                        <div className='col'>
                          <small>Visits:</small>
                          <h5 className='mb-0'>2500</h5>
                        </div>
                        <div className='col'>
                          <small>Bounce:</small>
                          <h5 className='mb-0'>30%</h5>
                        </div>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <div className='card-deck flex-column flex-xl-row'>
            <Card>
              <CardHeader>
                <h5 className='h3 mb-0'>Team members</h5>
              </CardHeader>
              <CardBody>
                <ListGroup className='list my--3' flush>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/team-1.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col ml--2'>
                        <h4 className='mb-0'>
                          <a href='#pablo' onClick={(e) => e.preventDefault()}>
                            John Michael
                          </a>
                        </h4>
                        <span className='text-success mr-1'>●</span>
                        <small>Online</small>
                      </div>
                      <Col className='col-auto'>
                        <Button color='primary' size='sm' type='button'>
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/team-2.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col ml--2'>
                        <h4 className='mb-0'>
                          <a href='#pablo' onClick={(e) => e.preventDefault()}>
                            Alex Smith
                          </a>
                        </h4>
                        <span className='text-warning mr-1'>●</span>
                        <small>In a meeting</small>
                      </div>
                      <Col className='col-auto'>
                        <Button color='primary' size='sm' type='button'>
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/team-3.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col ml--2'>
                        <h4 className='mb-0'>
                          <a href='#pablo' onClick={(e) => e.preventDefault()}>
                            Samantha Ivy
                          </a>
                        </h4>
                        <span className='text-danger mr-1'>●</span>
                        <small>Offline</small>
                      </div>
                      <Col className='col-auto'>
                        <Button color='primary' size='sm' type='button'>
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/team-4.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col ml--2'>
                        <h4 className='mb-0'>
                          <a href='#pablo' onClick={(e) => e.preventDefault()}>
                            John Michael
                          </a>
                        </h4>
                        <span className='text-success mr-1'>●</span>
                        <small>Online</small>
                      </div>
                      <Col className='col-auto'>
                        <Button color='primary' size='sm' type='button'>
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className='h3 mb-0'>To do list</h5>
              </CardHeader>
              <CardBody className='p-0'>
                <ListGroup data-toggle='checklist' flush>
                  <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                    <div className='checklist-item checklist-item-success checklist-item-checked'>
                      <div className='checklist-info'>
                        <h5 className='checklist-title mb-0'>Orders Notification Module</h5>
                        <small>10:30 AM</small>
                      </div>
                      <div>
                        <div className='custom-control custom-checkbox custom-checkbox-success'>
                          <input
                            className='custom-control-input'
                            defaultChecked
                            id='chk-todo-task-1'
                            type='checkbox'
                          />
                          <label
                            className='custom-control-label'
                            htmlFor='chk-todo-task-1'
                          />
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                    <div className='checklist-item checklist-item-warning'>
                      <div className='checklist-info'>
                        <h5 className='checklist-title mb-0'>Lunch meeting</h5>
                        <small>10:30 AM</small>
                      </div>
                      <div>
                        <div className='custom-control custom-checkbox custom-checkbox-warning'>
                          <input
                            className='custom-control-input'
                            id='chk-todo-task-2'
                            type='checkbox'
                          />
                          <label
                            className='custom-control-label'
                            htmlFor='chk-todo-task-2'
                          />
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                    <div className='checklist-item checklist-item-info'>
                      <div className='checklist-info'>
                        <h5 className='checklist-title mb-0'>
                          Argon Dashboard Launch
                        </h5>
                        <small>10:30 AM</small>
                      </div>
                      <div>
                        <div className='custom-control custom-checkbox custom-checkbox-info'>
                          <input
                            className='custom-control-input'
                            id='chk-todo-task-3'
                            type='checkbox'
                          />
                          <label
                            className='custom-control-label'
                            htmlFor='chk-todo-task-3'
                          />
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                    <div className='checklist-item checklist-item-danger checklist-item-checked'>
                      <div className='checklist-info'>
                        <h5 className='checklist-title mb-0'>
                          Winter Hackaton
                        </h5>
                        <small>10:30 AM</small>
                      </div>
                      <div>
                        <div className='custom-control custom-checkbox custom-checkbox-danger'>
                          <input
                            className='custom-control-input'
                            defaultChecked
                            id='chk-todo-task-4'
                            type='checkbox'
                          />
                          <label
                            className='custom-control-label'
                            htmlFor='chk-todo-task-4'
                          />
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className='h3 mb-0'>Progress track</h5>
              </CardHeader>
              <CardBody>
                <ListGroup className='list my--3' flush>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/bootstrap.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Pending Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='60'
                          color='warning'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/angular.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Delivered Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='100'
                          color='success'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/sketch.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Cancelled Orders</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='72'
                          color='danger'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className='px-0'>
                    <Row className='align-items-center'>
                      <Col className='col-auto'>
                        <a
                          className='avatar rounded-circle'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={require('assets/img/theme/react.jpg')}
                          />
                        </a>
                      </Col>
                      <div className='col'>
                        <h5>Orders In-Transit</h5>
                        <Progress
                          className='progress-xs mb-0'
                          max='100'
                          value='90'
                          color='info'
                        />
                      </div>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </div>
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
  signOut,
  signInn,
};
export default connect(mapStateToProps, mapDispatchToProps)(Alternative);

