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
  //get bowling table of both innigins
  //get name and wickets of every player
  let bothBowlerTable = selTool(".table.bowler");
  console.log(bothBowlerTable.length);
  let tableHtml = "";
  let hwt=0;
  for (let i = 0; i < bothBowlerTable.length; i++) {
    //tableHtml += selTool(bothBowlerTable[i]).html();
    let playersRow = selTool(bothBowlerTable[i]).find("tbody tr")
    for(let j =0 ; j<playersRow.length;j++){
        let allClmOfPlayer = selTool(playersRow[j]).find("td");
        let name = selTool(allClmOfPlayer[0]).text();
        let wicket = selTool(allClmOfPlayer[4]).text();
        console.log("name : ", name,"\t|| wickets : ",wicket)
        if(hwkt<=Number.parseInt(wicket)){
            
        }
    }
    console.log("====================================")

  }


}
