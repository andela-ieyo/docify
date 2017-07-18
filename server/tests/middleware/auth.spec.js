import request from 'supertest';
import chai from 'chai';
import bcrypt from 'bcrypt-nodejs';

import models from '../../models';
import app from '../../../server';
import fixtures from '../seed-data/fixtures.json';

const expect = chai.expect;

const Users = models.Users;
const Roles = models.Roles;
const salt = bcrypt.genSaltSync();

const testUser = {
  username: 'Kels',
  firstName: 'Kelvin',
  lastName: 'Smith',
  email: 'kelvin.smith@gmail.com',
  password: 'testing',
  pwConfirmation: 'testing'
};

const hashedUsers = fixtures.users.map((user) => ({
  ...user,
  password: bcrypt.hashSync(user.password, salt)
}));

let userToken = '';
let adminToken = '';

describe('Authentication', () => {

  before(() => {

    return models.sequelize.sync({ force: true })
    .then(() => Roles.bulkCreate(fixtures.roles))
    .then(() => Users.bulkCreate(hashedUsers))
    .catch((e) => {
      console.log(e, 'error');
    });
  });

  after((done) => {
    models.sequelize.sync({
      force: true
    })
      .then(() => {
        done();
      });
  });

  it('should be able to signup a user without authentication', (done) => {

    request(app)
      .post('/api/users')
      .send(testUser)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('User signup completed successfully');
        expect(res.body.user.firstName).to.equal(testUser.firstName);
        expect(res.body.user.email).to.equal(testUser.email);
        done(err);
      });
  });

  it('should sign in a valid user', (done) => {
    const loginDetails = {
      email: testUser.email,
      password: testUser.password
    };

    request(app)
      .post('/api/users/login')
      .send(loginDetails)
      .end((err, res) => {
        userToken = res.body.token;
        expect(res.body.message).to.equal('User login completed successfully');
        expect(res.body.user.firstName).to.equal(testUser.firstName);
        expect(res.body.user.email).to.equal(testUser.email);
        done(err);
      });
  });

  it('should sign in a valid admin', (done) => {
    const loginDetails = {
      email: fixtures.users[0].email,
      password: fixtures.users[0].password
    };

    request(app)
      .post('/api/users/login')
      .send(loginDetails)
      .end((err, res) => {
        adminToken = res.body.token;
        expect(res.body.user.firstName).to.equal(fixtures.users[0].firstName);
        expect(res.body.user.email).to.equal(fixtures.users[0].email);
        done(err);
      });
  });

  it('should not return all users if user is not a valid admin', (done) => {
    request(app)
      .get('/api/users/')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('Request Denied');
        done(err);
      });
  });

  it('should return all users if user is a valid admin', (done) => {

    request(app)
      .get('/api/users/')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.count).to.equal(fixtures.users.length + 1);
        done(err);
      });
  });

  it('should not authorize a user who supplies invalid token', (done) => {
    request(app)
      .get('/api/users/')
      .set('authorization', 'wrongToken')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('Unauthorized');
        done(err);
      });
  });

});
