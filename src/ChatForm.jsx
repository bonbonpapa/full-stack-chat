import React, { Component } from "react";
import { connect } from "react-redux";

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", images: [], recipient: "", directmessage: "" };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };
  handleImgFiles = event => {
    for (let i = 0; i < event.target.files.length; i++)
      this.setState({
        images: this.state.images.slice().concat(event.target.files[i])
      });
  };
  handleLogout = event => {
    console.log("log out");
    this.props.dispatch({
      type: "login-off"
    });
  };
  handleClearMessages = async () => {
    console.log("clear message");

    let data = new FormData();
    data.append("roomName", this.props.roomName);

    let response = await fetch("/clearmessages", {
      method: "POST",
      body: data,
      credentials: "include"
    });

    let responseBody = await response.text();
    console.log("response from clear messages", responseBody);
    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    if (!parsed.success) {
      alert("Clear messages failed");
      return;
    }
    alert("Messages in Chatroom" + this.props.roomName + " has been cleared!");
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    const timenow = new Date();

    console.log("Message posted time", timenow);
    let data = new FormData();
    data.append("msg", this.state.message);
    data.append("date", timenow);
    data.append("roomName", this.props.roomName);
    // https://stackoverflow.com/questions/54269650/why-formdata-does-not-work-with-multiple-files
    // data.append("images", this.state.fileList);
    for (let i = 0; i < this.state.images.length; i++) {
      data.append("images", this.state.images[i]);
    }
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    // after the message was submitted, set the state to empty.
    this.setState({ message: "", images: [] });
  };

  handleMessageRecipient = event => {
    console.log("new recipient", event.target.value);
    this.setState({ recipient: event.target.value });
  };
  handleDirectMessage = event => {
    console.log("new direct message", event.target.value);
    this.setState({ directmessage: event.target.value });
  };
  handleSubmitDirectMessage = event => {
    event.preventDefault();
    console.log("form submitted for direct message");
    const timenow = new Date();
    console.log("Message posted time", timenow);

    let data = new FormData();
    data.append("msg", this.state.directmessage);
    data.append("recipient", this.state.recipient);
    data.append("roomName", this.props.roomName);
    data.append("timestamp", timenow);

    fetch("/direct-message", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    // after the message was submitted, set the state to empty.
    this.setState({ directmessage: "", recipient: "" });
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Text Message</label>
            <input
              onChange={this.handleMessageChange}
              type="text"
              value={this.state.message}
            />
          </div>
          <div>
            <label>Image Files</label>
            <input
              type="file"
              name="images"
              onChange={this.handleImgFiles}
              multiple
            />
          </div>
          <input type="submit" />
          <button type="button" onClick={this.handleLogout}>
            Logout
          </button>
          <button type="button" onClick={this.handleClearMessages}>
            Clear Messages
          </button>
        </form>
        <form onSubmit={this.handleSubmitDirectMessage}>
          <div>
            <label>Message to</label>
            <input
              onChange={this.handleMessageRecipient}
              type="text"
              value={this.state.recipient}
            />
            <input
              onChange={this.handleDirectMessage}
              type="text"
              value={this.state.directmessage}
            />
          </div>
          <input type="submit" />
        </form>
      </div>
    );
  };
}

export default connect()(ChatForm);
