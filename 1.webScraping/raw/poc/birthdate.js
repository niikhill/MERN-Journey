let request = require("request");
let cheerio = require("cheerio");
let url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
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
  let = teamNameArr = [];
  let teamArr = selTool(".Collapsible h5");
  for (let i = 0; i < teamArr.length; i++) {
    let teamName = selTool(teamArr[i]).text();
    teamName = teamName.split("INNINGS")[0];
    teamName = teamName.trim();
    teamNameArr.push(teamName);
  }
  let batsmantableArr = selTool(".table.batsman");
  for (let i = 0; i < batsmantableArr.length; i++) {
    let batsmannameanchor = selTool(batsmantableArr[i]).find(
      "tbody tr .batsman-cell a"
    );
    for (let j = 0; j < batsmannameanchor.length; j++) {
      let name = selTool(batsmannameanchor[j]).text();
      let link = selTool(batsmannameanchor[j]).attr("href");
      let teamName = teamNameArr[i];
      printBirthday(link, name, teamName);
    }
  }
}
function printBirthday(link, name, teamName) {
  request(link, cb);
  function cb(err, response, html) {
    if (err) {
      console.log("error" + err);
    } else {
      getBirthday(html, name, teamName);
      console.log("==========================================================");
    }
  }
}
function getBirthday(html, name, teamName) {
  let selTool = cheerio.load(html);
  let birthdayElem = selTool(".ciPlayerinformationtxt span");
  let birthday = selTool(birthdayElem[1]).text();
  console.log(name + " Plays for " + teamName + " Was born on " + birthday);
}
