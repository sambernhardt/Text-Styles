const express = require("express");
const toUnicode = require("to-unicode");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/slack/request", (req, res) => {
  var type = req.body.text.split(" ")[0];
  var text = req.body.text.split(" ").slice(1).join(" ");
  var styledText = toUnicode(text, type);

  console.log(req.body);
  console.log(type);
  console.log(text);
  console.log(styledText);

  var obj = {
    "text": styledText,
    "response_type": "in_channel"
  }
  res.send(obj);
})


app.listen( process.env.PORT || 8080, function() {
  console.log("Listening on port");
});
