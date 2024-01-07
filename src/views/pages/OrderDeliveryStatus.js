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

import { connect } from 'react-redux';
import { getDeliveryDetails } from '../../actions/order_actions';
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import { signOut } from '../../actions/user_actions';
// import { config } from '../../siteDetails';
// import axios from 'axios';
// import jwt_decode from 'jwt-decode';
// import axios from 'axios';
// import { config } from '../../siteDetails';

class OrderDeliveryStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      waybill: '',
      productId: '',
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
    let waybill = this.state.waybill;
    this.props.getDeliveryDetails(waybill).then((res) => {
      this.setState({data: res.data.ShipmentData[0].Shipment.Status});
      // if (res.success === 'OK') {
      //   this.setState({
      //     name: '',
      //     productId: '',
      //     originalQuantity: 0,
      //     remark: '',
      //     updatedQuantity: 0,
      //     ischecked: false,
      //     userId: '',
      //   });
      //   this.successAlert();
      // } else {
      //   this.setState({
      //     name: '',
      //     productId: '',
      //     originalQuantity: 0,
      //     remark: '',
      //     updatedQuantity: 0,
      //     ischecked: false,
      //     userId: '',
      //   });
      //   this.failAlert();
      // }
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
    this.props.history.push('/admin/orders');
  };
  checkwaybill = async () => {
    await this.setState({ waybill: this.props.match.params.id || '' });
  };
 
  componentDidMount() {
   
    this.checkwaybill();
    // this.setState({
    //   userId: this.props.User.user.uid || null,
    //   productId: this.props.location.state.product._id || null,
    //   originalQuantity: this.props.location.state.product.quantity || null,
    //   SKU: this.props.location.state.product.SKU || null,
    //   name: this.props.location.state.product.name || null,
    //   // updatedQuantity: this.props.location.state.product.quantity,
    // });
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

        <SimpleHeader
          name='Order Delivery Status'
          parentName='Order Delivery'
        />
        <Container className='mt--6' fluid>
          <Row>
            <div className='col'>
              <div className='card-wrapper'>
                <Card>
                  <CardHeader>
                    <h3 className='mb-0'>Delivery Status</h3>
                  </CardHeader>

                  <CardBody>
                    <Row>
                      <Col lg='8'>
                        <p className='mb-0'>
                          Enter <code> Waybill Number </code> to find status of
                          the shipment <code>Submit Request->Enter</code> on{' '}
                          <code>Submit Form</code>. Note that{' '}
                          <code>the instance will be reported</code>.
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
                              Waybill Number
                            </label>
                            <Input
                              className='is-valid'
                              // defaultValue='Mark'
                              id='validationServer01'
                              placeholder='Waybill Number'
                              value={this.state.waybill}
                              type='text'
                              name="waybill"
                              onChange={this.onChangeHandler}
                            />
                            <div className='valid-feedback'>Looks good!</div>
                          </FormGroup>
                        </Col>
                      </div>
                      
                      <Button color='primary' type='submit'>
                        Submit form
                      </Button>
                    </Form>
                    <div style={{marginTop: 20}}>
                    {Object.keys(this.state.data).map((keyName, i) => (
    <li className="travelcompany-input" key={i}>
        <span className="input-label" > {keyName}: {this.state.data[keyName]}</span>
    </li>
))}
                    </div>
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
  getDeliveryDetails,
  signOut
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDeliveryStatus);
