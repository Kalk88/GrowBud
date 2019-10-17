module.exports = {
    'Demo test': function (browser) {
        browser.url('http://localhost:8080/#/')
            .waitForElementVisible('body')
            .setValue('input[type=text]', 'KLasURBAN')
            .setValue('input[type=email]', 'urbizBoi@hotmale.com')
            .setValue('input[type=password]', 'wololooooooo')
            .click('button[type=button]')
            .waitForElementVisible('.about')
            .end();

    }
};