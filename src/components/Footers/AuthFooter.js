/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5" id="footer-main">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
            <Col lg='6'>
                <div className='copyright text-center text-lg-left text-muted'>
                  © {new Date().getFullYear()}{' '}
                  <a
                    className='font-weight-bold ml-1'
                    href='https://www.whisperinghomes.com'
                    target='_blank'
                  >
                    Whispering Homes
                  </a>
                </div>
              </Col>
              <Col lg='6'>
                <Nav className='nav-footer justify-content-center justify-content-lg-end'>
                  <NavItem>
                    <NavLink
                      href='https://www.whisperinghomes.com'
                      target='_blank'
                    >
                      Whispering Homes
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href='https://www.whisperinghomes.com/about-us'
                      target='_blank'
                    >
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href='https://www.whisperinghomes.com/blog'
                      target='_blank'
                    >
                      Blog
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="https://www.creative-tim.com/license?ref=adpr-auth-footer"
                      target="_blank"
                    >
                      License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
