module.exports = {
    'Demo test': function (browser) {
        browser.url('http://localhost:8080/#/')
            .waitForElementVisible('body')
            .click('.loginbtn', () => {
                browser
                    .setValue('input[type=email]', 'test@test.com')
                    .setValue('input[type=password]', 'testtesttest')
                    .click('.login-modal-btn')
                    .waitForElementPresent('.logged-in')
            })
            .end();

    }
};