const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

// FIREBASE
const firebaseAdmin = require('firebase-admin');

const {sendHelp, handleMessageRequest} = require('./helpers/message.js');
const {handleInteraction} = require('./helpers/interaction.js');
const {handleOauth, getToken} = require('./helpers/oauth.js');
require("dotenv").config();

// SETUP
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: 'https://text-styles-slack-bot.firebaseio.com'
});

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

app.get('/', function(req, res){
  res.send("Working!")
});

app.get('/oauth', function(req, res){
  handleOauth(req,res);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
