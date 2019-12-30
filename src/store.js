import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, isAdmin: action.content };
  }
  if (action.type === "login-off") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "init-room") {
    return {
      ...state,
      msgs: { ...state.msgs, [action.roomName]: [] },
      directMessages: {
        ...state.directMessages,
        [action.roomName]: []
      }
    };
    //In ES6, you can do like this.
    // var key = "name";
    // var person = {[key]:"John"};
    // console.log(person); // should print  Object { name="John"}
  }
  if (action.type === "set-messages") {
    return {
      ...state,
      msgs: { ...state.msgs, [action.roomName]: action.messages },
      directMessages: {
        ...state.directMessages,
        [action.roomName]: action.directMessages
      }
    };
  }
  return state;
};
const store = createStore(
  reducer,
  {
    msgs: {},
    loggedIn: false,
    isAdmin: false,
    directMessages: {}
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
