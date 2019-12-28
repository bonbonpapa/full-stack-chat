let express = require("express");
let multer = require("multer");
//let upload = multer();
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
reloadMagic(app);
app.use("/", express.static("build"));
app.use("/images", express.static(__dirname + "/uploads"));

app.get("/auth", function(req, res) {
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  if (user === undefined) {
    return res.send(JSON.stringify({ success: false }));
  }
  res.send(JSON.stringify({ success: true, isAdmin: user === "admin." }));
});
app.get("/messages", function(req, res) {
  const user = sessions[req.cookies["sid"]];

  if (user !== undefined) {
    const aLength = messages.length;
    if (aLength > 20) {
      res.send(
        JSON.stringify({
          success: true,
          messages: messages.slice(aLength - 20)
        })
      );
      return;
    } else res.send(JSON.stringify({ success: true, messages: messages }));
  } else
    res.send(
      JSON.stringify({
        success: false,
        messages: []
      })
    );
});
app.post("/newmessage", upload.array("images", 9), (req, res) => {
  console.log("*** inside new message");
  console.log("body", req.body);

  let files = req.files;
  console.log("uploaded files", files);
  let frontendPaths;

  frontendPaths = files.map(file => {
    return "/images/" + file.filename;
  });
  console.log(frontendPaths);

  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  const msg = req.body.msg;
  //const img_path = req.body.images;
  const time = req.body.date;
  let newMsg = {
    username: username,
    message: msg,
    msgtime: time,
    imgs_path: frontendPaths
  };
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
    res.cookie("sid", sessionId, {
      expires: new Date(Date.now() + 900000)
    });

    // to update the messages with new user log in messages
    const time = new Date();
    let newMsg = { username: username, message: "Just log in", msgtime: time };
    console.log("new message", newMsg);
    messages = messages.concat(newMsg);
    console.log("updated messages", messages);
    // send the response
    const isAdmin = username === "admin.";
    if (isAdmin) console.log("The user is the admin");
    else console.log("the user is NOT admin");
    res.send(JSON.stringify({ success: true, isAdmin: isAdmin }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

app.post("/kickuser", upload.none(), (req, res) => {
  console.log("**** I'm in the kick off user endpoint");
  console.log("this is the body", req.body);
  const usertokick = req.body.usertokick;
  console.log("sessions before delete", sessions);
  // to delete the usertokick property from the object sessions, "sid": usertokick
  const sidtokick = Object.keys(sessions)[
    Object.values(sessions).indexOf(usertokick)
  ];
  delete sessions[sidtokick];
  console.log("sessions after kickoff", sessions);
  // to update the messages with new user kick off message
  const time = new Date();
  let newMsg = {
    username: usertokick,
    message: "Just kick off",
    msgtime: time
  };
  console.log("new message for the kick off information", newMsg);
  messages = messages.concat(newMsg);

  res.send(JSON.stringify({ success: true }));
});
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
