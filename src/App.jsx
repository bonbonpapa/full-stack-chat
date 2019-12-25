import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);

    // do the authentification in the constructor of the App. If the cookied existed, server return the success
    // update the state
    this.authenInitial();
  }

  authenInitial = async () => {
    let response = await fetch("/auth");
    let responseBody = await response.text();
    console.log("responseBody from login", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (body.success) {
      this.props.dispatch({
        type: "login-success"
      });
    }
  };
  render = () => {
    if (this.props.lgin) {
      return (
        <div>
          <ChatMessages />
          <ChatForm />
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
  return { lgin: state.loggedIn };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
