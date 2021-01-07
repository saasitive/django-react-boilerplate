import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Alert,
  Container,
  Button,
  Row,
  Col,
  Form,
  FormControl
} from "react-bootstrap";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      status: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSendClick = () => {
    this.setState({ emailError: "" });
    this.setState({ status: "" });

    const userData = {
      email: this.state.email
    };
    axios
      .post("/api/v1/users/reset_password/", userData)
      .then(response => {
        this.setState({ status: "success" });
      })
      .catch(error => {
        if (error.response && error.response.data.hasOwnProperty("email")) {
          this.setState({ emailError: error.response.data["email"] });
        } else {
          this.setState({ status: "error" });
        }
      });
  };
  render() {
    let errorAlert = (
      <Alert variant="danger">
        <Alert.Heading>Problem during reset password email send</Alert.Heading>
        Please try again or contact service support for further help.
      </Alert>
    );

    let successAlert = (
      <Alert variant="success">
        <Alert.Heading>Email sent </Alert.Heading>
        <p>
          We send you an email with reset password link. Please check your
          email.
        </p>
        <p>
          Please try again or contact us if you do not receive it within a few
          minutes.
        </p>
      </Alert>
    );

    let form = (
      <div>
        <Form>
          <Form.Group controlId="emailId">
            <Form.Label>Your Email</Form.Label>
            <Form.Control
              isInvalid={this.state.emailError}
              type="text"
              name="email"
              placeholder="Enter email"
              value={this.state.email}
              onChange={this.onChange}
            />
            <FormControl.Feedback type="invalid">
              {this.state.emailError}
            </FormControl.Feedback>
          </Form.Group>
        </Form>
        <Button color="primary" onClick={this.onSendClick}>
          Send email with reset link
        </Button>
      </div>
    );

    let alert = "";
    if (this.state.status === "error") {
      alert = errorAlert;
    } else if (this.state.status === "success") {
      alert = successAlert;
    }

    return (
      <Container>
        <Row>
          <Col md="6">
            <h1>Reset Password</h1>
            {alert}
            {this.state.status !== "success" && form}
          </Col>
        </Row>
      </Container>
    );
  }
}

ResetPassword.propTypes = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(withRouter(ResetPassword));
