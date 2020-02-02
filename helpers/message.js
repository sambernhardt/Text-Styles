var {styles} = require("../styles");
const {toUnicode} = require("./toUnicode");

exports.sendHelp = function (req, res) {
    var obj = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Type your message after the command and select one of the styled options to send your message.\nEg. `/style this is cool` => `𝖙𝖍𝖎𝖘 𝖎𝖘 𝖈𝖔𝖔𝖑`"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "To only style 𝖘𝖕𝖊𝖈𝖎𝖋𝖎𝖈 words in your message, bold those words in your slash command.\nEg. `/style this is *cool*` => `this is 𝖈𝖔𝖔𝖑`"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Got it!",
                "emoji": true
              },
              "value": "close"
            }
          ]
        }
      ]
  }
  res.send(obj);
}

exports.handleMessageRequest = function (req, res) {
  var user = req.body.user_name;
  var text = req.body.text.split(" ").join(" ");
  var obj = {
    "blocks": [
      {
        "type": "actions",
        "elements": []
      }
    ]
  }

  for (styleName in styles) {
    let styledText;
    if (text.match(/\*[^\*]*\*/)) {
      var pulledText = text.match(/\*[^\*]*\*/)[0].replace(/\*/g,"");
      styledText = text.replace(/\*[^\*]*\*/, toUnicode(pulledText, styleName));
    } else {
      styledText = toUnicode(text, styleName);
    }
    var block = {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": styledText,
        "emoji": true
      },
      "value": styledText
    }
    obj.blocks[0]["elements"].push(block)
  }

  obj.blocks.push(
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Need help? Use `/style help`"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Discard",
          "emoji": true
        },
        "style": "danger",
        "value": "close"
      }
    }
  )
  res.send(obj);
}