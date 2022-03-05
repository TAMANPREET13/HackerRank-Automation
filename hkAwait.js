const loginLink = "https://www.hackerrank.com/auth/login";
const puppeteer = require("puppeteer");
const emailPassObj = require("./secrets");
const {
    answers
} = require("./codes");

let page;

(async function fn() {
    try {
        let browserStartPromise = await puppeteer.launch({
            // visible 
            headless: false,
            // type 1sec // slowMo: 1000,
            defaultViewport: null,
            // browser setting 
            args: ["--start-maximized", "--disable-notifications"]
        });
        let browserObj = await browserStartPromise;
        console.log("Browser opened");
        //new tab
        page = await browserObj.newPage();
        await page.goto(loginLink);
        await page.type("input[id='input-1']", emailPassObj.email, {
            delay: 50
        });
        await page.type("input[type='password']", emailPassObj.password, {
            delay: 50
        });
        await page.click('button[data-analytics="LoginPassword"]', {
            delay: 100
        })
        waitAndClick('.topic-name[data-automation = "algorithms"]', page);
        await waitAndClick("input[value='warmup']", page);

        await page.waitFor(3000);
        let questionsArr = await page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", {
            delay: 100
        });
        await questionSolver(page, questionsArr[0], answers[0]);
    } catch (err) {
        console.log(err);
    }

})()


async function waitAndClick(selector, cPage) {
    await cPage.waitForSelector(selector);
    let selectorClicked = cPage.click(selector);
    return selectorClicked;
}

// return a promise -> that  will submit a given question
function questionSolver(pages, question, answer) {
    return new Promise(function(resolve, reject) {
        let qWillBeClicked = question.click();

        qWillBeClicked
        //click
        //code read
        //ctrl A + ctrl X
        //click on editor
        //ctrl A + ctrl V
            .then(function() {
                let waitForEditortobeInFocus = waitAndClick(".monaco-editor.no-user-select.vs", pages);
                return waitForEditortobeInFocus;
            })
            .then(function() {
                return waitAndClick(".checkbox-input", pages);
            }).then(function() {
                return pages.waitForSelector("textarea.custominput", {
                    visible: true
                });
            })
            .then(function() {
                return pages.type("textarea.custominput", answer, {
                    delay: 10
                });

            }).then(function() {
                let ctrlIsPressedP = pages.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function() {
                let AIsPressedP = pages.keyboard.press("A", {
                    delay: 100
                })
                return AIsPressedP;
            }).then(function() {
                return pages.keyboard.press("X", {
                    delay: 100
                });
            }).then(function() {
                return pages.keyboard.up("Control");
            }).then(function() {
                let waitForEditortobeInFocus = waitAndClick(".monaco-editor.no-user-select.vs", pages);
                return waitForEditortobeInFocus;
            })
            .then(function() {
                let ctrlIsPressedP = pages.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function() {
                let AIsPressedP = pages.keyboard.press("A", {
                    delay: 100
                })
                return AIsPressedP;
            }).then(function() {
                let AIsPressedP = pages.keyboard.press("V", {
                    delay: 100
                })
                return AIsPressedP;
            }).then(function() {
                return pages.keyboard.up("Control");
            }).then(function() {
                return pages.click(".hr-monaco__run-code", {
                    delay: 50
                });
            })
            .then(function() {
                resolve();
            }).catch(function(err) {
                console.log(err);
                reject(err);
            })
    })

}