import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.internvalMessage = setInterval(this.updateMessages, 500);
  };
  componentWillUnmount = () => {
    clearInterval(this.internvalMessage);
  };
  updateMessages = async () => {
    let response = await fetch("/messages?roomName=" + this.props.roomName);
    let responseBody = await response.text();
    console.log("response from messages", responseBody);
    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    if (parsed.success) {
      this.props.dispatch({
        type: "set-messages",
        roomName: this.props.roomName,
        messages: parsed.messages,
        directMessages: parsed.directMessages
      });
    } else {
      this.props.dispatch({
        type: "login-off"
      });
    }
  };
  render = () => {
    let msgToElement = (e, idx) => (
      <li key={e.username + idx} className="message">
        {e.username} Posted at {new Date(e.msgtime).toLocaleTimeString()} :
        {e.message}
        {e.imgs_path === undefined || e.imgs_path.length === 0 ? (
          ""
        ) : (
          <div>
            <img src={e.imgs_path[0]} height="100px"></img>
          </div>
        )}
      </li>
    );
    const usertoElement = (e, idx) => <li key={e + idx}>{e}</li>;

    //based on the returned messages list to generate the active users who have posts

    console.log(
      "messages in the ChatMessages component props",
      this.props.messages
    );
    console.log(
      "Direct messages in ChatMessages component props",
      this.props.directMessages
    );
    let roomMessages = this.props.messages[this.props.roomName];
    let roomdirectMessages = this.props.directMessages[this.props.roomName];

    if (roomMessages === undefined) {
      console.log("the messages is empty");
      roomMessages = [];
    }
    if (roomdirectMessages === undefined) {
      console.log("direct messages are empty");
      roomdirectMessages = [];
    }

    const activeUsers = roomMessages.reduce((acc, message) => {
      const timestamp = new Date(message.msgtime);
      if (Date.now() - timestamp.valueOf() <= 10000)
        acc[message.username] = true;
      return acc;
    }, {});
    console.log("Active users list", activeUsers);

    return (
      <div>
        <h3>Messages</h3>
        <ul>
          {roomMessages.map((e, idx) => {
            return msgToElement(e, idx);
          })}
        </ul>
        <h3>Direct Messages</h3>
        <ul>
          {roomdirectMessages.map((e, idx) => {
            return msgToElement(e, idx);
          })}
        </ul>
        <h3>Active Users</h3>
        <ul>
          {Object.keys(activeUsers).map((e, idx) => {
            return usertoElement(e, idx);
          })}
        </ul>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs,
    directMessages: state.directMessages
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
