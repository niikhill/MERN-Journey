let puppeteer = require("puppeteer");
let fs = require("fs");
let links = ["https://www.amazon.in",
    "https://www.flipkart.com",
    "https://paytmmall.com/"
];
let pName = process.argv[2];

(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized",]
        });
        // let amazonPDetails = await getListingFromAmazon(links[0], browserInstance, pName);
        // console.table(amazonPDetails);
        // let flipPDetails = await getListingFromFlipkart(links[1], browserInstance, pName);
        // console.table(flipPDetails);
        // let paytmPDetails = await getListingFromPaytm(links[2], browserInstance, pName);
        // console.table(paytmPDetails);
        let amazonPDetails =  getListingFromAmazon(links[0], browserInstance, pName);
        let flipPDetails =  getListingFromFlipkart(links[1], browserInstance, pName);
        let paytmPDetails =  getListingFromPaytm(links[2], browserInstance, pName);
        let allArrays = await Promise.all([amazonPDetails,flipPDetails,paytmPDetails]);
        console.table(allArrays[0]);
        console.table(allArrays[1]);
        console.table(allArrays[2]);
        browserInstance.close();
    } catch (err) {
        console.log(err);
    }
})();


async function getListingFromAmazon(links, browserInstance, pName) {
    console.log("in amazon function")
    let newTab = await browserInstance.newPage();
    await newTab.goto(links);
    await newTab.type("input[id='twotabsearchtextbox']", pName);
    await newTab.keyboard.press('Enter');
    await newTab.waitForSelector(".s-include-content-margin.s-border-bottom.s-latency-cf-section", { visible: true });
    await newTab.waitForSelector(".a-offscreen", { visible: true })
    function consoleFn(priceSel, nameSel) {
        let priceArr = document.querySelectorAll(priceSel);
        let pNameArr = document.querySelectorAll(nameSel);
        let pDetails = [];
        for (let idx = 0; idx < 5; idx++) {
            let price = priceArr[idx].innerText;
            let name = pNameArr[idx].innerText;
            pDetails.push({
                Website: "Amazon",
                name: name,
                price: price
            })
        }
        return pDetails;
    }
    //name selector .a-section.a-spacing-medium .a-size-medium.a-color-base.a-text-normal
    //price slector a-offscreen
    let pDetails = await newTab.evaluate(consoleFn, ".a-offscreen", ".a-size-medium.a-color-base.a-text-normal")

    // console.log(pDetails);
    //await browserInstance.close();
    return pDetails;
}

async function getListingFromFlipkart(links, browserInstance, pName) {
    console.log("in Flipkart function")
    let newTab = await browserInstance.newPage();
    await newTab.goto(links);
    await newTab.click("button[class='_2KpZ6l _2doB4z']");
    await newTab.type("input[title='Search for products, brands and more']", pName);
    await newTab.keyboard.press('Enter');
    await newTab.waitForSelector("div[data-id='MOBFWQ6BVWVEH3XE']", { visible: true });
    await newTab.waitForSelector("div[class='_4rR01T']", { visible: true });

    function consoleFn(pNameSel, pPriceSel) {
        let priceArr = document.querySelectorAll(pPriceSel);
        let pNameArr = document.querySelectorAll(pNameSel);
        let pDetails = [];
        for (let idx = 0; idx < 5; idx++) {
            let price = priceArr[idx].innerText;
            let name = pNameArr[idx].innerText;
            pDetails.push({
                Website: "Filpkart",
                name: name,
                price: price
            })
        }
        return pDetails;
    }
    let pFPDetails = await newTab.evaluate(consoleFn, "div[class='_4rR01T']", "div[class='_30jeq3 _1_WHN1']");
    //console.log(pDetails);
    return pFPDetails;
}

async function getListingFromPaytm(links, browserInstance, pName) {
    console.log("in paytm function")
    let newTab = await browserInstance.newPage();
    await newTab.goto(links);
    await newTab.type("#searchInput", pName, { delay: 100 });
    await newTab.keyboard.press('Enter');

    await newTab.waitForSelector("div[class='_3RA-']", { visible: true });
    await newTab.waitForSelector("div[class='UGUy']", { visible: true });

    function consoleFn(pNameSel, pPriceSel) {
        let priceArr = document.querySelectorAll(pPriceSel);
        let pNameArr = document.querySelectorAll(pNameSel);
        let pDetails = [];
        for (let idx = 0; idx < 5; idx++) {
            let price = priceArr[idx].innerText;
            let name = pNameArr[idx].innerText;
            pDetails.push({
                Website: "Paytm",
                name: name,
                price: price
            })
        }
        return pDetails;
    }
    let pFPDetails = await newTab.evaluate(consoleFn, "div[class='UGUy']", "div[class='_1kMS']");
    //console.log(pDetails);
    return pFPDetails;
}