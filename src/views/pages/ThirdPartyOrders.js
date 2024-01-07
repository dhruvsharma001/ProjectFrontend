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
  // Form,
  // Input,
  // InputGroupAddon,
  // InputGroupText,
  CardBody,
  // InputGroup,
  // Modal,
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

class ThirdPartyOrders extends React.Component {
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
      url: 'http://35.154.166.220:3000/uploads/images/',
      waybillArray: [],
      oldWaybillArray: [],
      shippingCost: '',
      orderedProducts: 0,
      magentoOrderId: '',
      orderId: '',
      orderDate: '',
      oldOrderDate: '',
      loading: true,
      startDate: '01/01/2023',
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
      OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '' }],
    };
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.fetchMyData = this.fetchMyData.bind(this);
    // this.handleChange = this.handleChange.bind(this);
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
  // onAddressChangeHandler = (e) => {
  //   let address = this.state.address;
  //   address[0][e.target.name] = e.target.value;
  //   this.setState({ address });
  // };
  // handleChange(i, e) {
  //   let OrderDetails = this.state.OrderDetails;
  //   OrderDetails[i][e.target.name] = e.target.value;
  //   this.setState({ OrderDetails });
  // }
  // addFormFields() {
  //   this.setState({
  //     OrderDetails: [
  //       ...this.state.OrderDetails,
  //       { name: '', price: '', qty_ordered: '', sku: '' },
  //     ],
  //   });
  // }
  // handleWaybillChange(i, e) {
  //   let waybillArray = this.state.waybillArray;
  //   waybillArray[i][e.target.name] = e.target.value;
  //   this.setState({ waybillArray });
  // }
  // addWaybillField() {
  //   this.setState({
  //     waybillArray: [
  //       ...this.state.waybillArray,
  //       { waybill: '', status: 'Pending'},
  //     ],
  //   });


  // }
  // removeWaybillField(i) {
  //   let waybillArray = this.state.waybillArray;
  //   waybillArray.splice(i, 1);
  //   this.setState({waybillArray});
  // }


  // removeFormFields(i) {
  //   let OrderDetails = this.state.OrderDetails;
  //   OrderDetails.splice(i, 1);
  //   this.setState({ OrderDetails });
  // }

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
  // warningAlert = (id) => {
  //   this.setState({
  //     notifyAlert: (
  //       <ReactBSAlert
  //         warning
  //         style={{ display: 'block', marginTop: '100px' }}
  //         title='Warning'
  //         showCancel={true}
  //         onCancel={() => this.hideAlert()}
  //         onConfirm={() => this.deleteOrder(id)}
  //         confirmBtnBsStyle='warning'
  //         cancelBtnBsStyle='success'
  //         confirmBtnText='Ok'
  //         cancelBtnText='Cancel'
  //         btnSize=''
  //       >
  //         Are you sure you want to delete?
  //       </ReactBSAlert>
  //     ),
  //   });
  // };
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
      url: `${config.serverUrl}order/getThirdPartyOrders`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken,
      },
      data: data,
    }).then((response) => {
      // console.log(response, "orders")
      this.setState({ data: response.data.data, loading: false });
      // this.setState({  loading: false });

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
      OrderDetails: [{ name: '', price: '', qty_ordered: '', sku: '' }],
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



  editShow = (index) => {
    let show = [...this.state.show];
    show[index] = !this.state.show[index];
    this.setState({ show });

  };
  async componentDidMount() {

    await this.fetchMyData();
  }
  render() {

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {<div className='text-center mb-4'>{item.OrderDetails[0].magentoOrderId}</div>}
          </td>
          <td>
            {<div className='text-center mb-4'>{moment(item.OrderDetails[0].orderDate).format('YYYY-MM-DD')}</div>}
          </td>

          <td>
            {<div className='text-center mb-4'>{item.OrderDetails[0].orderGrandTotal}</div>}
          </td>
          <td>
            {(item.OrderDetails[0].address && this.state.show[index]) ? (
              <ListGroup>

                <ListGroupItem color='success'>
                  {item.OrderDetails[0].address[0].firstname}{" "}{item.OrderDetails[0].address[0].lastname}<br />
                  {item.OrderDetails[0].customerEmail}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Street: '}
                  {item.OrderDetails[0].address[0].street}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'City: '}
                  {item.OrderDetails[0].address[0].city}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Region: '}
                  {item.OrderDetails[0].address[0].region}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'PIN: '}
                  {item.OrderDetails[0].address[0].postcode}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {'Phone: '}
                  {item.OrderDetails[0].address[0].telephone}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {item.OrderDetails[0].address[0].country_id}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.OrderDetails[0].address[0].address_type}
                </ListGroupItem>
                {/* <ListGroupItem color='success'>
                  {'ID: '}
                  {item.address.customer_address_id}
                </ListGroupItem> */}
              </ListGroup>
            ) : (
              <ListGroup>
                <ListGroupItem color='success'>
                  {item.OrderDetails[0].address[0].firstname}{" "}{item.OrderDetails[0].address[0].lastname}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.OrderDetails[0].customerEmail}
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
            {(item.OrderDetails[0].orderDetails.length > 0 && this.state.show[index]) ?
              // item.orderDetails.length

              item.OrderDetails[0].orderDetails.map((item, index) => {
                return (
                  <div className='text-left mb-4' key={index}>
                    <ListGroup>
                      <ListGroupItem color='success'>
                        {item.name}
                        {' X '}
                        {~~item.qty_ordered}
                      </ListGroupItem>
                      <ListGroupItem color='warning'>
                        {'Price/Unit '}
                        {item.price}
                      </ListGroupItem>
                    </ListGroup>

                    <br></br>
                  </div>

                );

              })
              :
              item.OrderDetails[0].orderDetails.length
            }
          </td>
          <td>{item.OrderDetails[0].status}</td>


        </tr>
      );
    };

    return (
      <>
        {this.state.notifyAlert}

        <SimpleHeader name='Third Party Orders' parentName='Orders' />
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
                  <h3 className='mb-0'>Orders With Third Party Products:</h3>
                </CardHeader>
                {/* <Row style={{ marginLeft: 10 }}>
                

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
                </Row> */}

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

                      <th>order Grand Total</th>
                      <th>Customer</th>
                      <th>Show/Hide</th>
                      <th>Order Details</th>
                      <th>Status</th>
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
export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartyOrders);
