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

// reactstrap components
import {
  Badge,
  // Button,
  Card,
  CardHeader,
  // CardFooter,
  // DropdownMenu,
  // DropdownItem,
  // DropdownToggle,
  // UncontrolledDropdown,
  // Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  // Progress,
  Table,
  // Form,
  // Input,
  // InputGroupAddon,
  // InputGroupText,
  // CardBody,
  // InputGroup,
  // Modal,
  Container,
  Row,
  Col,
  // FormGroup,
  // UncontrolledTooltip
} from 'reactstrap';
// import Papa from 'papaparse';
import { Link } from 'react-router-dom';

// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';
import {
  editProduct,
  deleteProduct,
  addProduct,
} from '../../actions/product_actions';
import {signOut, setUser } from '../../actions/user_actions';
import jwt_decode from 'jwt-decode';
import AuthHeader from 'components/Headers/AuthHeader.js';

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
// import ReactBSAlert from 'react-bootstrap-sweetalert';
// import classnames from 'classnames';

// import Moment from 'react-moment';
// import ReactDatetime from 'react-datetime';
// import moment from 'moment';
import { config } from '../../siteDetails';
import axios from 'axios';
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

class InventoryUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: null,
      activeNav: 1,
      breaksCount: '',
      remarks: '',
      isChecked: false,
      updateQuantity: 0,
      toggle: false,
      activePage: 1,
      formModal: false,
      notifyAlert: null,
      totalSections: 0,
      activeSection: 0,
      date: '',
      data: [],
      id: '',
      table: {},
      userId: '',
      category: '',
      name: '',
      quantity: '',
      loading: true,
      SKU: '',
      type: '',
      HSN: '',
      BuyingPrice: null,
      SellingPrice: null,
      imageUrl: '',
    };
  }
  searchHandler = () => {
    this.state.table.destroy();
    this.fetchMyData();
  };

  fetchMyData() {
    const data = {
      selected_date: this.state.date,
    };
    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
    this.setState({loading: false});
    }
    else if(this.props.User.user.role === 'admin'){
      axios({
        method: 'GET',
        url: `${config.serverUrl}products/get`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data , loading: false});
          const tbobj = $('#example').DataTable({
            //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
            // bFilter: false,
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
                title: 'Products',
              },
              {
                extend: 'print',
                title: 'Products',
              },
              {
                extend: 'csv',
                title: 'Products',
              },
              //   {
              //     extend: 'excel',
              //     title: 'Products'
              // }
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
    // console.log(this.props.User, 'date picked');
    // console.log(this.state.csvfile);

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.SKU}</td>
          {/* <td>{<Input></Input>}</td>
          <td>{<div className='text-center mb-4' style={{marginTop: 15}}>
            <label className="custom-toggle custom-toggle-danger mr-1">
                        <input         defaultChecked={this.state.isChecked}
                                  onChange={this.toggleCheckChange}
 type="checkbox" />
                        <span
                          className="custom-toggle-slider rounded-circle"
                          data-label-off="No"
                          data-label-on="Yes"
                        />
                      </label></div>}</td>
                      <td><Input
                            defaultValue="23"
                            id="example-number-input"
                            type="number"
                          /></td> */}
          {/* <td>{item.HSN}</td>
          <td>{item.BuyingPrice}</td>
          <td>{item.SellingPrice}</td>
          <td>{item.Category}</td> */}
          {/* <td>
            
            <span className='avatar avatar-lg rounded-circle'>
              <img
                alt='...'
                // className='rounded-circle'
                src={
                  item.imageUrl
                    ? item.imageUrl
                    : '/static/media/team-4.23007132.jpg'
                }
              />
            </span>
          </td> */}
          {/* <td>{item.ReOrder ? 'Low Stock' : 'N/A'}</td> */}
          <td>
            {/* <div className='text-center mb-4' style={{marginTop: 15}}> */}
            {/* <Button
              className='btn-icon-only rounded-circle'
              title='Edit'
              color='success'
              type='button'
              onClick={() => {
                this.editProduct(item);
              }}
            >
              <span className='btn-inner--icon'>
                <i className='ni ni-active-40' />
              </span>
            </Button>
            <Button
              className='btn-icon-only rounded-circle'
              title='Delete'
              color='warning'
              type='button'
              onClick={() => {
                this.warningAlert(item._id);
              }}
            >
              <span className='btn-inner--icon'>
                <i className='ni ni-basket' />
              </span>
            </Button> */}
            {
              <Link
                to={{
                  pathname: 'inventoryUpdateProduct/edit/' + item._id,
                  state: { product: item },
                }}
              >
                <Badge color='danger'>
                  <i className='fa fa-edit' title='Edit'></i>
                </Badge>
              </Link>
            }
            {/* </div> */}
          </td>
        </tr>
      );
    };

    return (
      <>
        <SimpleHeader name='Products' parentName='Products' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Products Inventory:</h3>
                </CardHeader>
                {/* <Row style={{ marginLeft: 10 }}>
                  <Col md='4'>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Date Picker Here',
                        }}
                        onChange={this.handleDate}
                        timeFormat={false}
                      />
                    </FormGroup>
                  </Col>
                  <div className='col'>
                    <Button
                      color='primary'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div>

                  <div className='col'>
                    <Button
                      color='warning'
                      type='button'
                      onClick={() => this.verifyInventory()}
                    >
                      Verify Inventory
                    </Button>
                    {this.state.loading === true ? (
                      <Loader
                        type='ThreeDots'
                        color='#fb6340'
                        height={80}
                        width={80}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='col'>
                    <input
                      className='csv-input'
                      type='file'
                      accept='.csv'
                      // ref={this.hiddenFileInput}
                      // hidden
                      placeholder={null}
                      onChange={this.handleChange}
                    />
                    <Button
                      color='warning'
                      type='button'
                      style={{ marginTop: 10 }}
                      onClick={() => this.handleClick()}
                    >
                      Upload Product CSV
                    </Button>
                  </div>
                </Row>
                 */}
                {this.props.User.user.role === 'admin' ? (<Table
                  id='example'
                  className='display'
                  width='100%'
                  style={{ marginLeft: 10 }}
                  // ref={(el) => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>SKU</th>
                      {/* <th>Remarks</th>
                      <th>Update Status</th>
                      <th>Update Quantity</th> */}
                      {/* <th>HSN</th>
                      <th>BuyingPrice</th>
                      <th>SellingPrice</th>
                      <th>Category</th>
                      <th>Image</th> */}
                      {/* <th>ReOrder Status</th> */}
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </Table>) : (
                  <AuthHeader
                  title='Insufficient Rights to view Inventory Details.'
                  lead='Login with the admin account to view Inventory Module..'
                />
                )}
              </Card>
            </div>
          </Row>
          {this.state.loading === true ?  (
            <Row>
              <Col md='12' className='text-center'>
            <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) :null}
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
  editProduct,
  deleteProduct,
  addProduct,
  signOut,
  setUser
};
export default connect(mapStateToProps, mapDispatchToProps)(InventoryUpdate);
