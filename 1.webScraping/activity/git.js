let request = require("request");
let cheerio = require("cheerio");
let url = "https://github.com/topics";
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractData(html);
  }
}

function extractData(html) {
  let linkArray = [];
  let nameArray=[];
  let selTool = cheerio.load(html);
  let topicurlarr = selTool(
    ".no-underline.d-flex.flex-column.flex-justify-center"
  );
  let  topicNameArr = selTool(".f3.lh-condensed.text-center.Link--primary.mb-0.mt-1")
  for (let i = 0; i < topicurlarr.length; i++) {
    let Name=selTool(topicNameArr[i]).text();
    let link = selTool(topicurlarr[i]).attr("href");
    let full_link = "https://github.com" + link;
    //console.log("Name-> " + Name + " Link-> " +full_link);
   // nameArray.push(Name);
    //linkArray.push(full_link);
    console.log(full_link)
  }
  //print(linkArray, 0,nameArray);
}

function print(linkArray, n,nameArray) {
  if (n == linkArray.length) {
    return;
  } else {
    request(linkArray[n], cb);
    function cb(err, response, html) {
      if (err) {
        console.log("error" + err);
      } else {
        getRepoNames(html,nameArray);
        print(linkArray, n + 1);
        console.log(
          "=========================================================="
        );
      }
    }
  }
}
function getRepoNames(html,nameArray){
    let selTool = cheerio.load(html);
    let rawrepodata = selTool(".f3.color-text-secondary.text-normal.lh-condensed a");
    for(let i=0;i<3;i++){
        //let repolink=nameArray[i];
        let rtext=selTool(rawrepodata[i]).text();
        //let repolink= selTool(rawrepodata[i]).attr("herf");
        console.log(rtext)
    }
}