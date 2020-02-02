var {styles} = require("../styles");
const {toUnicode} = require("./toUnicode");

exports.sendHelp = function (req, res) {
  var string = "";

  for (var style in styles) {
    string += `*${style}:* ${toUnicode("abc", style)}\n`
  }

  var obj = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Welcome to Text Styles! You can use any of the styles below in your slash command:",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": string
        }
      },
      {
        "type": "actions",
        "elements": [{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Got it",
						"emoji": true
					},
					"value": "close"
				}]
      }
    ]
  }
  res.send(obj);
}

exports.handleMessageRequest = function (req, res) {
  var user = req.body.user_name;
  // if user hasn't specified a style, use that style
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

    var styledText = toUnicode(text, styleName);

    // var block = {
    //   "type": "section",
    //   "text": {
    //     "type": "mrkdwn",
    //     "text": `*${styleName}:* ${styledText}`
    //   },
    //   "accessory": {
    //     "type": "button",
    //     "text": {
    //       "type": "plain_text",
    //       "text": "Send Message",
    //       "emoji": true
    //     },
    //     "value": styledText
    //   }
    // };
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