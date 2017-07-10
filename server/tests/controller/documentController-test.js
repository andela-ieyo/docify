import chai from 'chai';
import bcrypt from 'bcrypt-nodejs';
import request from 'supertest';
import fixtures from '../seed-data/fixtures.json';
import models from '../../models';

import app from '../../../server';

const expect = chai.expect;
const salt = bcrypt.genSaltSync();


const encryptedUsers = fixtures.users.map(user => ({
  ...user,
  password: bcrypt.hashSync(user.password, salt)
}));

describe('Document Controller', () => {
  let token;
  let document;


  before(() => {

    return models.sequelize.sync({ force: true })
    .then(() => models.Roles.bulkCreate(fixtures.roles))
    .then(() => models.Users.bulkCreate(encryptedUsers))
    .then(() => request(app)
              .post('/api/users/login')
              .send({
                email: 'ifiok.eyo@gmail.com',
                password: 'sagehasson'
              }))
    .then((res) => {
      token = res.body.token;
    })
    .catch((e) => {
      console.log(e, 'error');
    });
  });

  after((done) => { //Before each test we empty the database
    models.sequelize.sync({
      force: true
    }) // drops table and re-creates it
      .then(() => {
        done();
      });
  });

  describe('/GET Documents', () => {
    it('it should GET all documents', (done) => {
      request(app)
        .get('/api/documents')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an.instanceof(Object);
          expect(res.body.rows).to.have.lengthOf(0);
          done();
        });
    });
  });

  describe('/POST Documents', () => {
    document = {
      title: 'The Lord of the Rings',
      access: 'public',
      content: 'sex and Adventure'
    };

    const doc = {
      title: '',
      access: '',
      content: ''
    };

    it('it should validate all input fields', (done) => {
      request(app)
        .post('/api/documents')
        .set('authorization', token)
        .send(doc)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('All fields must not be empty');
          done();
        });
    });

    it('it should POST a doc', (done) => {
      request(app)
        .post('/api/documents')
        .set('authorization', token)
        .send(document)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('Document created successfully');
          done();
        });
    });
  });

  describe('/GET Documents', () => {
    before((done) => {
      const doc = {
        title: 'The Memoirs of Princess Diana',
        access: 'public',
        content: 'Secrets, Lies, and Betrayal'
      };

      request(app)
        .post('/api/documents')
        .set('authorization', token)
        .send(doc)
        .end((err, res) => {
          done();
        });
    });

    it('it should GET all doc', (done) => {
      request(app)
        .get('/api/documents')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.rows).to.be.an.instanceof(Array);
          expect(res.body.rows).to.have.lengthOf(2);
          done();
        });
    });
  });

  describe('/GET a doc using the id', () => {

    it('it should GET a doc with the passed param as id ', (done) => {
      request(app)
        .get('/api/documents/2')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.be.null;
          expect(res.body).to.be.an.instanceof(Object);
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('access');
          expect(res.body).to.have.property('content');
          expect(res.body).to.have.property('id').eql(2);
          done();
        });
    });
  });

  describe('/PUT updates a doc using the id', () => {
    document = {
      title: 'The Memoirs of a dying Princess',
      access: 'public',
      content: 'Secrets, Lies, and Betrayal'
    };

    const doc = {
      title: '',
      access: '',
      content: ''
    };

    it('it should validate no input field is empty during update ', (done) => {
      request(app)
        .put('/api/documents/2')
        .set('authorization', token)
        .send(doc)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.error).to.exist;
          expect(res.error.text).to.eql('{"message":"All fields must not be empty"}');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('All fields must not be empty');
          done();
        });
    });


    it('it should update a doc with the passed param as id ', (done) => {
      request(app)
        .put('/api/documents/1')
        .set('authorization', token)
        .send(document)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('Document updated successfully');
          done();
        });
    });
  });

  describe('/DELETE a doc using the id', () => {
    it('it should delete a doc with the passed param as id ', (done) => {
      request(app)
        .delete('/api/documents/2')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('Document deleted successfully');
          done();
        });
    });
  });

  describe('/GET a doc using the id', () => {

    it('it should return 404 for an invalid docId ', (done) => {
      request(app)
        .get('/api/documents/4')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.error).to.exist;
          expect(res.error.text).to.eql('{"message":"Document not found"}');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('Document not found');
          done();
        });
    });
  });


  describe('/GET user doc using the id', () => {

    it('it should GET docs belonging to a specific user using the userId', (done) => {
      request(app)
        .get('/api/users/3/documents')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.be.null;
          expect(res.body.rows).to.be.an.instanceof(Array);
          expect(res.body.rows[0]).to.have.property('title');
          expect(res.body.rows[0]).to.have.property('title').eql('The Memoirs of a dying Princess');
          expect(res.body.rows[0]).to.have.property('access');
          expect(res.body.rows[0]).to.have.property('access').eql('public');
          expect(res.body.rows[0]).to.have.property('content');
          expect(res.body.rows[0]).to.have.property('content').eql('Secrets, Lies, and Betrayal');
          expect(res.body.rows[0]).to.have.property('ownerId').eql(3);
          done();
        });
    });
  });

  describe('/GET search for a document', () => {

    it('it should return a document matching the search query', (done) => {
      request(app)
        .get('/api/search/documents/?docTitle=The')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.rows[0].title).to.include('The');
          done();
        });
    });

    it('it should return a document matching the search query', (done) => {
      request(app)
        .get('/api/search/documents/?docTitle=quuuu')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.rows).to.have.lengthOf(0);
          done();
        });
    });
  });

  describe('/GET role documents as a logged in user', () => {
    it('it should return all role documents accessible by the user', (done) => {


      request(app)
        .get('/api/documents/role')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.rows[0].title).to.equal('The Memoirs of a dying Princess');
          done();
        });
    });
  });

});
