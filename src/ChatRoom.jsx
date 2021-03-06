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
        <div className="chat-header clearfix">
          <img
            src="http://icons.iconarchive.com/icons/simplefly/simple-green-social-media/256/social-media-chat-icon.png"
            alt="avatar"
          />
          <div className="chat-about">
            <div className="chat-with">{this.props.roomName}</div>
          </div>
        </div>

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
