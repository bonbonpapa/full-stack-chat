import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    this.internvalMessage = setInterval(this.updateMessages, 500);
  };
  componentWillUnmount = () => {
    clearInterval(this.internvalMessage);
  };
  updateMessages = async () => {
    let response = await fetch("/messages");
    let responseBody = await response.text();
    console.log("response from messages", responseBody);
    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    this.props.dispatch({
      type: "set-messages",
      messages: parsed
    });
  };
  render = () => {
    let msgToElement = (e, idx) => (
      <li key={e.username + idx}>
        {e.username} Posted at {new Date(e.msgtime).toLocaleTimeString()} :{" "}
        {e.message}
      </li>
    );
    const usertoElement = (e, idx) => <li key={e + idx}>{e}</li>;

    //based on the returned messages list to generate the active users who have posts
    const activeUsers = this.props.messages.reduce((acc, message) => {
      const timestamp = new Date(message.msgtime);
      if (Date.now() - timestamp.valueOf() <= 10000)
        acc[message.username] = true;
      return acc;
    }, {});
    console.log(activeUsers);
    return (
      <div>
        <h3>Messages</h3>
        <ul>
          {this.props.messages.map((e, idx) => {
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
    messages: state.msgs
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
