import React, { Component } from "react";
import { connect } from "react-redux";

class AdminForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = async event => {
    event.preventDefault();
    const usertokick = window.prompt("who do you want to kick");

    let data = new FormData();
    data.append("usertokick", usertokick);

    let response = await fetch("/kickuser", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("response Body from kick off users", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("User not existed");
      return;
    }
    alert("User kicked off");
  };
  render = () => {
    if (this.props.isAdmin) {
      return (
        <div>
          <label>User type: admin</label>
          <button type="button" onClick={this.handleSubmit}>
            Kick off user
          </button>
        </div>
      );
    }
    return <div>User type: user</div>;
  };
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn, isAdmin: state.isAdmin };
};
export default connect(mapStateToProps)(AdminForm);
