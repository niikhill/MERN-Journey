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
  let = teamNameArr=[];
  let teamArr = selTool(".Collapsible h5");
  for(let i = 0;i<teamArr.length;i++){
        let teamName = selTool(teamArr[i]).text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        teamNameArr.push(teamName)
        //console.log(teamNameArr);
  }
  let bothBatTable = selTool(".table.batsman");
  let batsmanhtml = "";
  for(let i = 0 ; i<bothBatTable.length;i++){
      let singleTeamAllRows = selTool(bothBatTable[i]).find("tbody tr");
      for(let j =0; j<singleTeamAllRows.length;j++){
        let allcols = selTool(singleTeamAllRows[j]).find("td");
        if(allcols.length==8){
            let playerName = selTool(allcols[0]).text();
            console.log(playerName+"\t"+"of\t"+teamNameArr[i]);
        }
      } 
      console.log("====================================")
  }
  

}
