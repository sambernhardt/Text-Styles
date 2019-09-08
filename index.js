const express = require("express");
const bodyParser = require("body-parser");

const {sendHelp, handleMessageRequest} = require('./helpers/message.js');
const {handleInteraction} = require('./helpers/interaction.js');
const {handleOauth, getToken} = require('./helpers/oauth.js');
require("dotenv").config();

// LowDB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync('db.json');
const db = low(adapter);

// Setup
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
require("dotenv").config();

app.post("/slack/request", (req, res) => {
  res.status(200);
  var firstWord = req.body.text.split(" ")[0];

  if (firstWord == "help") {
    sendHelp(req,res);
  } else {
    handleMessageRequest(req,res);
  }
})

app.post("/slack/interaction", (req, res) => {
  handleInteraction(req,res);
})

app.get('/oauth', function(req, res){
  handleOauth(req,res);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
