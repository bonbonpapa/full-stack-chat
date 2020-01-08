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
                <img
                  src="http://icons.iconarchive.com/icons/simplefly/simple-green-social-media/256/social-media-chat-icon.png"
                  alt="avatar"
                />
                <div className="about">
                  <div className="name">
                    <Link to={"/room/" + room}>{room}</Link>
                  </div>
                  <div className="status">
                    <i className="fa fa-circle online">online</i>
                  </div>
                </div>
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
