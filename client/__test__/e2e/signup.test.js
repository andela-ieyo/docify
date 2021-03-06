/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';

const config = require('../../../nightwatch.conf.js');

const password = faker.internet.password();
const lastName = faker.name.lastName();

module.exports = {
  // '@disabled': true,
  'Signup Page': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/signup')
      .waitForElementVisible('body')
      .assert.containsText('h4', 'Sign Up')
      .end();
  },

  'Validate sign up input fields': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/signup')
      .waitForElementVisible('input[id="firstName"]')
      .setValue('input[id="firstName"]', '')
      .setValue('input[id="lastName"]', '')
      .setValue('input[id="username"]', faker.internet.userName())
      .setValue('input[type=email]', faker.internet.email())
      .setValue('input[type=password]', password)
      .setValue('input[id="pwConfirmation"]', 'testing')
      .click('button[class="btn waves-effect waves-light signup-btn"]')
      .assert.urlEquals('http://localhost:8000/signup')
      .end();
  },

  'Register New User': function (browser) {
    browser
      .url('http://localhost:8000/signup')
      .waitForElementVisible('input[id="firstName"]')
      .setValue('input[id="firstName"]', faker.name.firstName())
      .setValue('input[id="lastName"]', lastName)
      .setValue('input[id="username"]', faker.internet.userName())
      .setValue('input[type=email]', faker.internet.email())
      .setValue('input[type=password]', password)
      .setValue('input[id="pwConfirmation"]', password)
      .click('button[class="btn waves-effect waves-light signup-btn"]')
      .waitForElementVisible('i[class="Small material-icons docify-menu"]')
      .click('a[class="button-collapse"]')
      .assert.containsText('span[class="name"]', `Welcome ${lastName}`)
      .end();
  }
};
