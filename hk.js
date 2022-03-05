const loginLink = "https://www.hackerrank.com/auth/login";
const puppeteer = require("puppeteer");
const emailPassObj = require("./secrets");
const { answers } = require("./codes");
let browserStartPromise = puppeteer.launch({
    // visible 
    headless: false,
    // type 1sec // slowMo: 1000,
    defaultViewport: null,
    // browser setting 
    args: ["--start-maximized", "--disable-notifications"]
});
let page, browser;
browserStartPromise
    .then(function(browserObj) {
        console.log("Browser opened");
        // new tab 
        browser = browserObj
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    }).then(function(newTab) {
        page = newTab
        console.log("new tab opened ")
        let gPageOpenPromise = newTab.goto(loginLink);
        return gPageOpenPromise;
    }).then(function() {
        let emailWillBeEnteredPromise = page.type("input[id='input-1']", emailPassObj.email, {
            delay: 50
        });
        return emailWillBeEnteredPromise;
    }).then(function() {
        let passwordWillBeEnteredPromise = page.type("input[type='password']", emailPassObj.password, {
            delay: 50
        });
        return passwordWillBeEnteredPromise;
    }).then(function() {
        let loginWillBeDOnepromise = page.click('button[data-analytics="LoginPassword"]', {
            delay: 100
        });
        return loginWillBeDOnepromise;
    })
    .then(function() {
        let clickedOnAlgoPromise = waitAndClick('.topic-name[data-automation = "algorithms"]', page);
        return clickedOnAlgoPromise;
    }).then(function() {
        let getToWarmUp = waitAndClick("input[value='warmup']", page);
        return getToWarmUp;
    }).then(function() {
        let waitFor3SecondsPromise = page.waitFor(3000);
        return waitFor3SecondsPromise;
    }).then(function() {
        let AllChallengesArrPromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", {
            delay: 100
        });
        return AllChallengesArrPromise;

    }).then(function(questionsArr) {
        console.log("Number of questions", questionsArr.length);
        let qWillBeSolvedPromise = questionSolver(page, questionsArr[0], answers[0]);
        return qWillBeSolvedPromise;
    }).then(function() {
        console.log("question is solved");
    })

function waitAndClick(selector, cPage) {
    return new Promise(function(resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, {
            visible: true
        });
        waitForModalPromise
            .then(function() {
                let clickModal =
                    cPage.click(selector, {
                        delay: 100
                    });
                return clickModal;
            }).then(function() {
                resolve();
            }).catch(function(err) {
                reject(err)
            })
    })
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
                return pages.waitForSelector("textarea.custominput", { visible: true });
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
                return pages.click(".hr-monaco__run-code", { delay: 50 });
            })
            .then(function() {
                resolve();
            }).catch(function(err) {
                console.log(err);
                reject(err);
            })
    })

}