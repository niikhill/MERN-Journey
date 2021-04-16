let request = require("request");
let cheerio = require("cheerio");
let url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
request(url, cb);

function cb(err, response, html) {
  if (err) {
    console.log("response " + response);
    console.log("error" + err);
  } else {
    extractData(html);
  }
}

function extractData(html) {
  let selTool = cheerio.load(html);
  let fullscorelink = selTool(".match-info-link-FIXTURES");
  for (let i = 0; i < fullscorelink.length; i++) {
    let linl = selTool(fullscorelink[i]).attr("href");
    let final_link = "https://www.espncricinfo.com" + linl;
    //console.log(final_link);
    printMOM(final_link);
  }
}

function printMOM(final_link) {
  request(final_link, cb);
  function cb(err, response, html) {
    if (err) {
      console.log("error" + err);
    } else {
      getMOM(html);
      console.log("==========================================================");
    }
  }
}

function getMOM(html) {
  let selTool = cheerio.load(html);
  let player = selTool(".best-player-name");
  let bTeam = selTool(".best-player-team-name");
  let name = player.text();
  let tname = bTeam.text();
  console.log("Best Player Name => "+ name + " OF " + tname);
}
