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
  InputGroupAddon,
  InputGroupText,
  CardBody,
  InputGroup,
  Modal,
  Container,
  Row,
  // Spinner,
  Col,
  FormGroup,
  // UncontrolledTooltip
} from 'reactstrap';
import Papa from 'papaparse';
import jwt_decode from 'jwt-decode';

// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';
import {
  editCustomer,
  deleteCustomer,
  addCustomer,
} from '../../actions/customer_actions';
import {setUser,signOut} from '../../actions/user_actions';

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import classnames from 'classnames';
import AuthHeader from 'components/Headers/AuthHeader.js';

// import Moment from 'react-moment';
// import ReactDatetime from 'react-datetime';
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


class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.updateData = this.updateData.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          onConfirm={() => this.deleteCustomer(id)}
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
    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
      this.setState({  loading: false });

    }
    else {
      axios({
        method: 'GET',
        url: `${config.serverUrl}customers/get`,
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
             lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
            bFilter: true,
            pageLength: 20,
            columnDefs: [
              {
                targets: 0,
                orderable: false,
              },
            ],
            pagingType: 'full_numbers',
            responsive: false,
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
  updateData(result) {
    var data = result.data;
    console.log(data);
  }
  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };
  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
  };
  exportCSV = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append('myFile', this.state.csvfile, this.state.csvfile.name);
    axios({
      method: 'POST',
      url: `${config.serverUrl}customers/addCustomers`,
      formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': localStorage.authToken,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response, 'ere');
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };
  newCustomer = () => {
    // const id = this.props.User.user.uid;
    this.setState({
      type: 'add',
      name: '',
      email: '',
      phone: null,
      status: 'item.status',
      profile: null,
    });
    this.toggleModal('formModal');
  };
  editCustomer = (item) => {
    this.setState({
      type: 'edit',
      id: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      status: item.status,
      profile: item.profile,
    });
    this.toggleModal('formModal');
  };
  deleteCustomer = (id) => {
    this.props.deleteCustomer(id).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table1.destroy();
        this.fetchMyData();
        this.successAlert();
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
    if (this.state.name && this.state.email == null) {
    }
    e.preventDefault();
    if (this.state.type === 'edit') {
      let { id } = this.state;
      this.setState({loading: true})
      var data = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        status: this.state.status,
        profile: this.state.profile,
      };
      this.props.editCustomer(data, id).then((res) => {
        if (res && res.success === 'OK') {
          this.setState({
            loading: false,
            name: '',
            id: '',
            type: '',
            email: null,
            formModal: false,

            phone: '',
            status: '',
            profile: '',
          });
          this.successAlert();
          this.state.table1.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            name: '',
            id: '',
            email: null,
            phone: '',
            formModal: false,

            type: '',
            status: '',
            profile: '',
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
      // let { id } = this.state;

      data = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        status: this.state.status,
        profile: this.state.profile,
      };

      this.props.addCustomer(data).then((res) => {
        this.setState({loading: true});
        // console.log(res, 'response error@');
        if (res && res.success === 'OK') {
          this.setState({
            name: '',
            loading: false,
            id: '',
            type: '',
            email: null,
            formModal: false,
            phone: '',
            status: '',
            profile: '',
          });
          this.successAlert();
          this.state.table1.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            loading: false,
            name: '',
            id: '',
            type: '',
            email: null,
            formModal: false,
            phone: '',
            status: '',
            profile: '',
          });
          this.failAlert();
        }
      });
    }
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
              // console.log('authcheck in hoc')
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
    // console.log('expiry check in comp')

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
    // await this.authCheck();
      this.fetchMyData();
  }
  render() {
    // console.log(this.props.User, 'date picked');
    // console.log(this.state.csvfile);

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td className="budget">{index + 1}</td>
          <td className="budget">{item.name}</td>
          <td className="budget">{item.email}</td>
          <td className="budget">{item.phone}</td>
          <td className="budget">{item.status}</td>
          <td className="avatar-group">
            {/* <div className='card-profile-image'>
              <a href='#pablo'>
                <img
                  alt='...'
                  className='rounded-circle'
                  src={
                    item.profile
                      ? item.profile
                      : '/static/media/team-4.23007132.jpg'
                  }
                />
              </a>
            </div> */}
            <span className='avatar avatar-lg rounded-circle'>
              <img
                alt='...'
                // className='rounded-circle'
                src={
                  item.profile
                    ? item.profile
                    : '/static/media/team-4.23007132.jpg'
                }
              />
            </span>
          </td>
          {this.props.User.user.role === 'admin' ? (
            <td className="avatar-group">
              <Button
                className='btn-icon-only rounded-circle'
                title='Edit'
                color='success'
                type='button'
                onClick={() => {
                  this.editCustomer(item);
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
                  <small>Edit Customer</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
                  <FormGroup>
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Select Category:
                    </label>
                    <Input
                      id='exampleFormControlSelect1'
                      name='status'
                      type='select'
                      value={this.state.status}
                      onChange={this.onChangeHandler}
                    >
                      <option>Choose from list</option>
                      <option>ACTIVE</option>
                      <option>DISABLED</option>
                      <option>PREMIUM</option>
                      <option>DORMANT</option>
                    </Input>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Name'
                        type='text'
                        name='name'
                        value={this.state.name}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='email'
                        type='text'
                        name='email'
                        value={this.state.email}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='phone'
                        type='text'
                        name='phone'
                        value={this.state.phone}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  {/* <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='status'
                        type='text'
                        name='status'
                        value={this.state.status}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup> */}
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='profile'
                        type='text'
                        name='profile'
                        value={this.state.profile}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
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

        <SimpleHeader name='Customers' parentName='Customers' />
        
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Customers Inventory:</h3>
                  
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
                          onClick={() => this.newCustomer()}
                        >
                          Add New Customer
                        </Button>
                        
                      </div>
                    </Col>
                  ) : (
                    ''
                  )}
                  {/* <div className='col'>
                    <input
                      className='csv-input'
                      type='file'
                      accept='.csv'
                      id='csvFile'
                      placeholder={null}
                      onChange={this.handleChange}
                    />
                    <Button
                      color='warning'
                      type='button'
                      style={{ marginTop: 10 }}
                      onClick={() => this.exportCSV()}
                    >
                      Upload Customers CSV
                    </Button>
                  </div> */}
                </Row>
               

               
               {this.props.User.user.role === 'admin' ? ( <Table
                className="align-items-center table-flush" 
                responsive
                  id='example'
                  // className='display'
                  // width='100%'
                  
                  // style={{ marginLeft: 20 }}
                  // ref={(el) => (this.el = el)}
                >
                  <thead className="thead-light">
                    <tr role='row'>
                      <th className="sort" data-sort="Entries" scope="col">Entries</th>
                      <th className="sort" data-sort="Name" scope="col">Name</th>
                      <th className="sort" data-sort="Email" scope="col">Email</th>
                      <th className="sort" data-sort="phone" scope="col">phone</th>
                      <th className="sort" data-sort="status" scope="col">status</th>
                      <th className="sort" data-sort="Profile" scope="col">Profile</th>
                      {this.props.User.user.role === 'admin' ? (
                        <th>Actions</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="list">
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </Table>) : (
                  <AuthHeader
                  title='Insufficient Rights to view Customers Details.'
                  lead='Login with the admin account to view customer Module..'
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
  editCustomer,
  setUser,
  deleteCustomer,
  addCustomer,
  signOut
};
export default connect(mapStateToProps, mapDispatchToProps)(Customers);
