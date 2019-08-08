const axios = require('axios');

exports.handleInteraction = function(req, res) {
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
}
