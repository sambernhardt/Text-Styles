const express = require("express");
const toUnicode = require("to-unicode");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({
  extended: true
}));

let channel_id, message;
let helpList = "circled: ⓐⓑⓒ\rcircledNeg: 🅐🅑🅒\rfullWidth: ａｂｃ\rmathBold: 𝐚𝐛𝐜\rmathBoldFraktur: 𝖆𝖇𝖈\rmathBoldItalic: 𝒂𝒃𝒄\rmathBoldScript: 𝓪𝓫𝓬\rmathDouble: 𝕒𝕓𝕔\rmathMono: 𝚊𝚋𝚌\rmathSans: 𝖺𝖻𝖼\rmathSansBold: 𝗮𝗯𝗰\rmathSansBoldItalic: 𝙖𝙗𝙘\rmathSansItalic: 𝘢𝘣𝘤\rparenthesized: ⒜⒝⒞\rsquared: 🄰🄱🄲\rsquaredNeg: 🅰🅱🅲\rrockDots: äḅċ\rsmallCaps: ᴀʙᴄ\rstroked: Ⱥƀȼ\rinverted: ɐqɔ\rreversed: Adↄ-\r";

app.post("/slack/request", (req, res) => {
  // res.status(200).end();
  var type = req.body.text.split(" ")[0];
  var text = req.body.text.split(" ").slice(1).join(" ");

  if (type == "help") {
    var obj = {
      "blocks": [{
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Welcome to Funky Text! You can use any of the styles below in your slash command:",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": helpList
          }
        }
      ]
    }

    res.send(obj)
  } else {



    var styledText = toUnicode(text, type);

    channel_id = req.body.channel_id;
    message = styledText;

    console.log(req.body);
    // console.log(type);
    // console.log(text);
    // console.log(styledText);

    var obj = {
      "blocks": [{
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "You requested that we convert: *" + styledText + "* with the style: _" + type + "_"
        }
      }, {
        "type": "actions",
        "elements": [{
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Send styled text",
            "emoji": true
          },
          "value": "send_text"
        }]
      }]
    }
    res.send(obj);

  }
})

app.post("/slack/interaction", (req, res) => {
  res.status(200).end();
  var payload = JSON.parse(req.body.payload);
  // console.log(payload);
  // console.log(JSON.stringify(JSON.parse(payload), null, 4));

  var obj = {
    "channel": channel_id,
    "text": message,
    "as_user": true,
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

  axios.post(payload.response_url, {
      "delete_original": "true"
    })
    .then(res => {
      console.log("Status: " + res.statusCode);
    })
    .catch(error => {
      console.log(error);
    })

  axios(options)
    .then(res => {
      console.log("Status: " + res.statusCode);
      // console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    })
})


app.listen(process.env.PORT || 8080, function() {
  console.log("Listening on port");
});
