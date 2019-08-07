const express = require("express");
const toUnicode = require("to-unicode");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({
  extended: true
}));

// let channel_id, message;
const helpList = "circled: ⓐⓑⓒ\rcircledNeg: 🅐🅑🅒\rfullWidth: ａｂｃ\rmathBold: 𝐚𝐛𝐜\rmathBoldFraktur: 𝖆𝖇𝖈\rmathBoldItalic: 𝒂𝒃𝒄\rmathBoldScript: 𝓪𝓫𝓬\rmathDouble: 𝕒𝕓𝕔\rmathMono: 𝚊𝚋𝚌\rmathSans: 𝖺𝖻𝖼\rmathSansBold: 𝗮𝗯𝗰\rmathSansBoldItalic: 𝙖𝙗𝙘\rmathSansItalic: 𝘢𝘣𝘤\rparenthesized: ⒜⒝⒞\rsquared: 🄰🄱🄲\rsquaredNeg: 🅰🅱🅲\rrockDots: äḅċ\rsmallCaps: ᴀʙᴄ\rstroked: Ⱥƀȼ\rinverted: ɐqɔ\rreversed: Adↄ-\r";
const helpListIndex = "circled,circledNeg,fullWidth,mathBold,mathBoldFraktur,mathBoldItalic,mathBoldScript,mathDouble,mathMono,mathSans,mathSansBold,mathSansBoldItalic,mathSansItalic,parenthesized,squared,squaredNeg,rockDots,smallCaps,stroked,inverted,reversed".split(",");

app.post("/slack/request", (req, res) => {
  res.status(200);
  var type = req.body.text.split(" ")[0];
  var text = req.body.text.split(" ").slice(1).join(" ");
  var user = req.body.user_name;

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

  // IF MESSAGE REQUEST
    var styledText = toUnicode(text, type);
    var style = type;
    console.log(`${user} requesting "${text}" in ${style} style`);

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
          "value": styledText
        }]
      }]
    }
    res.send(obj);
  }
})

app.post("/slack/interaction", (req, res) => {
  res.status(200);
  var payload = JSON.parse(req.body.payload);
  var channel = payload.container.channel_id;
  var message = payload.actions[0].value;

  // Post message as user
  var obj = {
    "channel": channel,
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

  axios(options)
    .then(res => {
      console.log("Successfully posted message: " + message);
    })
    .catch(error => {
      console.log(error);
    })

  // delete original
  axios.post(payload.response_url, {
      "delete_original": "true"
    })
    .then(res => {
      console.log("Deleting confirmation block");
    })
    .catch(error => {
      console.log(error);
    })
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
