/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

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
  Col,
  FormGroup,
  // UncontrolledTooltip
} from 'reactstrap';
import Papa from 'papaparse';

// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';
import {
  editProduct,
  deleteProduct,
  addProduct,
} from '../../actions/product_actions';
import { setUser,signOut } from '../../actions/user_actions';
import jwt_decode from 'jwt-decode';
// import AuthHeader from 'components/Headers/AuthHeader.js';

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import classnames from 'classnames';

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

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: null,
      activeNav: 1,
      breaksCount: '',
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
      productType: '',
      quantity: '',
      location: '',
      productNumber: '',
      SKU: '',
      show: false,
      type: '',
      HSN: '',
      BuyingPrice: null,
      SellingPrice: null,
      imageUrl: '',
      loading: true,
    };
    this.handleDate = this.handleDate.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.hiddenFileInput = createRef();
  }
  searchHandler = () => {
    this.state.table.destroy();
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
          onConfirm={() => this.deleteProduct(id)}
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
    // if (this.props.User.user.role !== 'admin') {
    //   data.uid = this.props.User.user.uid;
    //   this.setState({loading: false});
    // }
    // else if(this.props.User.user.role === 'admin'){
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
          // console.log(response.data.data, 'products')
          this.setState({ data: response.data.data, loading: false });
          const tbobj = $('#example').DataTable({
            //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
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
    // }
    
  }

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  updateData(result) {
    var data = result.data;
    console.log(data);
  }
  handleChange = async (event) => {
    await this.setState({
      csvfile: event.target.files[0],
      show: true,
    });
  };
  handleClick = (event) => {
    this.onFormSubmit();

    // this.hiddenFileInput.current.click();
  };
  onFormSubmit = () => {
    const formData = new FormData();
    formData.append('csv', this.state.csvfile);
    axios
      .post(`${config.serverUrl}products/uploadProducts`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
      .then(
        (result) => {
          return result;
        },
        (error) => {
          return error;
        }
      )
      .then((response) => {
        this.setState({
          csvfile: null,
          show: false,
        });
        this.successAlert();
        this.state.table.destroy();
        this.fetchMyData();
        // setTimeout(
        //   function () {
        //     this.setState({
        //       display: false,
        //       message: '',
        //       success: false,
        //     });
        //   }.bind(this),
        //   3000
        // );
      })
      .catch((error) => {
        this.failAlert();
        // this.setState({
        //   // display: true,
        //   message: 'Error uploading file.',
        // });
        // setTimeout(
        //   function () {
        //     this.setState({ display: false, message: '' });
        //   }.bind(this),
        //   3000
        // );
        console.log(error, 'error');
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
    // const { csvfile } = this.state;
    const formData = new FormData();

    // Update the formData object
    formData.append('csv', this.state.csvfile);
    axios({
      method: 'POST',
      url: `${config.serverUrl}products/uploadProducts`,
      formData,
      headers: {
        'Content-Type': 'application/json',
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
  newProduct = () => {
    this.setState({
      type: 'add',
      name: '',
      productType: 'WH',
      quantity: null,
      SKU: '',
      HSN: '',
      location: '',
      productNumber: '',
      BuyingPrice: null,
      SellingPrice: null,
      category: '',
      imageUrl: '',
      userId: this.props.User.user.uid,
    });
    this.toggleModal('formModal');
  };
  editProduct = (item) => {
    this.setState({
      type: 'edit',
      id: item._id,
      name: item.name,
      productType: item.productType,
      quantity: item.quantity,
      SKU: item.SKU,
      HSN: item.HSN,
      location: item.location,
      productNumber: item.productNumber,
      BuyingPrice: item.BuyingPrice,
      SellingPrice: item.SellingPrice,
      category: item.Category,
      imageUrl: item.imageUrl,
      userId: this.props.User.user.uid,
    });
    this.toggleModal('formModal');
  };
  deleteProduct = (id) => {
    let data = { id: id, userId: this.props.User.user.uid };
    this.props.deleteProduct(data).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table.destroy();
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
    if (this.state.name && this.state.quantity == null) {
    }
    e.preventDefault();
    this.setState({laoding: true});
    if (this.state.type === 'edit') {
      this.setState({loading: true});
      let { id } = this.state;

      var data = {
        name: this.state.name,
        productType: this.state.productType,
        quantity: this.state.quantity,
        SKU: this.state.SKU,
        HSN: this.state.HSN,
        location: this.state.location,
        productNumber: this.state.productNumber,
        BuyingPrice: this.state.BuyingPrice,
        SellingPrice: this.state.SellingPrice,
        Category: this.state.category,
        imageUrl: this.state.imageUrl,
        userId: this.state.userId,
      };
      this.props.editProduct(data, id).then((res) => {
        if (res.success === 'OK') {
          this.setState({
            name: '',
            id: '',
            type: '',
            prodcutType: '',
            quantity: null,
            location: '',
            productNumber: '',
            formModal: false,
            loading: false,
            SKU: '',
            HSN: '',
            BuyingPrice: null,
            SellingPrice: null,
            category: '',
            imageUrl: '',
          });
          this.successAlert();
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            name: '',
            id: '',
            quantity: null,
            location: '',
            productNumber: '',
            productType: '',
            SKU: '',
            formModal: false,
            loading: false,
            type: '',
            HSN: '',
            BuyingPrice: null,
            SellingPrice: null,
            category: '',
            imageUrl: '',
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
      // let { id } = this.state;
      this.setState({loading: true})
      data = {
        name: this.state.name,
        quantity: this.state.quantity,
        SKU: this.state.SKU,
        HSN: this.state.HSN,
        producType: this.state.productType,
        location: this.state.location,
        productNumber: this.state.productNumber,
        BuyingPrice: this.state.BuyingPrice,
        SellingPrice: this.state.SellingPrice,
        Category: this.state.category,
        imageUrl: this.state.imageUrl,
        userId: this.state.userId,
      };

      this.props.addProduct(data).then((res) => {
        if (res.success === 'OK') {
          this.setState({
            name: '',
            id: '',
            productType: '',
            loading: false,
            type: '',
            quantity: null,
            location: '',
            productNumber: '',
            formModal: false,
            SKU: '',
            HSN: '',
            BuyingPrice: null,
            SellingPrice: null,
            category: '',
            imageUrl: '',
          });
          this.successAlert();
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            name: '',
            id: '',
            productType: '',
            loading: false,
            type: '',
            quantity: null,
            location: '',
            productNumber: '',
            formModal: false,
            SKU: '',
            HSN: '',
            BuyingPrice: null,
            SellingPrice: null,
            category: '',
            imageUrl: '',
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

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.productType ? item.productType : 'WhisperingHomes'}</td>
          <td>{item.productNumber}</td>
          <td>{item.location}</td>
          <td>{item.SKU}</td>
          {/* <td>{item.HSN}</td> */}
          {this.props.User.user.role === 'admin' ? (
            <td>{item.BuyingPrice}</td>
          ) : null}
          <td>{item.SellingPrice}</td>
          {/* <td>{item.Category}</td> */}
          <td>
            <div className='card-profile-image' style={{marginTop: 15}}>
              <a href='#pablo'>
                <img
                  alt='...'
                  className='rounded-circle'
                  src={
                    item.imageUrl
                      ? item.imageUrl
                      : '/static/media/team-4.23007132.jpg'
                  }
                  width="50" height="60"
                />
              </a>
            </div>
            {/* <span className='avatar avatar-lg rounded-circle'>
              <img
                alt='...'
                className='rounded-circle'
                src='/static/media/team-4.23007132.jpg'
                // {
                //   item.imageUrl
                //     ? item.imageUrl
                //     : '/static/media/team-4.23007132.jpg'
                // }
              />
            </span> */}
          </td>
          <td>{item.quantity < 20 ? 'Low Stock' : 'N/A'}</td>
          {this.props.User.user.role === 'admin' ? (
            <td>
              <Button
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
                  <small>Edit Product</small>
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
                      name='category'
                      type='select'
                      value={this.state.category}
                      onChange={this.onChangeHandler}
                    >
                      <option>Choose from list</option>
                      <option>VASES</option>
                      <option>LAMPS</option>
                      <option>CANDLE HOLDERS</option>
                      <option>FACE FIGURINES</option>
                      <option>JARS</option>
                      <option>DECORATIVE OBJECTS</option>
                      <option>DESK DECOR</option>
                      <option>HANGING WALL VASES</option>
                      <option>FACE FIGURINES</option>
                      <option>CANDLE HOLDERS </option>
                      <option>DRIED FLOWERS</option>
                      <option>PAMPAS</option>
                      <option>FLOWERS</option>
                      <option>BOUQUETS</option>
                      <option>BOUTONNIERS</option>
                      <option>WALL ART</option>
                      <option>CUSHIONS</option>
                      <option>COMBOS</option>
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
                        required
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
                        placeholder='Product Type'
                        type='text'
                        name='productType'
                        value={this.state.productType}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='quantity'
                        type='text'
                        name='quantity'
                        value={this.state.quantity}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='Product Number'
                        type='text'
                        name='productNumber'
                        value={this.state.productNumber}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='location'
                        type='text'
                        name='location'
                        value={this.state.location}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='SKU'
                        type='text'
                        name='SKU'
                        value={this.state.SKU}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='HSN'
                        type='text'
                        name='HSN'
                        value={this.state.HSN}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='imageUrl'
                        type='text'
                        name='imageUrl'
                        value={this.state.imageUrl}
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
                        placeholder='BuyingPrice'
                        type='text'
                        name='BuyingPrice'
                        value={this.state.BuyingPrice}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
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
                        placeholder='SellingPrice'
                        type='text'
                        name='SellingPrice'
                        value={this.state.SellingPrice}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  {this.state.loading === true ?  (
            <Row>
              <Col md='12' className='text-center'>
            <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) :(<div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Confirm Details
                    </Button>
                  </div>)}
                  
                </Form>
              </CardBody>
            </Card>
          </div>

        </Modal>

        <SimpleHeader name='Products' parentName='Products' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Products Inventory:</h3>
                </CardHeader>
                {this.props.User.user.role === 'admin' ? (
                  <Row style={{ marginLeft: 10 }}>
                    {/* <Col md='4' hidden>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Date Picker Here',
                        }}
                        onChange={this.handleDate}
                        timeFormat={false}
                      />
                    </FormGroup>
                  </Col> */}
                    {/* <div className='col' hidden>
                    <Button
                      color='primary'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div> */}
                    <Col md='6' style={{ marginBottom: 20 }}>
                      <div className='col'>
                        <Button
                          color='warning'
                          type='button'
                          onClick={() => this.newProduct()}
                        >
                          Add New Product
                        </Button>
                        
                      </div>
                    </Col>
                    <Col md='6'>
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
                        {this.state.show ? (
                          <Button
                            color='warning'
                            type='button'
                            style={{ marginTop: 10 }}
                            onClick={() => this.handleClick()}
                          >
                            Upload Product CSV
                          </Button>
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  ''
                )}

                {/* {this.props.User.user.role === 'admin' ? ( */}
                <Table
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
                      <th>Product Type</th>
                      <th>Product No</th>
                      <th>Location</th>
                      <th>SKU</th>
                      {/* <th>HSN</th> */}
                      {this.props.User.user.role === 'admin' ? (
                        <th>BuyingPrice</th>
                      ) : null}
                      <th>SellingPrice</th>
                      {/* <th>Category</th> */}
                      <th>Image</th>
                      <th>ReOrder Status</th>
                      {this.props.User.user.role === 'admin' ? (
                        <th>Actions</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </Table>
                {/* ) : (
                   <AuthHeader
                   title='Insufficient Rights to view Products Listing.'
                   lead='Login with the admin account to view Products Module..'
                 />
                )} */}
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
export default connect(mapStateToProps, mapDispatchToProps)(Products);
