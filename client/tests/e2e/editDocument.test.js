/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,

  'Edit Document': function (browser) {
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
      .waitForElementVisible('div[class="card small docify-card"]')
      .waitForElementVisible('button[class="btn-small waves-effect waves-light docify-view"]')
      .click('button[class="btn-small waves-effect waves-light docify-view"]')
      .pause(10000)
      .waitForElementVisible('div[class="create-title center-align"]')
      .waitForElementVisible('input[id="title"]')
      .setValue('input[id=title]', faker.lorem.word())
      .waitForElementVisible('div[id="cke_content"]')
      .click('button[class="btn waves-effect waves-light docify-save-edit"]')
      .waitForElementVisible('button[class="waves-effect waves-teal btn-flat"]')
      .click('button[class="waves-effect waves-teal btn-flat"]')
      .pause(1000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .end();
  }
};
