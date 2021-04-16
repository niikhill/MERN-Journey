//Get Last Ball commentry from a web Page
let request = require('request');
let cheerio = require('cheerio');
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/ball-by-ball-commentary"
request(url , cb);
function cb(err,response,html){
    if(err){
        console.log("response "+response)
        console.log("error" + err);

    }else{
        extractData(html);
        
    }  
}

function extractData(html){
    let selTool = cheerio.load(html);
    let commentaryArr = selTool(".col-14.col-md-15.col-lg-14 .match-comment-long-text");
    //console.log(commentaryArr.length);
    //cheerio index
    let lbc = selTool(commentaryArr[0]).text();
    console.log(lbc);
}

