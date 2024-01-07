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
// import axios from 'axios';
// import { config } from '../../siteDetails';

import { connect } from 'react-redux';
import { editInventory } from '../../actions/product_actions';
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { signOut } from '../../actions/user_actions';

// import axios from 'axios';
// import { config } from '../../siteDetails';

class InventoryUpdateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      productId: '',
      SKU: '',
      originalQuantity: 0,
      remark: '',
      updatedQuantity: 0,
      ischecked: true,
      userId: '',
      notifyAlert: null,
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
    let id = this.state.productId;
    let newQuantity =
      this.state.originalQuantity + parseInt(this.state.updatedQuantity);
    // console.log(newQuantity, 'updated Quatity');
    var data = {
      updatedQuantity: newQuantity,
      userId: this.state.userId,
      remarks: this.state.remark,
      ischecked: this.state.ischecked,
    };
    // console.log(data, id, 'input variables ');
    this.props.editInventory(data, id).then((res) => {
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
  
  componentDidMount() {
   
    this.setState({
      userId: this.props.User.user.uid || null,
      productId: this.props.location.state.product._id || null,
      originalQuantity: this.props.location.state.product.quantity || null,
      SKU: this.props.location.state.product.SKU || null,
      name: this.props.location.state.product.name || null,
      // updatedQuantity: this.props.location.state.product.quantity,
    });

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

        <SimpleHeader name='Inventory Update' parentName='Product Inventory' />
        <Container className='mt--6' fluid>
          <Row>
            <div className='col'>
              <div className='card-wrapper'>
                <Card>
                  <CardHeader>
                    <h3 className='mb-0'>Edit Product</h3>
                  </CardHeader>

                  <CardBody>
                    <Row>
                      <Col lg='8'>
                        <p className='mb-0'>
                          To edit the product alter the quantity, add remarks
                          under<code> Remarks</code> and toggle issue{' '}
                          <code>No->Yes</code> and <code>Submit Form</code>.
                          Note that <code>the instance will be reported</code>.
                        </p>
                      </Col>
                    </Row>
                    <hr />
                    <Form onSubmit={this.handleSubmit}>
                      <div className='form-row'>
                        <Col className='mb-3' md='4'>
                          <FormGroup className='has-success'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServer01'
                            >
                              Product name
                            </label>
                            <Input
                              className='is-valid'
                              // defaultValue='Mark'
                              id='validationServer01'
                              placeholder='Product Name'
                              required
                              value={this.state.name}
                              type='text'
                              readOnly
                            />
                            <div className='valid-feedback'>Looks good!</div>
                          </FormGroup>
                        </Col>
                        <Col className='mb-3' md='4'>
                          <FormGroup className='has-success'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServer02'
                            >
                              SKU
                            </label>
                            <Input
                              className='is-valid'
                              id='validationServer02'
                              value={this.state.SKU}
                              placeholder='SKU'
                              required
                              type='text'
                              readOnly
                            />
                            <div className='valid-feedback'>Looks good!</div>
                          </FormGroup>
                        </Col>
                        <Col className='mb-3' md='4'>
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServerUsername'
                            >
                              Original Quantity
                            </label>
                            <Input
                              className='is-valid'
                              // defaultValue="Otto"
                              id='validationServer02'
                              value={this.state.originalQuantity}
                              placeholder='Quantity'
                              required
                              type='text'
                              readOnly
                            />
                            <div className='valid-feedback'>Looks good!</div>

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
                              Issue
                            </label>

                            <br></br>
                            <label className='custom-toggle custom-toggle-danger mr-1'>
                              <input
                                type='checkbox'
                                id='cb-1'
                                checked={this.state.ischecked}
                                onChange={(e) =>
                                  this.setState({ ischecked: e.target.checked })
                                }
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
                          <FormGroup className='has-danger'>
                            <label
                              className='form-control-label'
                              htmlFor='validationServerUsername'
                            >
                              Update Quantity(-ve to deduct quantity)
                            </label>
                            <Input
                              placeholder="enter quantity +ve or -ve"
                              value={this.state.updatedQuantity}
                              onChange={this.handleChange.bind(this)}
                              id='example-number-input'
                              type='number'
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col className="mb-3" md="3">
                          <FormGroup className="has-danger">
                            <label
                              className="form-control-label"
                              htmlFor="validationServer05"
                            >
                              Zip
                            </label>
                            <Input
                              className="is-invalid"
                              id="validationServer05"
                              placeholder="Zip"
                              required
                              type="text"
                            />
                            <div className="invalid-feedback">
                              Please provide a valid zip.
                            </div>
                          </FormGroup>
                        </Col> */}
                      </div>
                      {/* <FormGroup className="has-danger">
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            className="custom-control-input is-invalid"
                            defaultValue=""
                            id="invalidCheck3"
                            required
                            type="checkbox"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="invalidCheck3"
                          >
                            Agree to inputs and remarks
                          </label>
                          <div className="invalid-feedback">
                            You must agree before submitting.
                          </div>
                        </div>
                      </FormGroup> */}
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
)(InventoryUpdateProduct);
