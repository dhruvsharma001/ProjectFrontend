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
import { Button, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
class ProfileHeader extends React.Component {
  triggerForm = () => {
    this.props.openEdit();
  };
  render() {
    return (
      <>
        <div
          className='header pb-6 d-flex align-items-center'
          style={{
            minHeight: '500px',
            backgroundImage:
              'url("' + require('assets/img/theme/profile-cover.jpg') + '")',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <span className='mask bg-gradient-info opacity-8' />

          <Container className='d-flex align-items-center' fluid>
            <Row>
              <Col lg='7' md='10'>
                <h1 className='display-2 text-white'>
                  Hello {this.props.User.user.name}
                </h1>
                <p className='text-white mt-0 mb-5'>
                  This is your profile page. You can see the progress you've
                  made with your work and manage your projects or assigned tasks
                </p>
                <Button
                  className='btn-neutral'
                  color='default'
                  // onClick={() => this.triggerForm()}
                >
                  Edit profile
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
