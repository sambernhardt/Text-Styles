const axios = require('axios');
const {getToken} = require('./oauth.js');

exports.handleInteraction = function(req, res) {
  res.status(200);
  var payload = JSON.parse(req.body.payload);
  // console.log(payload);
  var channel = payload.container.channel_id;
  var message = payload.actions[0].value;
  var teamID = payload.team.id;

  // Post message as user
  // retrieve token for workspace from
  getToken(teamID, function(data) {

    var obj = {
      "channel": channel,
      "text": message,
      "as_user": true,
    };

    var options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + data.token
      },
      data: JSON.stringify(obj),
      url: "https://slack.com/api/chat.postMessage"
    };

    axios(options)
      .then(res => {
        console.log("Successfully posted message: " + message);

        // delete original
        // axios.post(payload.response_url, {
        //     "delete_original": "true"
        //   })
        //   .then(res => {
        //     console.log("Deleting confirmation block");
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   })
      })
      .catch(error => {
        console.log(error);
      })

  })
}
