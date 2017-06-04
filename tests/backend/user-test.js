import bcrypt from 'bcrypt';
import chai from 'chai';
import async from 'async';
import request from 'supertest';
import models, { Users, Roles } from '../../server/models';
import app from '../../server';
import fixtures from '../seed-data/fixtures.json';

const should = chai.should();
const expect = chai.expect;
const salt = bcrypt.genSaltSync();

const syncModel = models.sequelize.sync();

const seededRoles = fixtures.roles;

const createRoles = Roles.bulkCreate(seededRoles);

const hashedUsers = fixtures.users.map(user => {
  user.password = bcrypt.hashSync(user.password, salt);
  return user;
});

const createUsers = Users.bulkCreate(hashedUsers);

const resolve = (fn, cb) => {
  fn.then(res => cb(null, res)).catch(err => cb(err));
};

let token;

describe('Users', () => {
  beforeEach((done) => {
    async.series([
      async.apply(resolve, syncModel),
      async.apply(resolve, createRoles),
      async.apply(resolve, createUsers)
    ], (err, res) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      return request(app)
        .post('/api/users/login')
        .send({
          email: 'precious.ijege@gmail.com',
          password: 'testing'
        })
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
  });

  after((done) => { //Before each test we empty the database
    models.sequelize.sync({
      force: true
    }) // drops table and re-creates it
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });


  /*
   * Test the /GET route
   */
  describe('/GET Users', () => {
    it('it should GET all the users', (done) => {
      request(app)
        .get('/api/users')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          console.log(res.body, 'oooooooo');
          res.status.should.equal(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
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
        password: 'testing'
      };
      request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User signup completed successfully');
            expect(res.body).to.have.property('newUser');
            expect(res.body.newUser).to.be.a('object');
            expect(res.body.newUser).to.have.property('id');
            expect(res.body.newUser).to.have.property('username');
            expect(res.body.newUser).to.have.property('firstName');
            expect(res.body.newUser).to.have.property('email');
            expect(res.body.newUser).to.have.property('password');
            expect(res.body).to.have.property('token');
            done();
          });
    });

    it('it should POST a user with an error', (done) => {
      const user = {
        username: '',
        firstName: 'John',
        lastName: 'Smith',
        email: 'John.smith@gmail.com',
        password: 'test'
      };
      request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            res.body.should.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.length(1);
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
          res.status.should.equal(200);
          expect(res.body).should.be.a('object');
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
        .send({ lastName: 'Blaq', email: 'kelvin.blaq@gmail.com' })
        .end((err, res) => {
          res.status.should.equal(200);
          expect(res.body).should.be.a('object');
          res.body.should.have.property('message').eql('User record updated successfully');
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
          res.status.should.equal(204);
          expect(res.body).should.be.a('object');
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
        .send({ roleId: 2 })
        .end((err, res) => {
          console.log(res.body, 'oooooo');
          res.status.should.equal(200);
          expect(res.body).should.be.a('object');
          expect(res.error).to.equal(false);
          res.body.should.have.property('message').eql('User role updated successfully');
          done();
        });
    });
  });

});
