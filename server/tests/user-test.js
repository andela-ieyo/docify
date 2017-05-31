import bcrypt from 'bcrypt';
import chai from 'chai';
import request from 'supertest';
import models, { Users, Roles } from '../models';
import app from '../../server';
import fixtures from './seed-data/fixtures.json';

const should = chai.should();
const salt = bcrypt.genSaltSync();

const syncModel = models.sequelize.sync();

const seededRoles = fixtures.roles;

const createRoles = Roles.bulkCreate(seededRoles);

const hashedUsers = fixtures.users.map(user => {
  user.password = bcrypt.hashSync(user.password, salt);
  return user;
});

const createUsers = Users.bulkCreate(hashedUsers);

let token;

// chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
  beforeEach((done) => {
    models.sequelize.sync().then(() => {
      Promise.all([createRoles, createUsers]).then((results) => {
        request(app)
          .post('/api/users/login')
          .send({
            email: 'precious.ijege@gmail.com',
            password: 'testing'
          })
          .end((err, res) => {
            token = res.body.token;
            done();
          });
      }, err => {
        console.log(err);
        done();
      }).catch(console.log);
    });
  });

  afterEach((done) => { //Before each test we empty the database
  // drops table and re-creates it
    models.sequelize.sync({ force: true }).then(() => {
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
          res.status.should.equal(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

});

describe('/POST Users', () => {
  it('it should post user without error', (done) => {
    const user = {
      username: 'Kel',
      firstName: 'Kelvin',
      lastName: 'Smith',
      email: 'kelvin.smith@gmail.com',
      password: 'testing'
    };
    request(app)
          .post('api/users')
          .send(user)
          .end((err, res) => {
            console.log(res, 'ooooo');
            // res.status.should.equal(200);
            // res.body.should.be.a('object');
              // res.body.should.have.property('errors');
              // res.body.errors.should.have.property('pages');
              // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
  });
});
