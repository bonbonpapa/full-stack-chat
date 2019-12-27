import React, { Component } from "react";
import { connect } from "react-redux";

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", images: [] };
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
    const timenow = new Date();

    console.log("Message posted time", timenow);
    let data = new FormData();
    data.append("msg", this.state.message);
    data.append("date", timenow);
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
      </div>
    );
  };
}

export default connect()(ChatForm);
