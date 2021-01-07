import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
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

class ResetPasswordConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_password: "",
      passwordError: "",
      status: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSaveClick = () => {
    this.setState({ passwordError: "" });
    this.setState({ status: "" });

    const { uid, token } = this.props.match.params;
    const data = {
      uid: uid,
      token: token,
      new_password: this.state.new_password
    };
    axios
      .post("/api/v1/users/reset_password_confirm/", data)
      .then(response => {
        this.setState({ status: "success" });
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data.hasOwnProperty("new_password")
        ) {
          this.setState({ passwordError: error.response.data["new_password"] });
        } else {
          this.setState({ status: "error" });
        }
      });
  };

  render() {
    const errorAlert = (
      <Alert variant="danger">
        <Alert.Heading>Problem during new password set </Alert.Heading>
        <p>
          Please try <Link to="/send_reset_password">reset password</Link> again
          or contact service support for further help.
        </p>
      </Alert>
    );

    const successAlert = (
      <Alert variant="success">
        <Alert.Heading>New Password Set</Alert.Heading>
        <p>
          You can <Link to="/login/">Login</Link> to your account with new
          password.
        </p>
      </Alert>
    );

    const form = (
      <div>
        <Form>
          <Form.Group controlId="emailId">
            <Form.Label>Your New Password</Form.Label>
            <Form.Control
              isInvalid={this.state.passwordError}
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={this.state.new_password}
              onChange={this.onChange}
            />
            <FormControl.Feedback type="invalid">
              {this.state.passwordError}
            </FormControl.Feedback>
          </Form.Group>
        </Form>
        <Button color="primary" onClick={this.onSaveClick}>
          Save
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
            <h1>Set a New Password</h1>
            {alert}
            {this.state.status !== "success" && form}
          </Col>
        </Row>
      </Container>
    );
  }
}

ResetPasswordConfirm.propTypes = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(withRouter(ResetPasswordConfirm));
