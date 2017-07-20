/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';
const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,
  'Regular Users Create Document': function (browser) {
    browser
      .resizeWindow(1280, 800)
      .url('http://localhost:8000/login')
      .waitForElementVisible('body')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'seun.martins@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .waitForElementVisible('.toast')
      .assert.visible('.toast')
      .assert.urlEquals('http://localhost:8000/dashboard')
      .waitForElementVisible('i[class="material-icons add"]')
      .waitForElementVisible('button[id="docify-add-doc"]')
      .click('button[id="docify-add-doc"]')
      .assert.urlEquals('http://localhost:8000/create-document')
      .waitForElementVisible('div[class="create-title center-align"]')
      .waitForElementVisible('input[type=text]')
      .setValue('input[id=title]', faker.lorem.word())
      .waitForElementVisible('div[id="cke_content"]')
      .pause(500)
      .execute(() => {
        const editor = $('iframe.cke_wysiwyg_frame').contents();
        editor.find('.cke_editable > p')
        .html('Est dolorem occaecati laborum. Nihil iste aliquam repellat alias aut doloremque sed iure. Laborum deleniti modi consectetur omnis.');
      })
      .waitForElementVisible('select[id="access"]')
      .setValue('select[id="access"]', 'public')
      .waitForElementVisible('button[class="btn waves-effect waves-light docify-save"]')
      .click('button[class="btn waves-effect waves-light docify-save"]')
      .waitForElementVisible('div[class="card-action dashboard-title"]')
      .waitForElementVisible('a[class="card white"]')
      .click('a[class="card white"]')
      .end();
  }
};
