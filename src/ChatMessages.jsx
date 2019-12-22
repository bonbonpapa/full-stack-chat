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
        {e.username}:{e.message}
      </li>
    );
    return (
      <div>
        <ul>
          {this.props.messages.map((e, idx) => {
            return msgToElement(e, idx);
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
