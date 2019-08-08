const express = require("express");
const bodyParser = require("body-parser");

const {sendHelp, handleMessageRequest} = require('./helpers/message.js');
const {handleInteraction} = require('./helpers/interaction.js');
require("dotenv").config();

// SETUP
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post("/slack/request", (req, res) => {
  res.status(200);

  if (req.body.text.split(" ")[0] == "help") {
    sendHelp(req,res);
  } else {
    handleMessageRequest(req,res);
  }
})

app.post("/slack/interaction", (req, res) => {
  handleInteraction(req,res);
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
