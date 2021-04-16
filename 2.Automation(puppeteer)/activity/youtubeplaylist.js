const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
let pdfDoc = new PDFDocument();
let link = process.argv[2];
let resultFolder = "Results";

(async function () {
    try {
        //Puppeteer Browser Instance 
        let browserInstance = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
        });
        //Creating New Tab
        let newtab = await browserInstance.newPage();
        await newtab.goto(link);
        await newtab.waitForTimeout(3000);
        await newtab.waitForSelector(".style-scope.yt-formatted-string", {
            visible: true,
        });

        //Sending Selectors to ConsoleFunction
        let totalvids = await newtab.evaluate(
            consoleFn,
            ".style-scope.yt-formatted-string",
            ".style-scope.ytd-playlist-sidebar-primary-info-renderer",
            "a[class='yt-simple-endpoint style-scope yt-formatted-string']"
        );
        //Printing Playlist Details
        let vidCount = totalvids[0].split(" ")[0];
        vidCount = Number(vidCount);
        //console.log(vidCount);
        let channelName = totalvids[3];
        let playName = totalvids[2];
        console.log("Channel Name : " + totalvids[3]);
        console.log("Name of PlayList : " + totalvids[2]);
        console.log("No of Videos : " + totalvids[0]);
        console.log("No of Views : " + totalvids[1]);


        //Wait For Scroll
        let pCurrentVideoCount = await scrollTillBottom(newtab);
        while (vidCount - 50 > pCurrentVideoCount) {
            pCurrentVideoCount = await scrollTillBottom(newtab);
        }
        await newtab.waitForTimeout(3000);
        await newtab.waitForSelector(
            ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer", {
            visible: true,
        }
        );
        await newtab.waitForSelector(
            "span.style-scope.ytd-thumbnail-overlay-time-status-renderer", {
            visible: true,
        }
        );

        //Create directories
        createResultDir();
        createDir(channelName);

        //Get PlayList Data
        let stats = await newtab.evaluate(
            getStats,
            ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer",
            "span.style-scope.ytd-thumbnail-overlay-time-status-renderer"
        );


        //Create JSON
        createJson(playName, channelName);

        //Fill Data into Json
        let filePath = path.join(__dirname, resultFolder, channelName, playName + ".json");
        if (fs.existsSync(filePath) == false) {
            fs.writeFileSync(filePath, JSON.stringify(stats));
        } else {
            let data = fs.readFileSync(filePath, "UTF-8");
            if (data.length == 0) {
                data = [];
            } else {
                // console.log(data);
                data = JSON.parse(data);
            }

            data.push(stats);
            fs.writeFileSync(filePath, JSON.stringify(data));
        }


        //Create PDF
        let pdf_file_Name = path.join(__dirname, resultFolder, channelName, playName + ".pdf")
        pdfDoc.pipe(fs.createWriteStream(pdf_file_Name))
        pdfDoc.text(JSON.stringify(stats, null, 2));
        pdfDoc.end();
        //console.table(stats);
        browserInstance.close();
    } catch (err) {
        console.log(err);
    }
})();

function createResultDir() {
    if (fs.existsSync(resultFolder) == false) {
        fs.mkdirSync(resultFolder);
    }
}


function createDir(channelName) {
    let folderPath = path.join(__dirname, resultFolder, channelName);
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
    }
}

function createJson(playName, channelName) {
    let filePath = path.join(__dirname, resultFolder, channelName, playName + ".json");
    if (fs.existsSync(filePath) == false) {
        let file = fs.createWriteStream(filePath);
        file.end();
    }

}


function consoleFn(videoSel, viewsSel, cNameSel) {

    let statArr = document.querySelectorAll(viewsSel);
    let viewsArr = document.querySelectorAll(viewsSel);
    let cNameArr = document.querySelectorAll(cNameSel);
    let arr = [];
    let playName = statArr[1].innerText;
    let channelName = cNameArr[1].innerText;
    let noOfVideos = statArr[5].innerText;
    let noOfViews = viewsArr[6].innerText;
    arr.push(noOfVideos, noOfViews, playName, channelName);

    return arr;
}

function getStats(vidNameSel, durationSel) {
    let vidNameArr = document.querySelectorAll(vidNameSel);
    let durationArr = document.querySelectorAll(durationSel);
    let vidName = [];

    for (let i = 0; i < durationArr.length; i++) {
        let duration = durationArr[i].innerText;
        let title = vidNameArr[i].innerText;
        duration = duration.trim();
        vidName.push({
            title,
            duration,
        });
    }

    return vidName;
}

async function scrollTillBottom(page, title) {
    function getLengthFn() {
        //console.log("in length fn");
        window.scrollBy(0, window.innerHeight);
        let titleArr = document.querySelectorAll(
            ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer"
        );
        //console.log(titleArr.length);
        return titleArr.length;
    }
    return page.evaluate(getLengthFn);
}

