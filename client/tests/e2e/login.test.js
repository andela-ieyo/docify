/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,
  'Login Users': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/login')
      .waitForElementVisible('body')
      .waitForElementVisible('h4')
      .assert.visible('input[type=email]')
      .assert.visible('input[type=password]')
      .setValue('input[type=email]', 'ifiokabasi.eyo@andela.com')
      .setValue('input[type=password]', 'sagehasson')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .end();
  },

  'Admin User Dashboard Page': function (browser) {
    browser
      .url('http://localhost:8000/login')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'ifiokabasi.eyo@andela.com')
      .setValue('input[type=password]', 'sagehasson')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .click('a[class="button-collapse"]')
      .waitForElementVisible('div[class="userView"]')
      .assert.containsText('span', 'Welcome Eyo')
      .assert.elementPresent('.span-admin')
      .waitForElementVisible('a[class="view-all-docify "]')
      .assert.containsText('a[class="view-all-docify "]', 'View All Users')
      .end();
  },

  'Regular Users Dashboard Page': function (browser) {
    browser
      .url('http://localhost:8000/login')
      .waitForElementVisible('body')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'precious.ijege@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .click('a[class="button-collapse"]')
      .assert.containsText('span[class="name"]', 'Welcome Ijege')
      .assert.containsText('span[class="email"]', 'precious.ijege@andela.com')
      .assert.containsText('a[class="delete-profile"]', 'Delete your account')
      .assert.containsText('a[class="update-profile"]', 'Update profile')
      .assert.elementNotPresent('.view-all-docify')
      .end();
  }
};
