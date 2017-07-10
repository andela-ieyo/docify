/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,

  'Update Role': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/login')
      .waitForElementVisible('body')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'ifiokabasi.eyo@andela.com')
      .setValue('input[type=password]', 'sagehasson')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="material-icons add"]')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .waitForElementVisible('i[class="fa fa-folder"]')
      .click('a[class="button-collapse"]')
      .waitForElementVisible('div[class="userView"]')
      .assert.containsText('span', 'Welcome Eyo')
      .waitForElementVisible('a[class="view-all-docify "]')
      .click('a[class="view-all-docify "]')
      .pause(10000)
      .assert.urlEquals('http://localhost:8000/users/all')
      .waitForElementVisible('div[class="create-title center-align"]')
      .waitForElementVisible('.docify-update')
      .click('.docify-update')
      .pause(5000)
      .waitForElementVisible('#role-select')
      .pause(2000)
      .click('#role-select')
      .waitForElementVisible('.editor')
      .click('.editor')
      .click('select[id="role-select"] option[value="2"]')
      .pause(5000)
      .waitForElementVisible('#role-select')
      .pause(5000)
      .waitForElementVisible('button[id="submit"]')
      .click('button[id="submit"]')
      .pause(10000)
      .end();
  }
};
