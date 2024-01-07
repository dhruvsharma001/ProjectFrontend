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
import { Link } from 'react-router-dom';

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
  ListGroup,
  ListGroupItem,
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

// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { connect } from 'react-redux';
import {
  editOrder,
  deleteOrder,
  addOrder,
  editStatus,
  sendMail
} from '../../actions/order_actions';
import { signOut } from '../../actions/user_actions';

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import classnames from 'classnames';

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

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: null,
      itemInUse: null,
      // show: [{key: false},{key: false},{key: false},{key: false},{key: false},{key: false},{key: false},{key: false}],
      activeNav: 1,
      receiptImage: null,
      show: [false, false, false],
      toggle: false,
      formModal: false,
      deliveryFormModal: false,
      mailFormModal: false,
      formModalAdd: false,
      notifyAlert: null,
      date: '',
      data: [],
      id: '',
      table: {},
      type: '',
      oldstatus: '',
      status: '',
      orderReport: [],
      commments: '',
      url: 'http://35.154.14.95:3000/uploads/images/',
      waybillArray: [],
      oldWaybillArray: [],
      shippingCost: '',
      orderedProducts: 0,
      magentoOrderId: '',
      orderId: '',
      orderDate: '',
      oldOrderDate: '',
      loading: true,
      startDate: moment().format('MM/DD/YYYY'),
      endDate: moment().format('MM/DD/YYYY'),
      address: [
        {
          address_type: 'shipping',
          city: '',
          company: '',
          country_id: 'IN',
          firstname: '',
          lastname: '',
          middlename: '',
          postcode: '',
          region: '',
          street: '',
          telephone: '',
        },
      ],
      OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '', soldBy: '', image_url: '' }],
    };
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.fetchMyData = this.fetchMyData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.hiddenFileInput = createRef();

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

  searchHandler = () => {
    this.state.table.destroy();
    this.setState({ data: [] })

    this.fetchMyData();
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  changeDate = (event) => {
    // console.log(event.toDate()) // Tue Nov 24 2020 00:00:00 GMT+0400 (Gulf Standard Time)
    // console.log(event.format("DD-MM-YYYY")) //24-11-2020
    this.setState({ ...this.state, orderDate: event.format("YYYY-MM-DD") })
  }
  onChangeHandler = (e) => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  };
  onAddressChangeHandler = (e) => {
    let address = this.state.address;
    address[0][e.target.name] = e.target.value;
    this.setState({ address });
  };
  handleChange(i, e) {
    let OrderDetails = this.state.OrderDetails;
    OrderDetails[i][e.target.name] = e.target.value;
    this.setState({ OrderDetails });
  }
  addFormFields() {
    this.setState({
      OrderDetails: [
        ...this.state.OrderDetails,
        { name: '', price: '', qty_ordered: '', sku: '', soldBy: '', image_url: '' },
      ],
    });
  }
  handleWaybillChange(i, e) {
    let waybillArray = this.state.waybillArray;
    waybillArray[i][e.target.name] = e.target.value;
    this.setState({ waybillArray });
  }
  addWaybillField() {
    this.setState({
      waybillArray: [
        ...this.state.waybillArray,
        { waybill: '', status: 'Pending' },
      ],
    });


  }
  removeWaybillField(i) {
    let waybillArray = this.state.waybillArray;
    waybillArray.splice(i, 1);
    this.setState({ waybillArray });
  }


  removeFormFields(i) {
    let OrderDetails = this.state.OrderDetails;
    OrderDetails.splice(i, 1);
    this.setState({ OrderDetails });
  }

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
          onConfirm={() => this.deleteOrder(id)}
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

  async fetchMyData() {

    const data = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
    }
    // console.log(this.props.User.user.role, 'logger id')

    await axios({
      method: 'POST',
      url: `${config.serverUrl}order/get`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken,
      },
      data: data,
    }).then((response) => {
      console.log(response, "orders")
      this.setState({ data: response.data.data, loading: false });
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

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }

  // handleChange = async (event) => {
  //   await this.setState({
  //     csvfile: event.target.files[0],
  //   });
  // };
  handleClick = (event) => {
    this.onFormSubmit();

    // this.hiddenFileInput.current.click();
  };

  newOrder = () => {
    // const id = this.props.User.user.uid;
    this.setState({
      type: 'add',
      magentoOrderId: '',
      couponCode: '',
      customerEmail: "",
      formModal: false,
      orderTotalInclTax: '',
      discountAmount: '',
      status: "",
      OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '', soldBy: '', image_url: '' }],
      address: [
        {
          address_type: 'shipping',
          city: '',
          company: '',
          country_id: 'IN',
          firstname: '',
          lastname: '',
          middlename: '',
          postcode: '',
          region: '',
          street: '',
          telephone: '',
        },
      ],
      orderedProducts: 0,
      orderDate: ''
    });
    this.toggleModal('formModalAdd');
  };
  editStatus = (item, index) => {
    this.setState({
      type: 'edit',
      itemInUse: index,
      orderId: item._id,
      magentoOrderId: item.magentoOrderId,
      status: item.status,
      comments: item.comments || 'No Comments!',
      waybillArray: item.waybillArray || [],
      oldWaybillArray: item.waybillArray || [],
      orderReport: item.mailReport || [],
      oldComments: item.comments || 'No Comments',
      oldStatus: item.status,
      oldOrderDate: moment(item.orderDate).format('YYYY-MM-DD') || '',
      orderDate: moment(item.orderDate).format('YYYY-MM-DD') || '',
    });
    this.toggleModal('formModal');

  };
  mailSend = (item) => {
    this.setState({
      type: 'mail',
      orderId: item._id,
      magentoOrderId: item.magentoOrderId,
      orderDate: item.orderDate,
      status: item.status,
      waybillArray: item.waybillArray || [],
      orderReport: item.mailReport || [],
    });
    this.toggleModal('mailFormModal');
  }



  deleteOrder = (id) => {
    this.props.deleteOrder(id).then((res) => {
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
  handleImageChange = (event) => {
    // console.log(event.target.files[0])
    this.setState({ ...this.state, receiptImage: event.target.files[0] })

  }
  addDeliveryDetails(item) {
    this.setState({
      orderId: item._id,
      magentoOrderId: item.magentoOrderId,
      shippingCost: item.shippingCost || 0,
      receiptImage: item.receiptImage
    });
    this.toggleModal('deliveryFormModal');
  }
  onDeliverySubmitHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let id = this.props.User.user.uid;
    const formData = new FormData();
    formData.append("receiptImage", this.state.receiptImage, this.state.receiptImage.name)
    formData.append("usesrId", id)
    formData.append("orderId", this.state.orderId)
    formData.append("magentoOrderId", this.state.magentoOrderId)
    formData.append("shippingCost", this.state.shippingCost)
    try {
      axios({
        method: 'POST',
        url: `${config.serverUrl}order/deliveryImageUpdate`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: formData,
      }).then((res) => {
        // console.log(res.data, 'response')
        if (res.data.success === 'OK') {
          this.setState({
            magentoOrderId: '',
            loading: false,
            orderId: '',
            shippingCost: '',
          });
          this.successAlert();
          this.toggleModal('deliveryFormModal');
          this.state.table.destroy();
          this.fetchMyData();
        }
      })
    }
    catch (e) {
      console.log(e.error, 'error occured !!');

    }


  }
  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.type === 'edit') {
      let id = this.props.User.user.uid;
      this.setState({ loading: true });
      var data = {
        orderId: this.state.orderId,
        comments: this.state.comments,
        // waybill: this.state.waybill,
        waybillArray: this.state.waybillArray,
        magentoOrderId: this.state.magentoOrderId,

        // shippingCost: this.state.shippingCost,
        status: this.state.status,
        oldStatus: this.state.oldStatus,
        oldComments: this.state.oldComments,
        oldWaybillArray: this.state.oldWaybillArray,
        // oldShippingCost: this.state.oldShippingCost,
        orderDate: this.state.orderDate,
        oldOrderDate: this.state.oldOrderDate
      };

      // console.log(this.state.oldWaybillArray,this.state.waybillArray, id, 'order status update');
      this.props.editStatus(data, id).then((res) => {
        if (res.success === 'OK') {
          let newDataTable = [...this.state.data];
          newDataTable[this.state.itemInUse] = { ...newDataTable[this.state.itemInUse], status: this.state.status, comments: this.state.comments, waybillArray: this.state.waybillArray, orderDate: this.state.orderDate };
          this.setState({ data: newDataTable });
          this.setState({
            status: '',
            loading: false,
            oldStatus: '',
            orderId: '',
            itemInUse: null,
            magentoOrderId: '',
            formModal: false,
            type: '',
            orderReport: [],
            orderDate: '',
            oldComments: '',
            comments: '',
            waybill: [],
            oldWaybillArray: []
          });
          this.successAlert();
          // this.state.table.destroy();
          // this.fetchMyData();
        } else {
          this.setState({
            status: '',
            oldStatus: '',
            orderId: '',
            loading: false,
            formModal: false,
            type: '',
            orderDate: '',
            orderReport: [],
            oldComments: '',
            comments: '',
            waybill: [],
            oldWaybill: []
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
      this.setState({ loading: true });
      data = {
        magentoOrderId: this.state.magentoOrderId,
        couponCode: this.state.couponCode,
        customerEmail: this.state.customerEmail,
        orderTotalInclTax: this.state.orderTotalInclTax,
        payment_status: 'pending',
        discountAmount: this.state.discountAmount,
        status: this.state.status,
        orderGrandTotal: this.state.orderGrandTotal,
        orderDetails: this.state.OrderDetails,
        address: this.state.address,
        orderedProducts: this.state.OrderDetails.length,
        guest: '0',
        bad: 1,
        email: this.state.customerEmail,
        orderDate: this.state.orderDate
      };

      this.props.addOrder(data).then((res) => {
        if (res.success === 'OK') {
          this.setState({
            magentoOrderId: '',
            couponCode: '',
            loading: false,
            type: '',
            customerEmail: null,
            formModal: false,
            orderTotalInclTax: '',
            discountAmount: '',
            status: null,
            orderDate: '',
            OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '', soldBy: '', image_url: '' }],
            address: [
              {
                address_type: 'shipping',
                city: '',
                company: '',
                country_id: 'IN',
                firstname: '',
                lastname: '',
                middlename: '',
                postcode: '',
                region: '',
                street: '',
                telephone: '',
              },
            ],
            orderedProducts: 0,
          });
          this.successAlert();
          this.toggleModal('formModalAdd');
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            magentoOrderId: '',
            couponCode: '',
            loading: false,
            type: '',
            orderDate: '',
            customerEmail: null,
            formModal: false,
            orderTotalInclTax: '',
            discountAmount: '',
            status: null,
            OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '', soldBy: '', image_url: '' }],
            address: [
              {
                address_type: 'shipping',
                city: '',
                company: '',
                country_id: 'IN',
                firstname: '',
                lastname: '',
                middlename: '',
                postcode: '',
                region: '',
                street: '',
                telephone: '',
              },
            ],
            orderedProducts: 0,
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'mail') {
      let id = this.props.User.user.uid;
      this.setState({ loading: true });
      var mailData = {
        orderId: this.state.orderId,
        status: this.state.status
      };
      // console.log(data, id, 'order status update');
      this.props.sendMail(mailData, id).then((res) => {
        if (res.success === 'OK') {
          this.setState({
            status: '',
            loading: false,
            orderId: '',
            magentoOrderId: '',
            mailFormModal: false,
            type: '',
            orderReport: [],
            orderDate: '',
            waybill: ''
          });
          this.successAlert();
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            status: '',
            loading: false,
            orderId: '',
            magentoOrderId: '',
            mailFormModal: false,
            type: '',
            orderReport: [],
            orderDate: '',
            waybill: ''
          });
          this.failAlert();
        }
      });
    }
  };


  editShow = (index) => {
    let show = [...this.state.show];
    show[index] = !this.state.show[index];
    this.setState({ show });
    // this.setState({
    //   show: !this.state.show,
    // });
  };
  async componentDidMount() {

    await this.fetchMyData();
  }
  render() {
    // console.log(this.state.waybillArray, 'waybill Array ');
    // console.log(this.state.receiptImage.name, 'images picked');
    // console.log(this.state.waybillArray, this.state.oldWaybillArray, 'new and old')

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {<div className='text-center mb-4'>{item.magentoOrderId}</div>}
          </td>
          <td>
            {<div className='text-center mb-4'>{moment(item.orderDate).format('YYYY-MM-DD')}</div>}
          </td>
          {/* <td>
            {<div className='text-center mb-4'>{item.orderedProducts}</div>}
          </td> */}
          {/* <td>{<div className='text-center mb-4'>{item.couponCode}</div>}</td> */}
          {/* <td>
            {
              <div className='text-center mb-4'>
                {item.magentoCustomerId ? item.magentoCustomerId : 'Guest'}
              </div>
            }
          </td> */}
          {/* <td>
            {
              <div className='text-center mb-4'>
                {item.shippingDiscountAmount}
              </div>
            }
          </td> */}
          {/* <td>
            {<div className='text-center mb-4'>{item.shippingAmount}</div>}
          </td> */}
          {/* <td>
            {<div className='text-center mb-4'>{item.orderTotalInclTax}</div>}
          </td> */}
          <td>
            {<div className='text-center mb-4'>{item.orderGrandTotal}</div>}
          </td>
          <td>
            {(item.address && this.state.show[index]) ? (
              <ListGroup>

                <ListGroupItem color='success'>
                  {item.address[0].firstname}{" "}{item.address[0].lastname}<br />
                  {item.customerEmail}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Street: '}
                  {item.address[0].street}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'City: '}
                  {item.address[0].city}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Region: '}
                  {item.address[0].region}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'PIN: '}
                  {item.address[0].postcode}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Phone: '}
                  {item.address[0].telephone}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  <Link
                    to={{
                      pathname: 'https://api.whatsapp.com/send?phone=' + item.address[0].telephone + '&text=Dear%20' + item.address[0].firstname + '%20' + item.address[0].lastname + '.%20Please%20be%20informed%20that%20your%20order%20has%20been%20shipped.%20For%20tracking%20the%20order,%20please%20click%20the%20below%20link:%20https://www.delhivery.com/track/package/20566510016542%20Please%20feel%20free%20to%20contact%20us,%20in%20case%20of%20any%20queries.%20Regards%20Whispering%20Homes'
                    }} target="_blank"
                  >
                    {/* <Badge color='danger'> */}
                    <Button
                      className='btn-inner--text'
                      title='Get Delivery Status'
                      color='success'
                      type='button'
                    > whatsapp
                      <i className='ni ni-delivery-fast' title='Get Delivery Status' />
                    </Button>
                    {/* <i className='fa fa-edit' title='Edit'></i> */}
                    {/* </Badge> */}
                  </Link>
                  {/* {item.address[0].country_id} */}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.address[0].address_type}
                </ListGroupItem>
                {/* <ListGroupItem color='success'>
                  {'ID: '}
                  {item.address.customer_address_id}
                </ListGroupItem> */}
              </ListGroup>
            ) : (
              <ListGroup>
                <ListGroupItem color='success'>
                  {item.address[0].firstname}{" "}{item.address[0].lastname}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.customerEmail}
                </ListGroupItem>
                <ListGroupItem>
                  <Link
                    to={{
                      pathname: 'https://api.whatsapp.com/send?phone=' + item.address[0].telephone + '&text=Dear%20' + item.address[0].firstname + '%20' + item.address[0].lastname + '.%20Please%20be%20informed%20that%20your%20order%20has%20been%20shipped.%20For%20tracking%20the%20order,%20please%20click%20the%20below%20link:%20https://www.delhivery.com/track/package/XXXXXXXXXX%20Please%20feel%20free%20to%20contact%20us,%20in%20case%20of%20any%20queries.%20Regards%20Whispering%20Homes'
                    }} target="_blank"
                  >
                    {/* <Badge color='danger'> */}
                    <Button
                      className='btn-inner--text'
                      title='Get Delivery Status'
                      color='success'
                      type='button'
                    > whatsapp
                      <i className='ni ni-delivery-fast' title='WhatsApp msg link to the customer.' />
                    </Button>
                    {/* <i className='fa fa-edit' title='Edit'></i> */}
                    {/* </Badge> */}
                  </Link>
                </ListGroupItem>
              </ListGroup>
            )}
          </td>
          {/* <td>{item.orderCurrencyCode}</td> */}
          {/* <td>{item.customerEmail}</td> */}
          <td>
            <div className="d-flex align-items-center">
              <label className='custom-toggle custom-toggle-info mr-6 ' >
                <input
                  type='checkbox'
                  id='cb-1'
                  checked={this.state.show[index]}
                  onChange={() => {
                    this.editShow(index);
                  }}
                />
                <span
                  className='custom-toggle-slider rounded-circle'
                  data-label-off='show'
                  data-label-on='hide'
                />
              </label>

            </div>
            {/* <Button
                className='btn-icon-only rounded-circle'
                title='Show'
                color='info'
                type='button'
                onClick={() => {
                  this.editShow(index);
                }}
              >
                <span className='btn-inner--icon'>
                  <i className='ni ni-planet' />
                </span>
              </Button> */}
          </td>
          <td>
            {(item.orderDetails.length > 0 && this.state.show[index]) ?
              // item.orderDetails.length

              item.orderDetails.map((item, index) => {
                return (
                  <div className='text-left mb-4' key={index}>
                    <ListGroup>
                      <ListGroupItem color='success'>
                        {item.name}
                        {' X '}
                        {~~item.qty_ordered}
                      </ListGroupItem>

                      <ListGroupItem color='success'>
                        <span className='avatar avatar-sm rounded-circle'>
                          <img
                            alt='...'
                            src={item.image_url}
                          />
                        </span>
                      </ListGroupItem>
                      <ListGroupItem color='warning'>
                        {'Sold By: '}
                        {item.soldBy}
                      </ListGroupItem>
                    </ListGroup>

                    <br></br>
                  </div>

                );

              })
              :
              item.orderDetails.length
            }
          </td>
          <td>{item.status}</td>
          {/* <td>{item.remote_ip}</td> */}
          {/* <td>{item.magentoShippingAddressId}</td> */}

          {/* <td>
            <div className='card-profile-image'>
              <a href='#pablo'>
                <img
                  alt='...'
                  className='rounded-circle'
                  src={
                    item.imageUrl
                      ? item.imageUrl
                      : '/static/media/team-4.23007132.jpg'
                  }
                />
              </a>
            </div>
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
          {/* {this.props.User.user.role === 'admin' ? ( */}
          <td>
            {/* <Button
                className='btn-icon-only rounded-circle'
                title='Add Delivery Details'
                color='info'
                type='button'
                onClick={() => {
                  this.addDeliveryDetails(item);
                }}
              >
                <span className='btn-inner--icon'>
                  <i className='ni ni-bus-front-12' title='Add Delivery Details' />
                </span>
              </Button> */}


            <Button className="btn-icon" color="info" title='Delivery Details'
              type="button" onClick={() => {
                this.addDeliveryDetails(item);
              }}>
              <span className="btn-inner--icon mr-1">
                <i className="ni ni-bus-front-12" />
              </span>
              <span className="btn-inner--text">Delivery Details</span>
            </Button>
            {/* <Button
                className='btn-icon-only rounded-circle'
                title='Edit Order'
                color='success'
                type='button'
                onClick={() => {
                  this.editStatus(item);
                }}
              >
                <span className='btn-inner--icon'>
                  <i className='ni ni-active-40' title='Edit Order Details' />
                </span>
              </Button> */}



            <Button className="btn-icon" color="success" title='Edit Order'
              type="button" onClick={() => {
                this.editStatus(item, index);
              }}>
              <span className="btn-inner--icon mr-1">
                <i className="ni ni-active-40" />
              </span>
              <span className="btn-inner--text">Edit Order</span>
            </Button>



            <Button className="btn-icon" color="primary" title='Send Order Mail'

              type="button" onClick={() => {
                this.mailSend(item);
              }}>
              <span className="btn-inner--icon mr-1">
                <i className="ni ni-email-83" />
              </span>
              <span className="btn-inner--text">Mail Status</span>
            </Button>
            {/* <Button
                className='btn-icon-only rounded-circle'
                title='Send Order Mail'
                color='primary'
                type='button'
                onClick={() => {
                  this.mailSend(item);
                }}
              >
                <span className='btn-inner--icon'>
                  <i className='ni ni-email-83' title='Send Order Mail' />
                </span>
              </Button> */}

            {
              <Link
                to={{
                  pathname: 'orderDeliveryStatus/waybill/' + item.waybill,
                  state: { waybill: item.waybill },
                }}
              >
                {/* <Badge color='danger'> */}
                <Button
                  className='btn-icon-only rounded-circle'
                  title='Get Delivery Status'
                  color='info'
                  type='button'
                >
                  <i className='ni ni-delivery-fast' title='Get Delivery Status' />
                </Button>
                {/* <i className='fa fa-edit' title='Edit'></i> */}
                {/* </Badge> */}
              </Link>
            }

            <Button
              className='btn-icon-only rounded-circle'
              title='Delete'
              color='warning'
              type='button'
              onClick={() => {
                this.warningAlert(item._id);
              }}
              style={{ marginLeft: "2px" }}
            >
              <span className='btn-inner--icon'>
                <i className='ni ni-basket' />
              </span>
            </Button>
          </td>
          {/* ) : null} */}
        </tr>
      );
    };

    return (
      <>
        {this.state.notifyAlert}
        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.deliveryFormModal}
          toggle={() => this.toggleModal('deliveryFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Add Delivery Details</small>
                </div>
                <Form role='form' onSubmit={this.onDeliverySubmitHandler}>
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
                        placeholder='magentoOrderId'
                        type='text'
                        name='magentoOrderId'
                        value={this.state.magentoOrderId}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        readOnly
                      />
                    </InputGroup>
                  </FormGroup>

                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Shipping Cost:
                    </label>
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Shipping Cost'
                        type='text'
                        name='shippingCost'
                        value={this.state.shippingCost}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        required
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>

                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Upload Delivery Reciept:
                    </label>
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Delivery Receipt Image'
                        type='file'
                        name='receiptImage'
                        accept="image/png, image/gif, image/jpeg"
                        onChange={this.handleImageChange}

                        // value={this.state.receiptImage}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        required
                      />
                    </InputGroup>
                    <br />
                  </FormGroup>
                  {this.state.receiptImage ? (<FormGroup

                    className={classnames('mb-4', {
                      focused: this.state.focusedEmail,
                    })}
                  ><label
                    className='form-control-label'
                    htmlFor='exampleFormControlSelect1'
                    style={{ color: '#85929E', fontWeight: 'normal' }}
                  >
                    </label>
                    <div className='card-profile-image' >
                      <a href='#pablo'>
                        <img
                          alt='...'
                          className='rounded-circle'
                          src={
                            this.state.receiptImage
                              ? `${this.state.url}${this.state.receiptImage}`
                              : '/static/media/team-4.23007132.jpg'
                          }
                        />
                        <br />
                      </a>
                    </div></FormGroup>) : ''}

                  {this.state.loading === true ? (
                    <Row>
                      <Col md='12' className='text-center'>
                        <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : (<div className='text-center'>
                          <Button className='my-4' color='primary' type='submit'>
                            Confirm Details
                          </Button>
                        </div>)}
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

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
                  <small>Edit Order</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
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
                        placeholder='magentoOrderId'
                        type='text'
                        name='magentoOrderId'
                        value={this.state.magentoOrderId}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        readOnly
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Select Status:
                    </label>
                    <Input
                      id='exampleFormControlSelect1'
                      name='status'
                      type='select'
                      value={this.state.status}
                      onChange={this.onChangeHandler}
                    >
                      <option>Choose from list</option>
                      <option>Cancelled</option>
                      <option>Pending</option>
                      <option>Manifested</option>
                      <option>In Transit</option>
                      <option>Dispatched</option>
                      <option>Delivered</option>
                    </Input>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Comments:
                    </label>
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='comments'
                        type='text'
                        name='comments'
                        value={this.state.comments}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        required
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <Row form>
                    <Col md={3}>
                      <div className='text-center text-muted mb-4'>
                        <small>Add Waybill</small>
                      </div>
                    </Col>
                    <Col md={1}>
                      <Button
                        className='btn-icon-only rounded-circle'
                        title='Status'
                        color='success'
                        type='button'
                        style={{ marginBottom: 5 }}
                        onClick={() => this.addWaybillField()}
                      >
                        <span className='btn-inner--icon'>
                          <i className='ni ni-fat-add' />
                        </span>
                      </Button>
                    </Col>
                  </Row>
                  {this.state.waybillArray.map((element, index) => (<>
                    <FormGroup
                      className={classnames('mb-3', {
                        focused: this.state.focusedEmail,
                      })} key={index}
                    >
                      <label
                        className='form-control-label'
                        htmlFor='exampleFormControlSelect1'
                        style={{ color: '#85929E', fontWeight: 'normal' }}
                      >
                        Shipping Waybill {index + 1}:
                      </label>
                      <InputGroup className='input-group-merge input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-single-02' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='waybill'
                          type='text'
                          name='waybill'
                          value={element.waybill}
                          onFocus={() => this.setState({ focusedEmail: true })}
                          onBlur={() => this.setState({ focusedEmail: false })}
                          required
                          onChange={(e) => this.handleWaybillChange(index, e)}
                        />
                      </InputGroup>
                      {/* <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='status'
                        type='text'
                        name='status'
                        value={element.status}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        required
                        onChange={(e) => this.handleWaybillChange(index, e)}
                      />
                    </InputGroup> */}
                    </FormGroup>
                    <FormGroup>
                      <label
                        className='form-control-label'
                        htmlFor='exampleFormControlSelect1'
                        style={{ color: '#85929E', fontWeight: 'normal' }}
                      >
                        Select Waybill {index + 1} Status:
                      </label>
                      <Input
                        id='exampleFormControlSelect1'
                        name='status'
                        type='select'
                        value={element.status}
                        onChange={(e) => this.handleWaybillChange(index, e)}
                      >
                        <option>Choose from list</option>
                        <option>Pending</option>
                        <option>Manifested</option>
                        <option>In Transit</option>
                        <option>Dispatched</option>
                        <option>Delivered</option>
                      </Input>
                    </FormGroup>

                    <Col md={4}>
                      {/* {index ? ( */}
                      <Button
                        className='btn-icon-only rounded-circle'
                        title='Status'
                        color='warning'
                        type='button'
                        style={{ marginBottom: 5 }}
                        onClick={() => this.removeWaybillField(index)}
                      >
                        <span className='btn-inner--icon'>
                          <i className='ni ni-fat-delete' />
                        </span>
                      </Button>
                      {/* ) : null} */}
                    </Col>
                  </>
                  ))}
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="exampleDatepicker"
                    >
                      Order Date
                    </label>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "Date Picker Here"
                      }}
                      timeFormat={false}
                      name='orderDate'
                      value={this.state.orderDate}
                      onChange={this.changeDate}
                    />
                  </FormGroup>


                  {/* <CardBody> */}

                  {/* <div className="timeline-block">
                      <span className="timeline-step badge-danger">
                        <i className="ni ni-html5" />
                      </span>
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between pt-1">
                          <div>
                            <span className="text-muted text-sm font-weight-bold">
                              In-Transit
                            </span>
                          </div>
                          <div className="text-right">
                            <small className="text-muted">
                              <i className="fas fa-clock mr-1" />3 hrs ago
                            </small>
                          </div>
                        </div>
                        <h6 className="text-sm mt-1 mb-0">
                          Mail Sent.
                        </h6>
                      </div>
                    </div>
                    <div className="timeline-block">
                      <span className="timeline-step badge-info">
                        <i className="ni ni-like-2" />
                      </span>
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between pt-1">
                          <div>
                            <span className="text-muted text-sm font-weight-bold">
                              Out-For-Delivery
                            </span>
                          </div>
                          <div className="text-right">
                            <small className="text-muted">
                              <i className="fas fa-clock mr-1" />5 hrs ago
                            </small>
                          </div>
                        </div>
                        <h6 className="text-sm mt-1 mb-0">
                        Mail Sent.
                        
                        </h6>
                      </div>
                    </div> */}

                  {/* </CardBody> */}

                  {this.state.loading === true ? (
                    <Row>
                      <Col md='12' className='text-center'>
                        <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : (<div className='text-center'>
                          <Button className='my-4' color='primary' type='submit'>
                            Confirm Details
                          </Button>
                        </div>)}
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.mailFormModal}
          toggle={() => this.toggleModal('mailFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Send Mail</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
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
                        placeholder='magentoOrderId'
                        type='text'
                        name='magentoOrderId'
                        value={this.state.magentoOrderId}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        readOnly
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Order Status:
                    </label>
                    <Input
                      id='exampleFormControlSelect1'
                      name='status'
                      type='select'
                      value={this.state.status}
                      readOnly
                    >
                      <option>Choose from list</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                      <option>Manifest-Generated</option>
                      <option>In-Transit</option>
                      <option>Out-For-Delivery</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </Input>
                  </FormGroup>

                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Shipping Waybill:
                    </label>
                    {this.state.waybillArray.map((item, key) => (<InputGroup className='input-group-merge input-group-alternative' key={key}>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-delivery-fast' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='waybill'
                        type='text'
                        name='waybill'
                        value={item.waybill}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        readOnly
                      />
                    </InputGroup>))}
                  </FormGroup>

                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="exampleDatepicker"
                    >
                      Order Date
                    </label>

                    <Input
                      placeholder='Order Date'
                      type='text'
                      name='order-date'
                      value={moment(this.state.orderDate).format("dddd, MMMM Do YYYY")}
                      onFocus={() => this.setState({ focusedEmail: true })}
                      onBlur={() => this.setState({ focusedEmail: false })}
                      readOnly
                    />
                  </FormGroup>


                  {/* <CardBody> */}
                  {this.state.orderReport.length > 0 ? this.state.orderReport.map((item, i) =>
                    <div
                      className="timeline timeline-one-side"
                      data-timeline-axis-style="dashed"
                      data-timeline-content="axis" key={i}
                    >
                      <div className="timeline-block">
                        <span className="timeline-step badge-success">
                          <i className="ni ni-bell-55" />
                        </span>
                        <div className="timeline-content">
                          <div className="d-flex justify-content-between pt-1">
                            <div>
                              <span className="text-muted text-sm font-weight-bold">
                                {item.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <small className="text-muted">
                                <i className="fas fa-clock mr-1" />{moment(item.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                              </small>
                            </div>
                          </div>
                          <h6 className="text-sm mt-1 mb-0">
                            {item.value ? "Mail Sent." : "No mails sent yet."}
                          </h6>
                        </div>
                      </div>
                    </div>

                  )

                    // (
                    //)
                    : ''}


                  {this.state.loading === true ? (
                    <Row>
                      <Col md='12' className='text-center'>
                        <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : (<div className='text-center'>
                          {/* <Button className='my-4' color='primary' type='submit'>
                      Send Mail
                    </Button> */}
                        </div>)}
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>


        <Modal
          className='modal-dialog-centered'
          size='lg'
          isOpen={this.state.formModalAdd}
          toggle={() => this.toggleModal('formModalAdd')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <large>Add Order</large>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
                  <Row form>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                        style={{ marginTop: 30 }}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-istanbul' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='magentoOrderId'
                            type='text'
                            name='magentoOrderId'
                            value={this.state.magentoOrderId}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <label
                          className='form-control-label'
                          htmlFor='exampleFormControlSelect1'
                          style={{ color: '#85929E', fontWeight: 'normal' }}
                        >
                          Select Status:
                        </label>
                        <Input
                          id='exampleFormControlSelect1'
                          name='status'
                          type='select'
                          value={this.state.status}
                          onChange={this.onChangeHandler}
                        >
                          <option>Choose from list</option>
                          <option>Pending</option>
                          <option>Manifest Generated</option>
                          <option>Shipped</option>
                          <option>Cancelled</option>
                          <option>Delivered</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-key-25' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Coupon Code'
                            type='text'
                            name='couponCode'
                            value={this.state.couponCode}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
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
                            placeholder='Customer Email'
                            type='text'
                            name='customerEmail'
                            value={this.state.customerEmail}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row form>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-delivery-fast' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Shipping Amount'
                            type='text'
                            name='shippingAmount'
                            value={this.state.shippingAmount}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-diamond' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Discount Amount'
                            type='text'
                            name='discountAmount'
                            value={this.state.discountAmount}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row form>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-basket' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Order Total Including Taxes'
                            type='text'
                            name='orderTotalInclTax'
                            value={this.state.orderTotalInclTax}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      {' '}
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-bag-17' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Order Grand Total'
                            type='text'
                            name='orderGrandTotal'
                            value={this.state.orderGrandTotal}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <div className='text-center text-muted mb-4'>
                        <large>Address Details</large>
                      </div>
                    </Col>
                    <Col md={3}></Col>
                  </Row>

                  <Row form>
                    <Col md={4}>
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
                            placeholder='firstname'
                            type='text'
                            name='firstname'
                            value={this.state.address[0].firstname}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      {' '}
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
                            placeholder='middlename'
                            type='text'
                            name='middlename'
                            value={this.state.address[0].middlename}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      {' '}
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
                            placeholder='lastname'
                            type='text'
                            name='lastname'
                            value={this.state.address[0].lastname}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-building' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Street Address'
                            type='text'
                            name='street'
                            value={this.state.address[0].street}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      {' '}
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-shop' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='city'
                            type='text'
                            name='city'
                            value={this.state.address[0].city}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      {' '}
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-box-2' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='region'
                            type='text'
                            name='region'
                            value={this.state.address[0].region}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row form>
                    <Col md={3}>
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-paper-diploma' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Company Name'
                            type='text'
                            name='company'
                            value={this.state.address[0].company}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      {' '}
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-pin-3' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='postcode'
                            type='text'
                            name='postcode'
                            value={this.state.address[0].postcode}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      {' '}
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: this.state.focusedEmail,
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-mobile-button' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Phone Number'
                            type='text'
                            name='telephone'
                            value={this.state.address[0].telephone}
                            onFocus={() =>
                              this.setState({ focusedEmail: true })
                            }
                            onBlur={() =>
                              this.setState({ focusedEmail: false })
                            }
                            onChange={this.onAddressChangeHandler}
                          />
                        </InputGroup>
                      </FormGroup>

                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="exampleDatepicker"
                          style={{ color: "#8898aa" }}
                        >
                          Order Date
                        </label>
                        <ReactDatetime
                          inputProps={{
                            placeholder: "Select Order Date"
                          }}
                          timeFormat={false}
                          name='orderDate'
                          value={this.state.orderDate}
                          onChange={this.changeDate}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row form>
                    <Col md={1}>
                      <div className='text-center text-muted mb-4'>
                        <small>Add Product</small>
                      </div>
                    </Col>
                    <Col md={1}>
                      <Button
                        className='btn-icon-only rounded-circle'
                        title='Status'
                        color='success'
                        type='button'
                        style={{ marginBottom: 5 }}
                        onClick={() => this.addFormFields()}
                      >
                        <span className='btn-inner--icon'>
                          <i className='ni ni-fat-add' />
                        </span>
                      </Button>
                    </Col>
                  </Row>

                  {this.state.OrderDetails.map((element, index) => (
                    <div key={index}>
                      <Row form>
                        <Col md={6}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-basket' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='Product Name'
                                type='text'
                                name='name'
                                value={element.name}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-money-coins' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='Product Price'
                                type='text'
                                name='price'
                                value={element.price}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md={4}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-chart-bar-32' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='Quantity Ordered'
                                type='number'
                                name='qty_ordered'
                                value={element.qty_ordered}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-tag' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='SKU'
                                type='txt'
                                name='sku'
                                value={element.sku}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-tag' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='Sold By'
                                type='txt'
                                name='soldBy'
                                value={element.soldBy}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>


                        <Col md={12}>
                          <FormGroup
                            className={classnames('mb-3', {
                              focused: this.state.focusedEmail,
                            })}
                          >
                            <InputGroup className='input-group-merge input-group-alternative'>
                              <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                  <i className='ni ni-tag' />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                placeholder='Image Url'
                                type='txt'
                                name='image_url'
                                value={element.image_url}
                                onFocus={() =>
                                  this.setState({ focusedEmail: true })
                                }
                                onBlur={() =>
                                  this.setState({ focusedEmail: false })
                                }
                                onChange={(e) => this.handleChange(index, e)}
                                required
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>


                        <Col md={4}>
                          {index ? (
                            <Button
                              className='btn-icon-only rounded-circle'
                              title='Status'
                              color='warning'
                              type='button'
                              style={{ marginBottom: 5 }}
                              onClick={() => this.removeFormFields(index)}
                            >
                              <span className='btn-inner--icon'>
                                <i className='ni ni-fat-delete' />
                              </span>
                            </Button>
                          ) : null}
                        </Col>
                      </Row>
                    </div>
                  ))}
                  {this.state.loading === true ? (
                    <Row>
                      <Col md='12' className='text-center'>
                        <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : (
                    <div className='text-center'>
                      <Button className='my-4' color='primary' type='submit'>
                        Confirm Details
                      </Button>
                    </div>)}
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <SimpleHeader name='Orders' parentName='Orders' />
        <Container className='mt--6' fluid>
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
              <Button color='warning' onClick={this.searchHandler}>
                Submit form
              </Button>

              {/* </Form> */}

            </CardBody>
          </Card>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Orders Inventory:</h3>
                </CardHeader>
                <Row style={{ marginLeft: 10 }}>
                  {/* <Col md='4'>
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
                  {/* <div className='col'>
                    <Button
                      color='primary'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div> */}

                  <div className='col'>
                    <Button
                      color='warning'
                      type='button'
                      style={{ marginBottom: 30 }}
                      onClick={() => this.newOrder()}
                    >
                      Add New Order
                    </Button>

                  </div>
                </Row>

                <Table
                  id='example'
                  className='display'
                  width='100%'
                // ref={(el) => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Order Id</th>
                      <th>Order Date</th>
                      {/* <th>Coupon</th> */}
                      {/* <th>Guest/ID</th> */}
                      {/* <th>Shipping Discount Amount</th> */}
                      {/* <th>shipping Amount</th> */}
                      {/* <th>order Total InclTax</th> */}
                      <th>order Grand Total</th>
                      <th>Customer</th>

                      {/* <th>Currency</th> */}
                      {/* <th>Customer Email</th> */}
                      <th>Show/Hide</th>
                      <th>Order Details</th>
                      <th>Status</th>
                      {/* <th>Shipping Address ID</th> */}
                      {/* {this.props.User.user.role === 'admin' ? ( */}
                      <th>Actions</th>
                      {/* ) : null} */}
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
          {this.state.loading === true ? (
            <Row>
              <Col md='12' className='text-center'>
                <Loader type="Oval" color="#00BFFF" height={80} width={80} /> </Col> </Row>) : null}

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
  sendMail,
  signOut
};
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
