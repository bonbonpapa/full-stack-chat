import React, { Component } from "react";
import { connect } from "react-redux";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import AdminForm from "./AdminForm.jsx";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    console.log("Instantiating");

    console.log("Before the first render");
    let nameEntered = window.prompt("What is the name of Chat Room?");
    console.log("This is what the user entered", nameEntered);

    this.state = {
      roomName: nameEntered
    };
    console.log("Init of the room state with", this.state.roomName);

    console.log("Instantiating completed");
  }

  componentDidMount = () => {
    this.InitChatRoom();
  };

  InitChatRoom = async () => {
    let data = new FormData();
    data.append("roomName", this.state.roomName);

    let response = await fetch("/newroom", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("response from new chat room", responseBody);
    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    if (parsed.success) {
      this.props.dispatch({
        type: "init-room",
        roomName: this.state.roomName
      });
    }
  };

  render = () => {
    console.log("In Chat Room Components");
    if (this.props.isAdmin) console.log("this is the admin user");
    else console.log("this is NOT admin user");

    return (
      <div>
        <ChatMessages roomName={this.state.roomName} />
        <ChatForm roomName={this.state.roomName} />
        {this.props.isAdmin ? <AdminForm roomName={this.state.roomName} /> : ""}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return { lgin: state.loggedIn, isAdmin: state.isAdmin };
};
export default connect(mapStateToProps)(ChatRoom);
