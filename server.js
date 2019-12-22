let express = require("express");
let multer = require("multer");
let upload = multer();
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
reloadMagic(app);
app.use("/", express.static("build"));
app.get("/messages", function(req, res) {
  const user = sessions[req.cookies["sid"]];

  if (user !== undefined) {
    const aLength = messages.length;
    if (aLength > 20) {
      res.send(JSON.stringify(messages.slice(aLength - 20)));
      return;
    } else res.send(JSON.stringify(messages));
  } else
    res.send(
      JSON.stringify({
        success: false,
        error: "no valid username found, login please"
      })
    );
});
app.post("/newmessage", upload.none(), (req, res) => {
  console.log("*** inside new message");
  console.log("body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  let msg = req.body.msg;
  let newMsg = { username: username, message: msg };
  console.log("new message", newMsg);
  messages = messages.concat(newMsg);
  console.log("updated messages", messages);
  res.send(JSON.stringify({ success: true }));
});
app.post("/clearmessages", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  const newMessages = messages.filter(msg => {
    return msg.username !== username;
  });
  messages = newMessages;
  console.log("clear messages", messages);
  res.send(JSON.stringify({ success: true }));
});
app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log("this is the parsed body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  console.log("expected password", expectedPassword);
  if (enteredPassword === expectedPassword) {
    console.log("password matches");
    let sessionId = generateId();
    console.log("generated id", sessionId);
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    // to update the messages with new user log in messages
    let newMsg = { username: username, message: "Just log in" };
    console.log("new message", newMsg);
    messages = messages.concat(newMsg);
    console.log("updated messages", messages);
    // send the response
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};
app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  if (passwords[username] !== undefined) {
    res.send(JSON.stringify({ success: false, error: "Username taken!" }));
    return;
  }
  passwords[username] = enteredPassword;

  console.log("passwords object", passwords);
  res.send(JSON.stringify({ success: true }));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000);
