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

  handleSubmit = event => {
    event.preventDefault();
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

export default connect()(AdminForm);
