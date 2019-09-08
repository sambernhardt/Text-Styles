const request = require("request");
const dateFormat = require("dateformat");

// LowDB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync('db.json');
const db = low(adapter);


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

          writeToken({
            id: teamID,
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

function writeToken(data) {
  var existingEntry = db.get("workspaces").find({id: data.id}).value();

  if (!existingEntry) {
    db.get("workspaces").push(data).write();
    console.log(`Wrote token with ID: ${data.id} and domain ${data.domain}`);
  } else {
    var now = new Date(existingEntry.date_added);
    var date = dateFormat(now, "dddd, mmmm, dS, yyyy, at h:MM:ss TT")
    console.log(`The workspace: ${data.domain}) already has a database entry that was created on ` + date);
  }
}

exports.getToken = function(workspaceID, callback) {
  var entry = db.get("workspaces").find({id: workspaceID}).value();
  callback(entry)
}
