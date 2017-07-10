/* eslint-disable */
import chai from 'chai';
import db from '../../models/index';

const expect = chai.expect

describe('Document model', () => {
  beforeEach((done) => {
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
          .then((users) => {
            db.Documents.create({
              title: 'Game of Thrones',
              content: 'treachery, greed, sex',
              access: 'public',
              ownerId: 1
            })
            .then(() => {
              done();
            }).catch(error => console.log(error));
          })
        })
    })
  })

  afterEach((done) => {
    db.Documents.destroy({where: {}}).then(() => {
      db.Users.destroy({ where: {} }).then(() => {
        db.Roles.destroy({ where: {} }).then(()  => {
          done();
        });
      })
    })
    .catch(error => console.log(error));
  })

  describe('Create Document', () => {
    it('it should create a new document', (done) => {
      db.Documents.create({
        title: 'Lord of the Rings',
        content: 'Advennture,reality',
        access: 'public',
        ownerId: 1
      })
      .then((document) => {
        expect(document.title).to.equal('Lord of the Rings');
        done();
      })
    })
  })
  describe('Read Document', () => {
    it('It should fetch an existing document', (done) =>{
      db.Documents.findById(1)
        .then((document) => {
          expect(document.title).to.equal('Game of Thrones');
          done();
        })
    })
  })
  describe('Update Document', () => {
    it('it should update an existing document', (done) => {
      db.Documents.findById(1)
        .then((document) => {
          document.update({title: 'War Games'})
          .then(() => {
            expect(document.title).to.equal('War Games');
            expect(document.access).to.equal('public');
            done();
          })
        }).catch(error => console.log('something went wrong', error));
    })
  })
  describe('Delete document', () => {
    it('it should delete an existing document', (done) => {
      db.Documents.destroy({where: {id: 1}})
        .then(() => {
          db.Documents.findById(1)
            .then((document) => {
              expect(document).to.be.equal(null);
              done();
            })
        })
    })
  })
})