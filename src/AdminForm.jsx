import React, { Component } from "react";
import { connect } from "react-redux";

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = { kickuser: "" };
  }
  handleKickUser = event => {
    this.setState({ kickuser: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const usertokick = window.prompt("who do you want to kick");
    this.setState({ kickuser: usertokick });
    console.log(this.state);

    let data = new FormData();
    data.append("usertokick", this.state.kickuser);
    let response = await fetch("/kickuser", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("response Body from kick off users", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>User to kick</label>
            <input
              onChange={this.handleKickUser}
              type="text"
              value={this.state.kickuser}
            />
          </div>
          <input type="submit" />
        </form>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn, isAdmin: state.isAdmin };
};
export default connect(mapStateToProps)(AdminForm);
