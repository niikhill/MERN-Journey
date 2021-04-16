let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const { contains } = require("cheerio");
const PDFDocument = require("pdfkit");
let pdfDoc = new PDFDocument();
let url = "https://github.com/topics";
let arr = [];
//let jsonFile = require('jsonfile');
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractData(html);
    createDir("./topics");
  }
}

function createDir(dirpath) {
  if (fs.existsSync(dirpath) == false) {
    fs.mkdirSync(dirpath);
  }
}

function fileCreator(fileName, fpath2) {
  let filepath = path.join(fpath2, fileName + ".json");
  if (fs.existsSync(filepath) == false) {
    fs.openSync(filepath, "w");
  }
}

function extractData(html) {
  let selTool = cheerio.load(html);
  let topicurlarr = selTool(
    ".no-underline.d-flex.flex-column.flex-justify-center"
  );

  for (let i = 0; i < topicurlarr.length; i++) {
    let link = selTool(topicurlarr[i]).attr("href");
    let full_link = "https://github.com" + link;
    extractrepodata(full_link);
    //console.log(full_link);
  }
}

function extractrepodata(full_link) {
  request(full_link, cb);

  function cb(err, response, html) {
    if (err) {
      console.log(err);
    } else {
      getRepoLinks(html);
    }
  }
}

function getRepoLinks(html) {
  let selTool = cheerio.load(html);
  let topicnameelem = selTool(".h1-mktg");
  let repolinks = selTool("a.text-bold");
  let topicfolName = topicnameelem.text().trim();
  let dirpath = "./topics";
  let fpath2 = path.join(dirpath, topicfolName);

  //console.log(topicfolName);
    createDir(fpath2);

  for (let i = 0; i < 10; i++) {
    let repopagelink = selTool(repolinks[i]).attr("href");
    let repolinkfinal = "https://github.com" + repopagelink;
    //console.log(repolinkfinal);
    let fileName = repolinkfinal.split("/").pop();
    fileCreator(fileName, fpath2);
    let issueUrl = repolinkfinal + "/issues";
    extractIssues(issueUrl, fileName, fpath2);
    //console.log(issueUrl)
  }
}
function extractIssues(issueUrl, fileName, fpath2) {
  request(issueUrl, cb);
  function cb(err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractIssueData(html, fileName, fpath2);
    }
  }
}

function extractIssueData(html, fileName, fpath2) {
  let object = [];
  let selTool = cheerio.load(html);
  let issueElem = selTool(
    ".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"
  );
  let arr = [];
  for (let i = 0; i < issueElem.length; i++) {
    let issueLink = "https://github.com" + selTool(issueElem[i]).attr("href");
    let issueName = selTool(issueElem[i]).text();
    //console.log(issueName + " --> "+ issueLink)

    let jfilepath = path.join(fpath2, fileName + ".json");
    openIssue(issueLink, issueName,jfilepath);
    // arr.push({
    //     Name : issueName,
    //     Link : issueLink
    //     })
    //    // fs.writeFileSync(jfilepath,JSON.stringify(arr));
    //    let pdfDoc = new PDFDocument;
      //  pdfDoc.pipe(fs.createWriteStream('./topics/issuesDetails.pdf'));
      //  pdfDoc.text(JSON.stringify(arr,null, 2));
      //  pdfDoc.end();

    //console.log(jfilepath);
  }
  //console.log("");
  //console.log("----------------------------");
}
function openIssue(issueLink, issueName,jfilepath) {
  request(issueLink, cb);
  function cb(err, reponse, html) {
    if (err) {
      console.log(err);
    } else {
      openIssueAndGetData(html, issueLink, issueName,jfilepath);
    }
  }
}

function openIssueAndGetData(html, issueLink, issueName,jfilepath) {
  let selTool = cheerio.load(html);
  let rawIssueDec = selTool(
    ".d-block.comment-body.markdown-body.js-comment-body p"
  );
  let issueDesc = selTool(rawIssueDec[0]).text().toString();
  //console.table(issueDesc)
  
  arr.push({
    Name: issueName,
    Link: issueLink,
    Description: issueDesc,
  })
  //console.table(JSON.stringify(arr,null, 2))
  fs.writeFileSync(jfilepath,JSON.stringify(arr))
}
