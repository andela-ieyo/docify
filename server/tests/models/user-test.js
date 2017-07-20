/* eslint-disable */
import chai from 'chai';
import db from '../../models/index';

const expect = chai.expect;


describe('Users model', () => {
  before((done) => {
    db.sequelize.sync({force: true}).done(() => {
      db.Roles.bulkCreate([
        { title: 'Writer' },
        { title: 'Editor' },
        { title: 'Admin' }
        ])
        .then(() => {
          db.Users.create({
            firstName: 'Ifiok',
            lastName: 'Eyo',
            username: 'Admin',
            email: 'ifiokabasi.eyo@andela.com',
            password: 'testing',
            roleId: 3
          })
          .then(() => {
            done();
          })
      })
    })
  })


  after((done) => {
    db.Roles.destroy({where: {}}).then(() => {
      done();
    })
  })


  describe('Create User', () => {
    it('should fail with invalid email address', (done) => {
      db.Users.create({
        firstName: 'ghost',
        lastName: 'ghost',
        username: 'ghost',
        email: 'tttttt',
        password: 'ghost2345678',
        roleId: 1
      })
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Please enter a valid email address');
          done();
        });
    });

    it('should fail if first name field is empty', (done) => {
      db.Users.create({
        firstName: '',
        lastName: 'ghost',
        username: 'ghost',
        email: 'ghost@ghost.com',
        password: 'ghost2345678',
        roleId: 1
      })
      .then()
      .catch((error) => {
        expect(error.errors[0].message).to.equal('The firstName field cannot be empty');
        done();
      });
    });

    it('should fail if last name field is empty', (done) => {
      db.Users.create({
        firstName: 'ghost',
        lastName: '',
        username: 'ghost',
        email: 'ghost@ghost.com',
        password: 'ghost2345678',
        roleId: 1
      })
      .then()
      .catch((error) => {
        expect(error.errors[0].message).to.equal('The lastName field cannot be empty');
        done();
      });
    });

    it('should fail if last name field is empty', (done) => {
      db.Users.create({
        firstName: 'ghost',
        lastName: 'ghost',
        username: '',
        email: 'ghost@ghost.com',
        password: 'ghost2345678',
        roleId: 1
      })
      .then()
      .catch((error) => {
        expect(error.errors[0].message).to.equal('The username field cannot be empty');
        done();
      });
    });

    it('should fail if password length is not greater than 5', (done) => {
      db.Users.create({
        firstName: 'ghost',
        lastName: 'ghost',
        username: 'ghost',
        email: 'ghost@ghost.com',
        password: 'ghos',
        roleId: 1
      })
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Must be greater than 5 characters');
          done();
        });
    });

    it('should create a new user', (done) => {
      db.Users.create({
        firstName: 'ghost',
        lastName: 'ghost',
        username: 'ghost',
        email: 'ghost@ghost.com',
        password: 'ghost2345678',
        roleId: 1
      })
        .then((user) => {
          expect(user.firstName).to.equal('ghost');
          expect(user.lastName).to.equal('ghost');
          expect(user.email).to.equal('ghost@ghost.com');
          done();
        })
    })
  })

  describe('Read user', () => {
    it('it should fetch a user details', (done) => {
      db.Users.findById(1)
        .then((user) => {
          expect(user.lastName).to.equal('Eyo');
          done();
        })
    })
  })

  describe('Update user', () => {
    it('it should update an existing user', (done) => {
      db.Users.findById(1)
        .then((user) => {
          user.update({firstName: 'Wisdom' })
            .then(() => {
              expect(user.firstName).to.equal('Wisdom');
              expect(user.lastName).to.equal('Eyo');
              expect(user.email).to.equal('ifiokabasi.eyo@andela.com');
              done();
            })
        })
    })
  })

  describe('Delete user', () => {
    it('it should delete an existing user', (done) => {
      db.Users.destroy({where: {id: 1 } })
        .then(() => {
          db.Users.findById(1)
            .then((user) => {
              expect(user).to.be.equal(null);
              done();
            })
        })
    })
  })
})
