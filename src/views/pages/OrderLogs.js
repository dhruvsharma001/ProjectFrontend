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
  // Table,
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

import Loader from 'react-loader-spinner';
// import Moment from 'react-moment';
import classnames from 'classnames';
import { setUser, signOut } from '../../actions/user_actions';
import jwt_decode from 'jwt-decode';

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

class OrderLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: '',
      table: {},
      userId: '',
      loading: true
    };
  }
  searchHandler = () => {
    this.state.table.destroy();
    this.fetchMyData();
  };
  fetchMyData() {
    const data = {
      // selected_date: this.state.date,
    };
    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
    }
    // console.log(data, this.props.User.user.uid, 'here');
    axios({
      method: 'POST',
      url: `${config.serverUrl}log/getOrderLogs`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken,
      },
      data: data,
    })
      .then((response) => {
        this.setState({ data: response.data.data , loading: false});
        // console.log(response.data.data, 'orderLogs')
        const tbobj = $('#example').DataTable({
          //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
          bFilter: true,
          pageLength: 10,
          scrollX: true,

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
        this.setState({ table: tbobj });
      })
      .catch((err) => {
        console.log(err);
      });
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
          <td>{item.requestType}</td>
          <td>{item.User_Name}</td>
          <td>{item.magentoOrderId ? item.magentoOrderId : item.orderId}</td>
          {/* <td>{item.Product_Name}</td> */}
          <td>
            {item.requestParameters.length > 0 ? (
              <ListGroup>
                <ListGroupItem color='warning'>
                  {item.requestParameters[0].oldStatus}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.requestParameters[0].waybill ? item.requestParameters[0].waybill : item.requestParameters[0].waybillArray.map((item, key) => ("["+ item.waybill +"\n" +item.status+"]" ))}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.requestParameters[0].shippingCost}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.requestParameters[0].comments}
                </ListGroupItem>
                <ListGroupItem color='warning'>
                  {item.requestParameters[0].orderDate}
                </ListGroupItem>
              </ListGroup>
            ) : (
              'N/A'
            )}
          </td>
          <td>
            {item.requestParameters.length > 0 ? (
              <ListGroup>
                <ListGroupItem color='success'>
                  {item.requestParameters[1].newStatus}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {item.requestParameters[1].waybill ? item.requestParameters[1].waybill : item.requestParameters[1].waybillArray.map((item, key) => ("["+ item.waybill +"\n" +item.status+"]" ))}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {item.requestParameters[1].shippingCost}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {item.requestParameters[1].comments}
                </ListGroupItem>
                <ListGroupItem color='success'>
                  {item.requestParameters[1].orderDate}
                </ListGroupItem>
              </ListGroup>
            ) : (
              'N/A'
            )}
          </td>
          <td>
            {
              <div className='text-left mb-4' style={{ marginTop: 15 }}>
                {moment(item.createdAt).format('DD/MM/YYYY')} <br />{' '}
                {moment(item.createdAt).format('HH:mm:ss')}
              </div>
            }
          </td>
          {/* <td>{item.ReOrder ? 'Low Stock' : 'N/A'}</td> */}
          {/* <td>
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
          </td> */}
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
                        placeholder='quantity'
                        type='text'
                        name='quantity'
                        value={this.state.quantity}
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
                        placeholder='SKU'
                        type='text'
                        name='SKU'
                        value={this.state.SKU}
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
                        placeholder='HSN'
                        type='text'
                        name='HSN'
                        value={this.state.HSN}
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

        <SimpleHeader name='Products' parentName='Products' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Products Logs:</h3>
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
                      onClick={() => this.newProduct()}
                    >
                      Add New Product
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
                <table
                  id='example'
                  className='display'
                  width='100%'
                  style={{ marginLeft: 20 }}
                  ref={(el) => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Request Type</th>
                      <th>User</th>
                      {/* <th>Product</th> */}
                      <th>OrderId</th>
                      <th>Original Data</th>
                      <th>Edited Data</th>
                      <th>Date - Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </table>
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
const mapDispatchToProps = {signOut, setUser};
export default connect(mapStateToProps, mapDispatchToProps)(OrderLogs);
