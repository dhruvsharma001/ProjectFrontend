import React, { Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { config } from '../../siteDetails';
import ReactDatetime from 'react-datetime';

import { connect } from 'react-redux';
import { editInventory } from '../../actions/product_actions';
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { signOut } from '../../actions/user_actions';
import jwt_decode from 'jwt-decode';

// import axios from 'axios';
// import { config } from '../../siteDetails';

class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      remark: '',
      ischecked: true,
      userId: '',
      notifyAlert: null,
      expenseDate: '',
      expenseType: ''
    };
  }

  handleChange(event) {
    // const value = event.target.value.replace(/\+|-/gi, '');
    const value = event.target.value;

    this.setState({ updatedQuantity: value });
  }
  toggleCheckChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
    // console.log(this.state.ischecked, 'in func');
  };
  onChangeHandler = (e) => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
    this.setState({ userId: this.props.User.user.uid });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    var data = {
      date: this.state.expenseDate,
      userId: this.state.userId,
      remarks: this.state.remark,
      amount: this.state.amount,
      expenseType: this.state.expenseType,
    };
    // console.log(data, id, 'input variables ');
    this.props.editInventory(data).then((res) => {
      if (res.success === 'OK') {
        this.setState({
          name: '',
          productId: '',
          originalQuantity: 0,
          remark: '',
          updatedQuantity: 0,
          ischecked: false,
          userId: '',
        });
        this.successAlert();
      } else {
        this.setState({
          name: '',
          productId: '',
          originalQuantity: 0,
          remark: '',
          updatedQuantity: 0,
          ischecked: false,
          userId: '',
        });
        this.failAlert();
      }
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
          This incident will be reported !!
        </ReactBSAlert>
      ),
    });
  };
  hideAlert = () => {
    this.setState({
      notifyAlert: null,
    });
    this.props.history.push('/admin/inventoryUpdate');
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
              console.log('authcheck in hoc')
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
    console.log('expiry check in hoc')

    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        this.props.history.push('/auth/login');
      } else {

        // console.log(decoded.user.role, decoded.user.uid, 'token still valid');
      }
    } else {
      console.log('no token found');
      this.props.history.push('/auth/login');
    }
  };
  componentDidMount() {
    this.checkExpiry();
    this.authCheck();
   

    // console.log('here');

    //     if (localStorage.authToken) {
    //       axios({
    //         method: 'POST',
    //         url: `${config.serverUrl}products/details/`,
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'x-auth-token': localStorage.authToken,
    //         },
    //         data: data,
    //       }).then((resdata) => {
    //            console.log(resdata, "productData")
    //             this.setState({ allPayments: udata.data.data })
    //             console.log(this.state.allPayments, "allPayments")
    //         }).catch(err => {
    //             console.log(err)
    //         })
    // }
  }

  render() {
    return (
      <>
        {this.state.notifyAlert}

        <SimpleHeader name='Expenses' parentName='Expenses' />
        <Container className='mt--6' fluid>
          <Row>
            <div className='col'>
              <div className='card-wrapper'>
                <Card>
                  <CardHeader>
                    <h3 className='mb-0'>Expenses</h3>
                  </CardHeader>

                  <CardBody>
                    <Row>
                      <Col lg='8'>
                        <p className='mb-0'>
                          To enter the Expense , choose date under<code> Expense Date</code> select type from <code> Expense Type </code> Enter <code> Amount </code> without <code>(,) comma </code> and remarks
                          under<code> Remarks</code> (report turned on by default) {'  '} 
                          <code> No->Yes </code> and <code>Submit Form</code>.
                          Note that <code>the instance will be reported</code>.
                        </p>
                      </Col>
                    </Row>
                    <hr />
                    <Form onSubmit={this.handleSubmit}>
                      <div className='form-row'>
                        <Col className='mb-3' md='4'>
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
                        </Col>
                        <Col className='mb-3' md='4'>
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
                      name='Expense Type'
                      type='select'
                      value={this.state.expense}
                      onChange={this.onChangeHandler}
                    >
                      <option>Choose from list</option>
                      <option>Salary</option>
                      <option>Logistics</option>
                      <option>Marketing</option>
                      <option>Others</option>
                    </Input>
                  </FormGroup>
                        </Col>
                        <Col className='mb-3' md='4'>
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
                        </Col>
                      </div>
                      <div className='form-row'>
                        <Col className='mb-3' md='6'>
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServerUsername'
                            >
                              Report
                            </label>

                            <br></br>
                            <label className='custom-toggle custom-toggle-danger mr-1'>
                              <input
                                type='checkbox'
                                id='cb-1'
                                checked={this.state.ischecked}
                                // onChange={(e) =>
                                //   this.setState({ ischecked: e.target.checked })
                                // }
                                readOnly
                              />
                              <span
                                className='custom-toggle-slider rounded-circle'
                                data-label-off='No'
                                data-label-on='Yes'
                              />
                            </label>
                            {/* <div className="valid-feedback">
                              Please provide a valid city.
                            </div> */}
                          </FormGroup>
                        </Col>
                        <Col className='mb-3' md='3'>
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServer04'
                            >
                              Remarks
                            </label>
                            <Input
                              className='is-valid'
                              name='remark'
                              id='validationServer04'
                              placeholder='Add Remarks !'
                              required
                              value={this.state.remark}
                              type='textarea'
                              onChange={this.onChangeHandler}
                            />
                            <div className='valid-feedback'>
                              Please provide a valid remarks.
                            </div>
                          </FormGroup>
                        </Col>
                        <Col className='mb-3' md='4'>
                          
                        </Col>
                       
                      </div>
                      
                      <Button color='primary' type='submit'>
                        Submit form
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Row>
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
  editInventory,
  signOut
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Expenses);
