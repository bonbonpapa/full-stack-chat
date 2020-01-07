import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div>
        <ul className="list">
          {this.props.roomNames.map(room => {
            return (
              <li className="clearfix">
                <Link to={"/room/" + room}>{room}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    roomNames: state.roomNames
  };
};
export default connect(mapStateToProps)(Navbar);
