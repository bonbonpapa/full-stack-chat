import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, isAdmin: action.content };
  }
  if (action.type === "login-off") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "set-messages") {
    return {
      ...state,
      msgs: action.messages,
      directMessages: action.directMessages
    };
  }
  return state;
};
const store = createStore(
  reducer,
  { msgs: [], loggedIn: false, isAdmin: false, directMessages: [] },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
