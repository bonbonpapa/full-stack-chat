import React, { Component } from "react";
import { connect } from "react-redux";

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };
  handleLogout = event => {
    console.log("log out");
    this.props.dispatch({
      type: "login-off"
    });
  };
  handleClearMessages = event => {
    console.log("clear message");
    fetch("/clearmessages", {
      method: "POST",
      credentials: "include"
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();
    data.append("msg", this.state.message);
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    // after the message was submitted, set the state to empty.
    this.setState({ message: "" });
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleMessageChange}
            type="text"
            value={this.state.message}
          />
          <input type="submit" />
          <button type="button" onClick={this.handleLogout}>
            Logout
          </button>
          <button type="button" onClick={this.handleClearMessages}>
            Clear Messages
          </button>
        </form>
      </div>
    );
  };
}

export default connect()(ChatForm);
