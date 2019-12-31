import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ChatRoom from "./ChatRoom.jsx";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);

    // do the authentification in the constructor of the App. If the cookied existed, server return the success
    // update the state
    this.authenInitial();
    // Question to ask:
    // in the constuctor, the auth will be complted so that isAdmin will be updated to true for admin user
    // but actually, the isAdmin state not updated in the first render, only when the manual reload the page, the state will be udpdated.
  }
  componentDidMount() {
    this.internvalChatroom = setInterval(this.updateChatRooms, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.internvalChatroom);
  }

  authenInitial = async () => {
    let response = await fetch("/auth");
    let responseBody = await response.text();
    console.log("responseBody from login", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (body.success) {
      this.props.dispatch({
        type: "login-success",
        content: body.isAdmin
      });
    }
  };

  InitChatRoom = async roomName => {
    let data = new FormData();
    data.append("roomName", roomName);

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
        type: "add-room",
        roomName: roomName
      });
    }
  };

  handleAddChatRoom = () => {
    let nameEntered = window.prompt("What is the name of Chat Room?");
    console.log("This is what the user entered", nameEntered);

    this.InitChatRoom(nameEntered);
  };
  updateChatRooms = async () => {
    let response = await fetch("/roomslist");
    let responseBody = await response.text();
    console.log("response from rooms list ", responseBody);
    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    console.log("rooms list", parsed.roomsList);

    if (parsed.success) {
      let filterRooms = parsed.roomsList.filter(room => {
        return !this.props.roomNames.includes(room);
      });
      filterRooms.forEach(newRoom => {
        this.props.dispatch({
          type: "add-room",
          roomName: newRoom
        });
      });
    }

    // let newroomState = {
    //   ChatRooms: [],
    //   roomNames: [],
    //   msgs: {},
    //   directMessages: {}
    // };

    // if (parsed.success) {
    //   parsed.roomsList.forEach(room => {
    //     newroomState = {
    //       ...newroomState,
    //       ChatRooms: newroomState.ChatRooms.concat(
    //         <ChatRoom roomName={room} />
    //       ),
    //       roomNames: newroomState.roomNames.concat(room),
    //       msgs: { ...newroomState.msgs, [room]: [] },
    //       directMessages: {
    //         ...newroomState.directMessages,
    //         [room]: []
    //       }
    //     };
    //   });

    // this.props.dispatch({
    //   type: "set-rooms",
    //   initialroomState: newroomState
    // });
    // }
  };

  render = () => {
    console.log("In App");
    if (this.props.isAdmin) console.log("this is the admin user");
    else console.log("this is NOT admin user");

    if (this.props.lgin) {
      // in the app render beginning, to fetch the list of the ChatRoom (room Names) and create the list of the ChatRooms components
      // and update the state of the, concat the array of [</Chatroom>]

      return (
        <div>
          {this.props.ChatRooms}
          <button onClick={this.handleAddChatRoom}>Create Chat Room</button>
        </div>
      );
    }
    return (
      <div>
        <h1>Signup</h1>
        <Signup />
        <h1>Login</h1>
        <Login />
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    isAdmin: state.isAdmin,
    ChatRooms: state.ChatRooms,
    roomNames: state.roomNames
  };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
