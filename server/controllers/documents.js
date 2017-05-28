import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Documents = models.Documents;
const Users = models.Users;
const Roles = models.Roles;

const documentController = {
  create(req, res) {
    const userData = req.body;
    const loggedInUser = req.user;
    if( req.body.title === '' || req.body.content === '' 
    || req.body.access === '') {
      return res.status(400).send({ message: 'All fields must not be empty'});
    }
    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request denied'});
    }

    Users.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        Documents.create(Object.assign({}, userData, { ownerId: user.id }))
          .then(() => res.status(200).send({ message: 'Document created successfully.' }))
          .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(500).send(error));
  }
}

export default documentController;
