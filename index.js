const express = require("express");
const toUnicode = require("to-unicode");
const bodyParser = require("body-parser");
const axios = require('axios')

const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));

let channel_id, message;

app.post("/slack/request", (req, res) => {
  // res.status(200).end();
  var type = req.body.text.split(" ")[0];
  var text = req.body.text.split(" ").slice(1).join(" ");
  var styledText = toUnicode(text, type);

  channel_id = req.body.channel_id;
  message = styledText;

  console.log(req.body);
  // console.log(type);
  // console.log(text);
  // console.log(styledText);

  var obj = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "You requested that we convert: *" + styledText + "* with the style: _" + type + "_"
        }
      }, {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Send styled text",
              "emoji": true
            },
            "value": "send_text"
          }
        ]
      }
    ]
  }
  res.send(obj);
})

app.post("/slack/interaction", (req, res) => {
  res.status(200).end();
  var payload = JSON.parse(req.body.payload);
  // console.log(payload);
  // console.log(JSON.stringify(JSON.parse(payload), null, 4));

  var obj = {
    "channel": channel_id,
    "text": message,
    "as_user": true
  };

  var options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": "Bearer " + process.env.TOKEN
    },
    data: JSON.stringify(obj),
    url: "https://slack.com/api/chat.postMessage"
  };

  axios(options)
    .then(res => {
      console.log("Status: " + res.statusCode);
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    })
})


app.listen( process.env.PORT || 8080, function() {
  console.log("Listening on port");
});
