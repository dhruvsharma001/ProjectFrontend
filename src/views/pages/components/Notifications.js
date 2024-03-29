import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
// reactstrap components
import {
  UncontrolledAlert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

class Notifications extends React.Component {
  state = {
    defaultModal: false,
    notificationModal: false,
    formModal: false,
    alert: null
  };
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  notify = type => {
    let options = {
      place: "tc",
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {" "}
            Bootstrap Notify
          </span>
          <span data-notify="message">
            Turning standard Bootstrap alerts into awesome notifications
          </span>
        </div>
      ),
      type: type,
      icon: "ni ni-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  basicAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Here's a message!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          btnSize=""
          text="A few words about this sweet alert ..."
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
  infoAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          info
          style={{ display: "block", marginTop: "-100px" }}
          title="Info"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
  successAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Success"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="success"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
  warningAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Warning"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="warning"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
  questionAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Question"
          customIcon={
            <div
              className="swal2-icon swal2-question swal2-animate-question-icon"
              style={{ display: "flex" }}
            >
              <span className="swal2-icon-text">?</span>
            </div>
          }
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="default"
          confirmBtnText="Ok"
          btnSize=""
        >
          A few words about this sweet alert ...
        </ReactBSAlert>
      )
    });
  };
  hideAlert = () => {
    this.setState({
      alert: null
    });
  };
  render() {
    return (
      <>
        {this.state.alert}
        <div className="rna-wrapper">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <SimpleHeader name="Notifications" parentName="Components" />
        <Container className="mt--6" fluid>
          <Row className="justify-content-center">
            <Col className="card-wrapper" lg="8">
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Alerts</h3>
                </CardHeader>
                <CardBody>
                  <UncontrolledAlert className="alert-default">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Default!</strong> This is a default alert—check it
                      out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="primary">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Primary!</strong> This is a primary alert—check it
                      out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="secondary">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Secondary!</strong> This is a secondary
                      alert—check it out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="info">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Info!</strong> This is a info alert—check it out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="success">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Success!</strong> This is a success alert—check it
                      out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="danger">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Danger!</strong> This is a danger alert—check it
                      out!
                    </span>
                  </UncontrolledAlert>
                  <UncontrolledAlert color="warning">
                    <span className="alert-icon">
                      <i className="ni ni-like-2" />
                    </span>
                    <span className="alert-text ml-1">
                      <strong>Warning!</strong> This is a warning alert—check it
                      out!
                    </span>
                  </UncontrolledAlert>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="mb-0">Modals</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="4">
                      <Button
                        block
                        className="mb-3"
                        color="primary"
                        onClick={() => this.toggleModal("defaultModal")}
                      >
                        Default
                      </Button>
                      <Modal
                        className="modal-dialog-centered"
                        isOpen={this.state.defaultModal}
                        toggle={() => this.toggleModal("defaultModal")}
                      >
                        <div className="modal-header">
                          <h6 className="modal-title" id="modal-title-default">
                            Type your modal title
                          </h6>
                          <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("defaultModal")}
                          >
                            <span aria-hidden={true}>×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>
                            Far far away, behind the word mountains, far from
                            the countries Vokalia and Consonantia, there live
                            the blind texts. Separated they live in
                            Bookmarksgrove right at the coast of the Semantics,
                            a large language ocean.
                          </p>
                          <p>
                            A small river named Duden flows by their place and
                            supplies it with the necessary regelialia. It is a
                            paradisematic country, in which roasted parts of
                            sentences fly into your mouth.
                          </p>
                        </div>
                        <div className="modal-footer">
                          <Button color="primary" type="button">
                            Save changes
                          </Button>
                          <Button
                            className="ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("defaultModal")}
                          >
                            Close
                          </Button>
                        </div>
                      </Modal>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        className="mb-3"
                        color="warning"
                        onClick={() => this.toggleModal("notificationModal")}
                      >
                        Notification
                      </Button>
                      <Modal
                        className="modal-dialog-centered modal-danger"
                        contentClassName="bg-gradient-danger"
                        isOpen={this.state.notificationModal}
                        toggle={() => this.toggleModal("notificationModal")}
                      >
                        <div className="modal-header">
                          <h6
                            className="modal-title"
                            id="modal-title-notification"
                          >
                            Your attention is required
                          </h6>
                          <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() =>
                              this.toggleModal("notificationModal")
                            }
                          >
                            <span aria-hidden={true}>×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="py-3 text-center">
                            <i className="ni ni-bell-55 ni-3x" />
                            <h4 className="heading mt-4">
                              You should read this!
                            </h4>
                            <p>
                              A small river named Duden flows by their place and
                              supplies it with the necessary regelialia.
                            </p>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <Button
                            className="btn-white"
                            color="default"
                            type="button"
                          >
                            Ok, Got it
                          </Button>
                          <Button
                            className="text-white ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() =>
                              this.toggleModal("notificationModal")
                            }
                          >
                            Close
                          </Button>
                        </div>
                      </Modal>
                    </Col>
                    <Col md="4">
                      <Button
                        block
                        color="default"
                        onClick={() => this.toggleModal("formModal")}
                      >
                        Form
                      </Button>
                      <Modal
                        className="modal-dialog-centered"
                        size="sm"
                        isOpen={this.state.formModal}
                        toggle={() => this.toggleModal("formModal")}
                      >
                        <div className="modal-body p-0">
                          <Card className="bg-secondary border-0 mb-0">
                            <CardHeader className="bg-transparent pb-5">
                              <div className="text-muted text-center mt-2 mb-3">
                                <small>Sign in with</small>
                              </div>
                              <div className="btn-wrapper text-center">
                                <Button
                                  className="btn-neutral btn-icon"
                                  color="default"
                                  href="#pablo"
                                  onClick={e => e.preventDefault()}
                                >
                                  <span className="btn-inner--icon mr-1">
                                    <img
                                      alt="..."
                                      src={require("assets/img/icons/common/github.svg")}
                                    />
                                  </span>
                                  <span className="btn-inner--text">
                                    Github
                                  </span>
                                </Button>
                                <Button
                                  className="btn-neutral btn-icon"
                                  color="default"
                                  href="#pablo"
                                  onClick={e => e.preventDefault()}
                                >
                                  <span className="btn-inner--icon mr-1">
                                    <img
                                      alt="..."
                                      src={require("assets/img/icons/common/google.svg")}
                                    />
                                  </span>
                                  <span className="btn-inner--text">
                                    Google
                                  </span>
                                </Button>
                              </div>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                              <div className="text-center text-muted mb-4">
                                <small>Or sign in with credentials</small>
                              </div>
                              <Form role="form">
                                <FormGroup
                                  className={classnames("mb-3", {
                                    focused: this.state.focusedEmail
                                  })}
                                >
                                  <InputGroup className="input-group-merge input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-email-83" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      placeholder="Email"
                                      type="email"
                                      onFocus={() =>
                                        this.setState({ focusedEmail: true })
                                      }
                                      onBlur={() =>
                                        this.setState({ focusedEmail: false })
                                      }
                                    />
                                  </InputGroup>
                                </FormGroup>
                                <FormGroup
                                  className={classnames({
                                    focused: this.state.focusedPassword
                                  })}
                                >
                                  <InputGroup className="input-group-merge input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-lock-circle-open" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      placeholder="Password"
                                      type="password"
                                      onFocus={() =>
                                        this.setState({ focusedPassword: true })
                                      }
                                      onBlur={() =>
                                        this.setState({
                                          focusedPassword: false
                                        })
                                      }
                                    />
                                  </InputGroup>
                                </FormGroup>
                                <div className="custom-control custom-control-alternative custom-checkbox">
                                  <input
                                    className="custom-control-input"
                                    id=" customCheckLogin"
                                    type="checkbox"
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor=" customCheckLogin"
                                  >
                                    <span className="text-muted">
                                      Remember me
                                    </span>
                                  </label>
                                </div>
                                <div className="text-center">
                                  <Button
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                  >
                                    Sign in
                                  </Button>
                                </div>
                              </Form>
                            </CardBody>
                          </Card>
                        </div>
                      </Modal>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="mb-0">Notifications</h3>
                </CardHeader>
                <CardBody>
                  <Button
                    color="default"
                    onClick={() => this.notify("default")}
                  >
                    Default
                  </Button>
                  <Button color="info" onClick={() => this.notify("info")}>
                    Info
                  </Button>
                  <Button
                    color="success"
                    onClick={() => this.notify("success")}
                  >
                    Success
                  </Button>
                  <Button
                    color="warning"
                    onClick={() => this.notify("warning")}
                  >
                    Warning
                  </Button>
                  <Button color="danger" onClick={() => this.notify("danger")}>
                    Danger
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="mb-0">Sweet alerts</h3>
                </CardHeader>
                <CardBody>
                  <Button color="primary" onClick={this.basicAlert}>
                    Basic alert
                  </Button>
                  <Button color="info" onClick={this.infoAlert}>
                    Info alert
                  </Button>
                  <Button color="success" onClick={this.successAlert}>
                    Success alert
                  </Button>
                  <Button color="warning" onClick={this.warningAlert}>
                    Warning alert
                  </Button>
                  <Button color="default" onClick={this.questionAlert}>
                    Question
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Notifications;
