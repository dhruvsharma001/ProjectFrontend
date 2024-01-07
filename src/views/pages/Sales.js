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
// import { Link } from 'react-router-dom';

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
  // CardTitle,
  // CardText,
  // ListGroupItem,
  // ListGroup,
  Container,
  Row,
  Table,

  Col,
  // ListGroup,
  // ListGroupItem,
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
import {
  editOrder,
  deleteOrder,
  addOrder,
  editStatus,
} from '../../actions/order_actions';
import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import { setUser, signOut } from '../../actions/user_actions';
import ReactDatetime from 'react-datetime';
import jwt_decode from 'jwt-decode';
import AuthHeader from 'components/Headers/AuthHeader.js';
import moment from 'moment';

import { config } from '../../siteDetails';
import axios from 'axios';
import CardsHeader from "components/Headers/CardsHeader.js";
const $ = require('jquery');
require('jszip');
require('pdfmake');
require('pdfmake/build/vfs_fonts.js');
$.DataTable = require('datatables.net-dt');
require('datatables.net-buttons-dt');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-responsive-dt');
require('datatables.net-select-dt');

class Sales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      table: {},
      startDate: '01/01/2023',
      endDate: moment().format('MM/DD/YYYY'),
    };
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.fetchMyData = this.fetchMyData.bind(this);

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

  async fetchMyData() {
    this.setState({ loading: true });
    // console.log(this.state.startDate, this.state.endDate, 'dates');
    const data = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
      this.setState({ loading: false })
    }
    else if (this.props.User.user.role === "admin") {
      axios({
        method: 'POST',
        // url: `${config.serverUrl}order/getRevenueDetails`,
        url: `${config.serverUrl}order/getSoldItems`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data, loading: false });
          console.log(response.data.data, 'allOrders');
          const tbobj = $('#example').DataTable({
            bFilter: true,
            pageLength: 20,
            scrollX: true,

            columnDefs: [
              {
                targets: 0,
                orderable: false,
              },
            ],
            pagingType: 'full_numbers',
            // responsive: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'copy',
                title: 'Report',
              },
              {
                extend: 'print',
                title: 'Payments',
              },
              {
                extend: 'csv',
                title: 'Report',
              },
            ],
          });
          this.setState({ table: tbobj });

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
    // console.log(this.props.User.user.role, 'her')
    const eodList = this.state.data;

    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>

          <td>
            <div className='card-profile-image' style={{ marginTop: 15 }}>
              <a href='#pablo'>
                <img
                  alt='...'
                  className='rounded-circle'
                  src={
                    item.ProductDetails.length > 0 && item.ProductDetails[0].imageUrl
                      ? item.ProductDetails[0].imageUrl
                      : '/static/media/team-4.23007132.jpg'
                  }
                  width="50" height="60"
                />
              </a>
            </div>

          </td>
          <td>
            {<div className='text-left mb-4'>{item.ProductDetails.length > 0 ? item.ProductDetails[0].name : `No Product with SKU ` + item._id}</div>}
          </td>
          <td>
            {<div className='text-center mb-4'>{item.ProductDetails.length > 0 ? item.ProductDetails[0].HSN : `No Product with SKU ` + item._id}</div>}
          </td>
          <td>
            {<div className='text-center mb-4'>{item.ProductDetails.length > 0 ? item.ProductDetails[0].SKU : `No Product with SKU ` + item._id}</div>}
          </td>
          <td>
            {
              <div className='text-center mb-4'>
                {item.ProductDetails.length > 0 ? item.ProductDetails[0].quantity : `No Product with SKU ` + item._id}
              </div>
            }
          </td>
          <td>
            {
              <div className='text-center mb-4'>
                {item.sold}
              </div>
            }
          </td>


          {/* ) : null} */}
        </tr>
      );
    };

    return (
      <>
        <CardsHeader name="Sales" parentName="WhisperingHomes" />
        <Container className="mt--6" fluid>

          <Row className="card-wrapper">

            <Col lg="12">


              {this.props.User.user.role === "admin" ? (<Card>
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
              </Card>) : ""}


            </Col>
          </Row>
          {this.state.loading === true ? (
            <Row>
              <Col md='12' className='text-center'>
                <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) :
            <Row>
              <div className='col'>
                <Card>
                  <CardHeader className='border-0'>
                    <h3 className='mb-0'>Sales  Results:</h3>
                  </CardHeader>


                  {this.props.User.user.role === "admin" ? (<Table
                    id='example'
                    className='display'
                    width='100%'
                  // ref={(el) => (this.el = el)}
                  >
                    <thead>
                      <tr role='row'>
                        <th>Entries</th>
                        <th>Product</th>
                        <th> Name</th>
                        <th>HSN</th>
                        <th>SKU</th>
                        <th>Quantity Available</th>
                        <th>Quantity Sold</th>
                        {/* {this.props.User.user.role === 'admin' ? (
                      <th>Actions</th>
                      ) : null} */}
                      </tr>
                    </thead>
                    <tbody>
                      {eodList.map((item, index) => tblrow(item, index))}
                    </tbody>
                  </Table>) : (
                    <AuthHeader
                      title='Insufficient Rights to view Sales Details.'
                      lead='Login with the admin account to view Sales Module..'
                    />
                  )}
                </Card>
              </div>
            </Row>
          }
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
  editOrder,
  deleteOrder,
  addOrder,
  editStatus,
  signOut,
  setUser
};
export default connect(mapStateToProps, mapDispatchToProps)(Sales);
