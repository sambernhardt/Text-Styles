const helpList = "circled: ⓐⓑⓒ\rcircledNeg: 🅐🅑🅒\rfullWidth: ａｂｃ\rmathBold: 𝐚𝐛𝐜\rmathBoldFraktur: 𝖆𝖇𝖈\rmathBoldItalic: 𝒂𝒃𝒄\rmathBoldScript: 𝓪𝓫𝓬\rmathDouble: 𝕒𝕓𝕔\rmathMono: 𝚊𝚋𝚌\rmathSans: 𝖺𝖻𝖼\rmathSansBold: 𝗮𝗯𝗰\rmathSansBoldItalic: 𝙖𝙗𝙘\rmathSansItalic: 𝘢𝘣𝘤\rparenthesized: ⒜⒝⒞\rsquared: 🄰🄱🄲\rsquaredNeg: 🅰🅱🅲\rrockDots: äḅċ\rsmallCaps: ᴀʙᴄ\rstroked: Ⱥƀȼ\rinverted: ɐqɔ\rreversed: Adↄ-\r";
const helpListIndex = "circled,circledNeg,fullWidth,mathBold,mathBoldFraktur,mathBoldItalic,mathBoldScript,mathDouble,mathMono,mathSans,mathSansBold,mathSansBoldItalic,mathSansItalic,parenthesized,squared,squaredNeg,rockDots,smallCaps,stroked,inverted,reversed".split(",");
const toUnicode = require("to-unicode");

var blockList = true;


exports.sendHelp = function(req, res) {
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
  res.send(obj);
}

exports.handleMessageRequest = function(req, res) {

    // IF MESSAGE REQUEST
    var user = req.body.user_name;

    // if user hasn't specified a style, use that style
    
      var text = req.body.text.split(" ").join(" ");

      var obj = {
        "blocks": []
      }

      helpListIndex.forEach(styleName => {
        var styledText = toUnicode(text, styleName);

        var block = {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${styleName}:* ${styledText}`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Button",
              "emoji": true
            },
            "value": styledText
          }
        };

        obj.blocks.push(block)
      })

      res.send(obj);
}
