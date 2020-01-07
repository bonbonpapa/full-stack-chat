import React, { Component } from "react";
import { connect } from "react-redux";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import AdminForm from "./AdminForm.jsx";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    console.log("Instantiating");
  }

  render = () => {
    console.log("In Chat Room Components");
    if (this.props.isAdmin) console.log("this is the admin user");
    else console.log("this is NOT admin user");

    return (
      <div className="chat">
        <h1>{this.props.roomName}</h1>
        <ChatMessages roomName={this.props.roomName} />
        <ChatForm roomName={this.props.roomName} />
        <AdminForm roomName={this.props.roomName} />
      </div>
    );
  };
}

let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
export default connect(mapStateToProps)(ChatRoom);
