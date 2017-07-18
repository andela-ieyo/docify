
/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,
  Search(browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/login')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'precious.ijege@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .pause(1000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="material-icons add"]')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .waitForElementVisible('i[class="fa fa-folder"]')
      .waitForElementVisible('a[class="card white"]')
      .click('a[class="card white"]')
      .pause(10000)
      .assert.urlEquals('http://localhost:8000/document/private')
      .waitForElementVisible('input[id="search"]')
      .setValue('input[id="search"]', 'Purple Flower')
      .assert.visible('div[class="card small docify-card"]')
      .end();
  }
};
