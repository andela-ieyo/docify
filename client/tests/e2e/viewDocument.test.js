/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,

  'Regular Users View Document': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/login')
      .waitForElementVisible('body')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'seun.martins@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="material-icons add"]')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .waitForElementVisible('i[class="fa fa-folder"]')
      .waitForElementVisible('a[class="card white"]')
      .click('a[class="card white"]')
      .pause(10000)
      .assert.urlEquals('http://localhost:8000/document/private')
      .waitForElementVisible('a[class="btn-small waves-effect waves-light docify-view"]')
      .pause(1000)
      .click('a[class="btn-small waves-effect waves-light docify-view"]')
      .pause(5000)
      .end();
  }
};
