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
let messages = {};
const directMessages = {};
let roomsList = [];
const adminUser = "admin.";

reloadMagic(app);
app.use("/", express.static("build"));
app.use("/images", express.static(__dirname + "/uploads"));

app.get("/auth", function(req, res) {
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  if (user === undefined) {
    return res.send(JSON.stringify({ success: false }));
  }
  res.send(JSON.stringify({ success: true, isAdmin: user === adminUser }));
});
app.get("/messages", function(req, res) {
  const user = sessions[req.cookies["sid"]];
  const roomName = req.query.roomName;
  //console.log("Messages updates query from", roomName);

  if (user !== undefined) {
    const aLength = messages.length;
    if (aLength > 20) {
      res.send(
        JSON.stringify({
          success: true,
          messages: messages[roomName].slice(aLength - 20),
          directMessages: directMessages[roomName][user]
        })
      );
      return;
    } else
      res.send(
        JSON.stringify({
          success: true,
          messages: messages[roomName],
          directMessages: directMessages[roomName][user]
        })
      );
  } else
    res.send(
      JSON.stringify({
        success: false,
        messages: []
      })
    );
});

app.get("/roomslist", function(req, res) {
  const user = sessions[req.cookies["sid"]];

  if (user !== undefined) {
    res.send(
      JSON.stringify({
        success: true,
        roomsList: roomsList
      })
    );
  } else {
    res.send(
      JSON.stringify({
        success: false,
        roomsList: []
      })
    );
  }
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

  const time = req.body.date;
  let newMsg = {
    username: username,
    message: msg,
    msgtime: time,
    imgs_path: frontendPaths
  };
  console.log("new message", newMsg);
  let room = req.body.roomName;
  messages[room] = messages[room].concat(newMsg);

  console.log("updated messages", messages);
  res.send(JSON.stringify({ success: true }));
});

app.post("/direct-message", upload.none(), (req, res) => {
  console.log("Inside direct message");
  console.log("body", req.body);

  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const recipient = req.body.recipient;
  const roomName = req.body.roomName;

  const newMsg = {
    username: username,
    message: req.body.msg,
    msgtime: req.body.timestamp,
    imgs_path: []
  };
  directMessages[roomName][recipient].push(newMsg);
  res.send(JSON.stringify({ success: true }));
});

app.post("/clearmessages", upload.none(), (req, res) => {
  console.log("**** I'm in the clear messages endpoint");
  console.log("this is the body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  const roomName = req.body.roomName;
  console.log("roomName", roomName);

  const newMessages = messages[roomName].filter(msg => {
    return msg.username !== username;
  });
  messages[roomName] = newMessages;
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

    //to update the messages with new user log in messages in every chatroom
    const time = new Date();
    let newMsg = { username: username, message: "Just log in", msgtime: time };
    console.log("new message", newMsg);

    for (let i = 0; i < roomsList.length; i++) {
      let room = roomsList[i];
      messages[room] = messages[room].concat(newMsg);
    }

    // send the response
    const isAdmin = username === adminUser;
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
  if (sessions[sidtokick] === undefined) {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  delete sessions[sidtokick];
  console.log("sessions after kickoff", sessions);
  // to update the messages with new user kick off message
  const time = new Date();
  let newMsg = {
    username: adminUser,
    message: usertokick + " was just kicked off by admin",
    msgtime: time
  };
  console.log("new message for the kick off information", newMsg);
  // show the messages of kick off the user in all the chat rooms
  roomsList.forEach(room => {
    messages[room] = messages[room].concat(newMsg);
  });
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

  // need to initialize the direct messages for this particular user as this is user specific
  let rooms = Object.keys(directMessages);
  for (let i = 0; i < rooms.length; i++) {
    let roomName = rooms[i];
    directMessages[roomName][username] = [];
  }

  console.log("passwords object", passwords);
  res.send(JSON.stringify({ success: true }));
});
app.post("/newroom", upload.none(), (req, res) => {
  console.log("**** I'm in the new chat room endpoint");
  console.log("this is the body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  const roomName = req.body.roomName;
  console.log("Room Name ", roomName);
  roomsList.push(roomName);

  // need to initialize the direct messages for this particular user as this is user specific
  directMessages[roomName] = {};
  let users = Object.keys(passwords);
  console.log("users current", users);
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    directMessages[roomName][user] = [];
  }
  console.log("direct messages after init", directMessages);
  messages[roomName] = [];

  res.send(JSON.stringify({ success: true }));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000);
