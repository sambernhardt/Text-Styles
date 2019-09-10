const request = require("request");
const dateFormat = require("dateformat");
const firebaseAdmin = require('firebase-admin');

exports.handleOauth = function(req, res) {

  let data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };

  request.post('https://slack.com/api/oauth.access', data, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // You are done.
      // If you want to get team info, you need to get the token here
      let token = JSON.parse(body).access_token; // Auth token

      request.post('https://slack.com/api/team.info', {
        form: {
          token: token
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let teamDomain = JSON.parse(body).team.domain;
          let teamID = JSON.parse(body).team.id;
          const date = new Date();

          writeToken(teamID, {
            token: token,
            domain: teamDomain,
            date_added: date.getTime()
          });

          res.redirect('https://mothcoclothing.slack.com/apps/AM4EK1KL0-text-styles');
          // res.redirect('http://' + teamDomain + '.slack.com');
        }
      });
    }
  })
}

function writeToken(id, data) {
  firebaseAdmin.database().ref('workspaces/' + id).set(data, function() {
    console.log(`Wrote token with ID: ${id} and domain ${data.domain}`);
  });
}

exports.getToken = function(workspaceID, callback) {
  firebaseAdmin.database().ref('workspaces/'+workspaceID).once('value')
    .then(function(snapshot) {
      var data = snapshot.val();
      callback(data);
    })
}
