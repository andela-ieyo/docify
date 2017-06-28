import chai from 'chai';
import bcrypt from 'bcrypt-nodejs';
import request from 'supertest';
import fixtures from './seed-data/fixtures.json';
import models from '../models';

import app from '../../server';

const expect = chai.expect;
const salt = bcrypt.genSaltSync();

const hashedUsers = fixtures.users.map(user => {
  user.password = bcrypt.hashSync(user.password, salt);
  return user;
});


describe('Users', () => {
  let token;

  before(() => {
    return models.sequelize.sync({
      // force: true
    }).then(() => {
      return models.Roles.bulkCreate(fixtures.roles).then(res => {
        return models.Users.bulkCreate(hashedUsers)
          .then(res => {
            return request(app)
              .post('/api/users/login')
              .send({
                email: 'precious.ijege@gmail.com',
                password: 'testing'
              });
          })
          .then(res => {
            token = res.body.token;
          });
      });
    }).catch(console.log);
  });

  after((done) => { //Before each test we empty the database
    models.sequelize.sync({
        force: true
      }) // drops table and re-creates it
      .then(() => {
        done();
      });
  });

  describe('/GET Users', () => {
    it('it should GET all the users', (done) => {
      request(app)
        .get('/api/users')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.count).to.equal(fixtures.users.length);
          expect(res.body.rows).to.have.lengthOf(fixtures.users.length);
          done();
        });
    });
  });

  describe('/POST Users', () => {

    it('it should POST a user with a 200', (done) => {
      const user = {
        username: 'Kels',
        firstName: 'Kelvin',
        lastName: 'Smith',
        email: 'kelvin.smith@gmail.com',
        password: 'testing',
        pwConfirmation: 'testing'
      };
      request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'User signup completed successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.a('object');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('firstName');
          expect(res.body.user).to.have.property('roleId');
          expect(res.body.user).to.have.property('email');
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('it should POST a user with an error', (done) => {
      const user = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        pwConfirmation: ''
      };
      request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('password');
          expect(res.body).to.have.property('username').eql('This field is required');
          expect(res.body).to.have.property('firstName').eql('This field is required');
          expect(res.body).to.have.property('email').eql('Email is invalid');
          expect(res.body).to.have.property('lastName').eql('This field is required');
          expect(res.body).to.have.property('password').eql('Password must be at least 6 characters');
          done();
        });
    });
  });

  describe('/GET/:id Users', () => {
    it('it should GET a user by the given id', (done) => {
      request(app)
        .get('/api/users/3')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('password');
          expect(res.body).to.have.property('id').eql(3);
          done();
        });
    });
  });

  describe('/PUT/:id Users', () => {
    let userToken;

    before((done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'kelvin.smith@gmail.com',
          password: 'testing'
        })
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });

    it('it should UPDATE a user given the id', (done) => {
      request(app)
        .put('/api/users/3')
        .set('authorization', userToken)
        .send({
          lastName: 'Blaq',
          email: 'kelvin.blaq@gmail.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql('User record updated successfully');
          done();
        });
    });
  });

  describe('/DELETE/:id Users', () => {
    it('Admin should DELETE a user given the id', (done) => {
      request(app)
        .delete('/api/users/3')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          expect(res.body).to.be.an('object');
          expect(res.error).to.equal(false);
          done();
        });
    });
  });

  describe('/PUT/role/:id Users', () => {
    it('Admin should UPDATE a user\'s role given the id', (done) => {
      request(app)
        .put('/api/users/role/2')
        .set('authorization', token)
        .send({
          roleId: 2
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.error).to.equal(false);
          expect(res.body).to.have.property('message').eql('User role updated successfully');
          done();
        });
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
    const doc = {
      title: 'The Lord of the Rings',
      access: 'public',
      content: 'sex and Adventure'
    };

    it('it should POST a doc', (done) => {
      request(app)
        .post('/api/documents')
        .set('authorization', token)
        .send(doc)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('Document created successfully.');
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
    const doc = {
      title: 'The Memoirs of a dying Princess',
      access: 'public',
      content: 'Secrets, Lies, and Betrayal'
    };


    it('it should update a doc with the passed param as id ', (done) => {
      request(app)
        .put('/api/documents/2')
        .set('authorization', token)
        .send(doc)
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

  describe('/POST logout a user', () => {
    it('it should logout a user', (done) => {
      request(app)
        .get('/api/users/logout')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('message').eql('You have been successfully logged out');
          done();
        });
    });
  });

  describe('/POST login a user', () => {
    it('it should validate the password input field is not empty', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'precious.ijege@gmail.com',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('password');
          expect(res.body).to.have.property('password').eql('Password must be at least 6 characters');
          done();
        });
    });
  });

  describe('/POST Documents', () => {
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

  describe('/PUT updates a doc using the id', () => {
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
  });

  describe('/GET user doc using the id', () => {

    it('it should GET docs belonging to a specific user using the userId', (done) => {
      request(app)
        .get('/api/users/1/documents')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.be.null;
          expect(res.body.rows).to.be.an.instanceof(Array);
          expect(res.body.rows[0]).to.have.property('title');
          expect(res.body.rows[0]).to.have.property('title').eql('The Lord of the Rings');
          expect(res.body.rows[0]).to.have.property('access');
          expect(res.body.rows[0]).to.have.property('access').eql('public');
          expect(res.body.rows[0]).to.have.property('content');
          expect(res.body.rows[0]).to.have.property('content').eql('sex and Adventure');
          expect(res.body.rows[0]).to.have.property('ownerId').eql(1);
          done();
        });
    });
  });

  describe('/GET current user details', () => {

    it('it should GET the details of a logged in user', (done) => {
      request(app)
        .get('/api/users/current')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an.instanceof(Object);
          expect(res.body).to.not.be.null;
          expect(res.body).to.have.property('firstName').eql('Precious');
          expect(res.body).to.have.property('lastName').eql('Ijege');
          expect(res.body).to.have.property('username').eql('Admin');
          expect(res.body).to.have.property('roleId').eql(3);
          expect(res.body).to.have.property('email').eql('precious.ijege@gmail.com');
          done();
        });
    });
  });

  describe('/GET search for a user', () => {

    it('it should GET all user instances matching the search query', (done) => {
      request(app)
        .get('/api/search/users/?name=precious')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.be.null;
          expect(res.body.rows).to.have.lengthOf(1);
          expect(res.body.count).to.equal(1);
          expect(res.body.rows[0]).to.have.property('firstName').eql('Precious');
          done();
        });
    });
  });

  describe('/GET search for a user', () => {

    it('it should return not found if the user does not exist ', (done) => {
      request(app)
        .get('/api/search/users/?name=mary')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message').eql('No user record found');
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
          expect(res.body.rows[0].title).to.include('the');
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


});