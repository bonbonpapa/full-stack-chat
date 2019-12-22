import React, { Component } from "react";
import { connect } from "react-redux";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    console.log("signup form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/signup", { method: "POST", body: data });

    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) alert(body.error);
    else {
      response = await fetch("/login", {
        method: "POST",
        body: data,
        credentials: "include"
      });
      responseBody = await response.text();
      console.log("responseBody from login", responseBody);
      body = JSON.parse(responseBody);
      console.log("parsed body", body);
      if (!body.success) {
        alert("login failed");
        return;
      }
      this.props.dispatch({
        type: "login-success"
      });
    }
  };
  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input type="text" onChange={this.handleUsernameChange} />
        Password
        <input type="text" onChange={this.handlePasswordChange} />
        <input type="submit" />
      </form>
    );
  };
}
export default connect()(Signup);
