/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Customer Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
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
  // DropdownItem,
  // DropdownToggle,
  // UncontrolledDropdown,
  // Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  // Progress,
  Table,
  Form,
  Input,
  // InputGroupAddon,
  // InputGroupText,
  CardBody,
  // InputGroup,
  Modal,
  Container,
  Row,
  // Spinner,
  Col,
  FormGroup,
  // UncontrolledTooltip
} from 'reactstrap';


// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';

import {addExpense, getExpenses, deleteExpense, editExpense} from '../../actions/expense_actions';
import jwt_decode from 'jwt-decode';
import {setUser,signOut} from '../../actions/user_actions';
import AuthHeader from 'components/Headers/AuthHeader.js';

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import ReactBSAlert from 'react-bootstrap-sweetalert';
// import classnames from 'classnames';

// import Moment from 'react-moment';
import ReactDatetime from 'react-datetime';
import moment from 'moment';
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


class Expenses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseType: '',
      expenseDate: '',
      amount: 0,
      remarks: '',
      userId: '',
      csvfile: null,
      activeNav: 1,
      toggle: false,
      activePage: 1,
      formModal: false,
      notifyAlert: null,
      totalSections: 0,
      activeSection: 0,
      loading: true,
      date: '',
      data: [],
      id: '',
      table1: {},
      name: '',
      email: '',
      phone: '',
      type: '',
      status: 'ACTIVE',
      profile: '',
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }
  searchHandler = () => {
    this.state.table1.destroy();
    this.fetchMyData();
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  onChangeHandler = (e) => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  };

  successAlert = () => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '100px' }}
          title='Success'
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
  warningAlert = (id) => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '100px' }}
          title='Warning'
          showCancel={true}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.deleteExpense(id)}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Are you sure you want to delete?
        </ReactBSAlert>
      ),
    });
  };
  failAlert = () => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '100px' }}
          title='Warning'
          showCancel={false}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Request Failed..
        </ReactBSAlert>
      ),
    });
  };

  fetchMyData() {
    const data = {
      selected_date: this.state.date,
    };
    // console.log(this.props.User.user.role, 'role')
    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
      this.setState({loading: false})
    }
    else if(this.props.User.user.role === 'admin'){
      axios({
        method: 'GET',
        url: `${config.serverUrl}expense/get`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data, loading: false });
          // console.log(this.state.data, 'allCustomers');
          const tbobj = $('#example').DataTable({
            //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
            bFilter: false,
            pageLength: 20,
            columnDefs: [
              {
                targets: 0,
                orderable: false,
              },
            ],
            pagingType: 'full_numbers',
            responsive: true,
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
          this.setState({ table1: tbobj });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  }

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  
  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };
  
  
  newExpense = () => {
    // const id = this.props.User.user.uid;
    this.setState({userId: this.props.User.user.uid})

    this.setState({
      type: 'add',
      expenseType: '',
      expenseDate: '',
      amount: 0,
      remarks: ''
    });
    this.toggleModal('formModal');
  };
  editExpense = (item) => {
    this.setState({userId: this.props.User.user.uid})

    this.setState({
      type: 'edit',
      expenseType: item.expenseType,
      expenseDate: moment(item.date).format('YYYY-MM-DD'),
      amount: item.amount,
      remarks: item.remarks,
      id: item._id,
     
    });
    this.toggleModal('formModal');
  };
  deleteExpense = (id) => {
    let userId = this.props.User.user.uid;
    this.props.deleteExpense(id, userId).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table1.destroy();
        this.fetchMyData();
        this.successAlert();
      }
    });
  };
  changeDate = (event) => {
    // console.log(event.toDate()) // Tue Nov 24 2020 00:00:00 GMT+0400 (Gulf Standard Time)
    // console.log(event.format("DD-MM-YYYY")) //24-11-2020
    this.setState({...this.state, expenseDate: event.format("YYYY-MM-DD")}) 
}
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
          title='Success'
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
  approveAlert = (id) => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '100px' }}
          title='Success'
          showCancel={true}
          onConfirm={() => this.approveLeave(id)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnText='Cancel'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          btnSize=''
        >
          Do you want to approve?
        </ReactBSAlert>
      ),
    });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.type === 'edit') {
      let { id } = this.state;
      this.setState({loading: true})
      var data = {
        expenseDate: this.state.expenseDate,
        expenseType: this.state.expenseType,
        amount: this.state.amount,
        remarks: this.state.remarks,
        userId: this.state.userId,
      };
      this.props.editExpense(data, id).then((res) => {
        if (res && res.success === 'OK') {
          this.setState({
            loading: false,
            type: '',
            formModal: false,
            expenseType: '',
            expenseDate: '',
            amount: 0,
            remarks: '',
            id: ''
          });
          this.successAlert();
          this.state.table1.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            loading: false,
            expenseType: '',
            expenseDate: '',
            amount: 0,
            remarks: '',
            id: '',
            formModal: false,
            type: '',
            
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
// console.log('add')
      data = {
        expenseDate: this.state.expenseDate,
        expenseType: this.state.expenseType,
        amount: this.state.amount,
        remarks: this.state.remarks,
        userId: this.state.userId,
      };

      this.props.addExpense(data).then((res) => {
        this.setState({loading: true});
        // console.log(res, 'response error@');
        if (res && res.success === 'OK') {
          this.setState({
            loading: false,
            expenseType: '',
            expenseDate: '',
            amount: 0,
            remarks: '',
            type: '',
            formModal: false,
            
          });
          this.successAlert();
          this.state.table1.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            loading: false,
            type: '',
            formModal: false,
            expenseType: '',
            expenseDate: '',
            amount: 0,
            remarks: '',
          });
          this.failAlert();
        }
      });
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
          <td>{<div className='text-left mb-4'>{index + 1}</div>}</td>
          <td>{<div className='text-center mb-4'>{item.expenseType}</div>}</td>
          <td>{<div className='text-left mb-4'>{item.amount}</div>}</td>
          <td>{<div className='text-left mb-4'>{moment(item.date).format('YYYY-MM-DD') }</div>}</td>
          <td>{<div className='text-left mb-4'>{item.remarks}</div>}</td>
          {this.props.User.user.role === 'admin' ? (
            <td>
              <Button
                className='btn-icon-only rounded-circle'
                title='Edit'
                color='success'
                type='button'
                onClick={() => {
                  this.editExpense(item);
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
              </Button>
            </td>
          ) : null}
        </tr>
      );
    };

    return (
      <>
    
        {this.state.notifyAlert}

        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.formModal}
          toggle={() => this.toggleModal('formModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Add Expense</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
                  <FormGroup>
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Expense Type:
                    </label>
                    <Input
                      id='exampleFormControlSelect1'
                      name='expenseType'
                      type='select'
                      value={this.state.expenseType}
                      onChange={this.onChangeHandler}
                    >
                      <option>Choose from list</option>
                      <option>Salary</option>
                      <option>Logistics</option>
                      <option>Marketing</option>
                      <option>Others</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="exampleDatepicker"
                            >
                              Expense Date
                            </label>
                            <ReactDatetime
                              inputProps={{
                                placeholder: "Expense Date Picker"
                              }}
                              timeFormat={false}
                              name='orderDate'
                              value={this.state.expenseDate}
                              onChange={this.changeDate}
                            />
                            
                          </FormGroup>
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServerUsername'
                            >
                              Amount
                            </label>
                            <Input
                              className='is-valid'
                              // defaultValue="Otto"
                              name = "amount"
                              id='validationServer02'
                              value={this.state.amount}
                              placeholder='Expense Amount'
                              required
                              type='number'
                              onChange={this.onChangeHandler}

                            />
                            <div className='valid-feedback'>Enter expense amount!</div>

                            {/* <Input
                            // defaultValue="23"
                            value={this.state.quantity}
                            onInput={this.handleChange.bind(this)}
                            id="example-number-input"
                            type="number"
                          /> */}
                          </FormGroup>
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServer04'
                            >
                              Remarks
                            </label>
                            <Input
                              className='is-valid'
                              name='remarks'
                              id='validationServer04'
                              placeholder='Add Remarks !'
                              required
                              value={this.state.remarks}
                              type='textarea'
                              onChange={this.onChangeHandler}
                            />
                            <div className='valid-feedback'>
                              Please provide a valid remarks.
                            </div>
                          </FormGroup>
                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Confirm Details
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <SimpleHeader name='Expenses' parentName='Expenses' />
        
        <Container className='mt--6' fluid>
          
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Expenses Inventory:</h3>
                  
                </CardHeader>
                <Row>
                
                  <Col md='4'>
                    {/* <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Date Picker Here',
                        }}
                        onChange={this.handleDate}
                        timeFormat={false}
                      />
                    </FormGroup> */}
                  </Col>
                  {/* <div className='col'>
                    <Button
                      color='primary'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div> */}

                  {this.props.User.user.role === 'admin' ? (
                    <Col md='12' style={{ marginBottom: 20 }}>
                      <div className='col'>
                        <Button
                          color='warning'
                          type='button'
                          onClick={() => this.newExpense()}
                        >
                          Add New Expense
                        </Button>
                        
                      </div>
                    </Col>
                  ) : (
                    ''
                  )}
                  
                </Row>
               
                {this.props.User.user.role === 'admin' ? (<Table
                  id='example'
                  className='display'
                  width='100%'
                  // style={{ marginLeft: 20 }}
                  // ref={(el) => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Expense Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Remarks</th>
                      {this.props.User.user.role === 'admin' ? (
                        <th>Actions</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </Table>)  : (<AuthHeader
                  title='Insufficient Rights to view Expenses Details.'
                  lead='Login with the admin account to view Expenses Module..'
                />)}
                
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
  addExpense,
  getExpenses,
  deleteExpense,
  editExpense,
  setUser,
  signOut
};
export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
