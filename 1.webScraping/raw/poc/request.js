let request = require('request');
let cheerio = require('cheerio');
request("https://google.com" , cb);
function cb(err,response,html){
    if(err){
        console.log("response "+response)
        console.log("error" + err);

    }else{
        extractData(html);
        
    }
    function extractData(html){
        let selTool = cheerio.load(html);
        let elem = selTool("#SIvCob");
        console.log(elem.text());
    }
}