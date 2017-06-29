
/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,
  Search(browser) {
    browser
      .url('http://localhost:8000/login')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'precious.ijege@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .pause(1000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('input[id="search"]')
      .setValue('input[id="search"]', 'Redux Architecture')
      .pause(1000)
      .assert.visible('div[class="card small docify-card"]')
      .end();
  }
};
