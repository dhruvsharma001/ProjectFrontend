/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Order Page: https://www.creative-tim.com/order/argon-dashboard-pro-react
* Copyright 2019 Whispering Homes (https://www.creative-tim.com)

* Coded by Whispering Homes

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';

// reactstrap components
import {
  // Badge,
  Button,
  Card,
  CardHeader,
  // CardFooter,
  // DropdownMenu,
  CardBody,
  // CardImg,
  // CardImgOverlay,
  CardTitle,
  CardText,
  // ListGroupItem,
  // ListGroup,
  Container,
  Row,
  Col,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  // Progress,
  // Table,
  // Form,
  // Input,
  // InputGroupAddon,
  // InputGroupText,
  // InputGroup,
  // Modal,
  FormGroup,
  // UncontrolledTooltip
} from 'reactstrap';

// core components
// import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

import {
  editOrder,
  deleteOrder,
  addOrder,
  editStatus,
} from '../../actions/order_actions';
import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import { signOut, setUser } from '../../actions/user_actions';
import ReactDatetime from 'react-datetime';
import moment from 'moment';

import { config } from '../../siteDetails';
import axios from 'axios';
import CardsHeader from "components/Headers/CardsHeader.js";
import AuthHeader from 'components/Headers/AuthHeader.js';


class Revenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ "_id": 0, "total": 0 }],
      data1: [{ "_id": 0, "orderBuyingPrice": 0 }],
      data2: [{ "_id": null, totalExpenses: 0 }],
      loading: true,
      expenses: 0,
      isChecked: false,
      ordersCount: 0,
      startDate: '01/01/2023',
      endDate: moment().format('MM/DD/YYYY'),
    };
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.fetchMyData = this.fetchMyData.bind(this);
    this.toggleCheckChange = this.toggleCheckChange.bind(this);
  }
  toggleCheckChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  }
  handleStartDate(date) {
    // console.log(date.toDate()) // Tue Nov 24 2020 00:00:00 GMT+0400 (Gulf Standard Time)
    //  console.log(date.format("DD-MM-YYYY")) //24-11-2020
    this.setState({ startDate: date.format("MM/DD/YYYY") });
    // console.log(this.state.startDate, 'start date')
  }
  handleEndDate(date) {
    this.setState({ endDate: date.format("MM/DD/YYYY") });
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

  async fetchMyData() {
    this.setState({ loading: true, expenses: 0 });
    // console.log(this.state.startDate, this.state.endDate, 'dates');
    const data = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
      this.setState({ loading: false, expenses: 0 });

    }
    else if (this.props.User.user.role === 'admin') {


      await axios({
        method: 'POST',
        url: `${config.serverUrl}order/getRevenueDetails`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data });
          // console.log(response.data.data, 'allOrders');
          this.setState({ saleTotal: this.state.data.map(o => o.total).reduce((a, c) => { return a + c }) });

        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'POST',
        url: `${config.serverUrl}order/getOrdersCost`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data1: response.data.data, loading: false });
          // console.log(response.data.data, 'allOrders getOrdersCost');
          this.setState({ costTotal: this.state.data1.map(o => o.orderBuyingPrice).reduce((a, c) => { return a + c }) });

        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'POST',
        url: `${config.serverUrl}expense/getExpenses`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data2: response.data.data, loading: false });
          // console.log(response.data.data, 'expenses details');  
          this.setState({ expenses: this.state.data2.map(o => o.totalExpenses).reduce((a, c) => { return a + c }) });

        })
        .catch((err) => {
          console.log(err);
        });
      await axios({
        method: 'POST',
        url: `${config.serverUrl}order/getOrdersCount`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ ordersCount: response.data.data[0].no_of_delivered_orders, loading: false });
          // console.log(response.data.data, 'expenses details');

        })
        .catch((err) => {
          console.log(err);
        });
    }

  }



  async componentDidMount() {
    await this.checkExpiry();
    this.fetchMyData();
  }
  render() {

    const listItems = this.state.data.map((d, index) => <Card key={index}>
      <CardBody>
        <CardTitle className="mb-3" tag="h3">
          orderId: {d._id}
        </CardTitle>
        <CardText className="mb-4">
          Order Amount: {Math.round((d.total) * 100) / 100}
        </CardText>

      </CardBody>
    </Card>);
    const listItems1 = this.state.data1.map((d, index) => <Card key={index}>
      <CardBody>
        <CardTitle className="mb-3" tag="h3">
          orderId:  {d._id}
        </CardTitle>
        <CardText className="mb-4">
          Order Cost: {Math.round((d.orderBuyingPrice) * 100) / 100}
        </CardText>

      </CardBody>
    </Card>);

    return (
      <>
        <CardsHeader name="Revenue" parentName="Components" />
        {this.props.User.user.role === "admin" ? (<Container className="mt--6" fluid>

          <Row className="card-wrapper">

            <Col lg="12">


              <Card>
                <CardBody>
                  {/* <Form role='form' onSubmit={this.fetchMyData}> */}
                  <div className='form-row'>
                    <Col className='mb-3' md='4'>

                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="exampleDatepicker"
                        >
                          Orders From
                        </label>
                        <ReactDatetime
                          inputProps={{
                            placeholder: "Date Picker Here"
                          }}
                          timeFormat={false}
                          name='orderDate'
                          value={this.state.startDate}
                          onChange={this.handleStartDate}
                        />
                      </FormGroup>

                    </Col>
                    <Col className='mb-3' md='4'>

                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="exampleDatepicker"
                        >
                          Orders To
                        </label>
                        <ReactDatetime
                          inputProps={{
                            placeholder: "Date Picker Here"
                          }}
                          timeFormat={false}
                          name='orderDate'
                          value={this.state.endDate}
                          onChange={this.handleEndDate}
                        />
                      </FormGroup>
                    </Col>
                  </div>
                  <Button color='warning' onClick={this.fetchMyData}>
                    Submit form
                  </Button>

                  {/* </Form> */}

                </CardBody>
              </Card>

              <Card className="card-pricing bg-gradient-info border-0 text-center mb-4">
                <CardHeader className="bg-transparent">
                  <h4 className="text-uppercase ls-1 text-white py-3 mb-0">
                    Revenue Stats
                  </h4>
                </CardHeader>
                <CardBody className="px-lg-7">
                  {/* <CardTitle className="mb-3" tag="h3">
                    Revenue Stats
                  </CardTitle> */}
                  {/* <CardText className="mb-4" >
                    Total Orders (Delivered) : { this.state.ordersCount}<br></br>
                    Total Sales : {" Rs "}{Math.round((this.state.saleTotal) * 100)/100}<br></br>
                    Total Cost (Product Buying Cost + Shipping Cost): {" Rs "}{Math.round((this.state.costTotal) * 100)/100}<br></br>
                    Total Expenses: {" Rs "}{Math.round((this.state.expenses) * 100)/100}<br></br>
                    {this.state.data2.map((value, key) => {
                      return <li key={key}>{value._id} {" : "}{" Rs "}{value.totalExpenses}</li>
                    })}
                    Revenue: {" Rs "}{Math.round((this.state.saleTotal - this.state.costTotal - this.state.expenses) * 100)/100}

                  </CardText> */}
                  <div className="display-2 text-white">Revenue: {" Rs "}{Math.round((this.state.saleTotal - this.state.costTotal - this.state.expenses) * 100) / 100}</div>
                  <span className="text-white">(during range)</span>
                  <ul className="list-unstyled my-4">
                    <li>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                            <i className="fas fa-terminal fa-pulse fa-spin fa-3x" />
                          </div>
                        </div>
                        <div>
                          <span className="pl-2 text-lg text-white">
                            Total Orders (Delivered) : {this.state.ordersCount}<br></br>

                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                            <i className="fas fa-dollar-sign fa-spin fa-2x" />
                          </div>
                        </div>
                        <div>
                          <span className="pl-2 text-lg text-white">
                            Total Sales : {" Rs "}{Math.round((this.state.saleTotal) * 100) / 100}<br></br>

                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                            <i className="fas fa-shipping-fast fa-pulse fa-spin fa-3x" />
                          </div>
                        </div>
                        <div>
                          <span className="pl-2 text-lg text-white">
                            Total Cost (Product Buying Cost + Shipping Cost): {" Rs "}{Math.round((this.state.costTotal) * 100) / 100}<br></br>

                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        <div>

                        </div>
                        <div>
                          <span className="pl-2 text-lg text-white">
                            Total Expenses: {" Rs "}{Math.round((this.state.expenses) * 100) / 100}<br></br>
                            {this.state.data2.map((value, key) => {
                              return (
                                <ul className="list-unstyled my-4" key={key}>
                                  <li >
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <div className="icon icon-xs icon-shape bg-white shadow rounded-circle">
                                          <i className="fas fa-hand-holding-usd fa-spin fa-3x" />
                                        </div>
                                      </div>
                                      <div>
                                        <span className="pl-2 text-lg text-white">
                                          {value._id} {" : "}{" Rs "}{value.totalExpenses}<br></br>

                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>)
                            })}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>

                </CardBody>
              </Card>


            </Col>
          </Row>
          {this.state.loading === true ? (
            <Row>
              <Col md='12' className='text-center'>
                <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : null}
          <Row>
            <Col>
              <div className="d-flex align-items-center">
                <div>
                  <label className='custom-toggle custom-toggle-info mr-2 ' >
                    <input
                      type='checkbox'
                      id='cb-1'
                      checked={this.state.ischecked}
                      onChange={this.toggleCheckChange

                      }
                    />
                    <span
                      className='custom-toggle-slider rounded-circle'
                      data-label-off='No'
                      data-label-on='Yes'
                    />
                  </label>
                  <div className="icon icon-lg icon-shape bg-info shadow rounded-circle">
                    <i className="fas fa-shipping-fast fa-pulse fa-spin fa-1x" />
                  </div>
                </div>
                <div>

                  <span className="pl-2 text-lg text-black">
                    Show all orders :

                  </span>

                </div>
              </div>

            </Col>
          </Row>

          {this.state.isChecked ? (<Row style={{ marginTop: '15px' }}>
            <Col lg="4">
              {listItems}
            </Col>
            <Col lg="4">
              {listItems1}
            </Col>
          </Row>) : ""}
        </Container>) : (<>
          <CardHeader className='border-0'>
            <h3 className='mb-0'>Revenue :</h3>

          </CardHeader>
          <AuthHeader
            title='Insufficient Rights to view Revenue Details.'
            lead='Login with the admin account to view Revenue Details..'
          /></>)}
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
  editOrder,
  deleteOrder,
  addOrder,
  editStatus,
  signOut,
  setUser
};
export default connect(mapStateToProps, mapDispatchToProps)(Revenue);
