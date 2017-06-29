/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
import faker from 'faker';

const config = require('../../../nightwatch.conf.js');

module.exports = {
  // '@disabled': true,
  'My DashBoard': function (browser) {
    browser
      .url('http://localhost:8000/login')
      .waitForElementVisible('input[type=email]')
      .setValue('input[type=email]', 'precious.ijege@andela.com')
      .setValue('input[type=password]', 'testing')
      .click('button[name=submit]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .assert.visible('div[class="card small docify-card"]')
      .pause(5000)
      .click('a[id="doc-view"]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/documents/view/8')
      .waitForElementVisible('button[class="waves-effect waves-teal btn-flat"]')
      .click('button[class="waves-effect waves-teal btn-flat"]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .pause(2000)
      .assert.visible('div[class="card small docify-card"]')
      .setValue('select[id="docify-option"]', 'myDocuments')
      .assert.visible('i[class="material-icons"]')
      .click('button[class="btn-floating btn-medium waves-effect waves-light red docify-create-doc"]')
      .pause(5000)
      .assert.urlEquals('http://localhost:8000/create-document')
      .setValue('input[id=title]', faker.company.catchPhrase())
      .waitForElementVisible('div[id="cke_content"]')
      .execute(() => {
        const editor = $('iframe.cke_wysiwyg_frame').contents();
        editor.find('.cke_editable > p').html('Lorem ipsum dolor sit amet');
      })
      .waitForElementVisible('select[id="access"]')
      .setValue('select[id="access"]', 'public')
      .waitForElementVisible('button[class="btn waves-effect waves-light docify-save"]')
      .click('button[class="btn waves-effect waves-light docify-save"]')
      .pause(2000)
      .waitForElementVisible('button[class="waves-effect waves-teal btn-flat"]')
      .click('button[class="waves-effect waves-teal btn-flat"]')
      .end();
  }
};
