import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Documents = models.Documents;
const Users = models.Users;
const Roles = models.Roles;

const checkDocOwner = (docId, queryId) => {
  if (parseInt(docId, 10) === parseInt(queryId, 10)) return true;
};

const checkUserRole = (roleId) => {
  if (roleId === 1) return true;
}; 

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
  },

  getAll(req, res) {
    const loggedInUserRoleId = req.user.roleId;
    const restrictedUser = checkUserRole(loggedInUserRoleId);
    if(restrictedUser) {
      return res.status(403).send({ message: 'Request Denied!' });
    };
    if (loggedInUserRoleId === 2) {
      return Documents.findAll({
        where: {
          $or: 
          [
            { access: 'public' }, 
            { ownerId: loggedInUserRoleId},
            {access: 'Editor' }
          ]
        }
      })
        .then(docs => res.status(200).send(docs))
        .catch(error => res.status(404).send({ message: 'No such Documents'}));
    };
    Documents.findAll()
      .then(docs => res.status(200).send(docs))
      .catch(error => res.status(500).send(error));
  },

  getOne(req, res) {
    const query = req.params.id;
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request Denied! SignIn to view documents'})
    }
    Documents.findById(query)
      .then(doc => {
        if(!doc) {
          return res.status(404).send({ message: 'Document not found'});
        };

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);
        if(isOwner || loggedInUser.roleId === 3) {
          return res.status(200).send(doc); 
        }
        return res.status(401).send({ message: 'Request denied' });
      })
      .catch(error => 
        res.status(500).send({message: 'Server error', error: error}));
  },

  update(req, res) {
    const query = req.params.id;
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request Denied! SignIn to update documents'})
    }
    Documents.findById(query)
      .then(doc => {
        if(!doc) {
          return res.status(404).send({ message: 'Document not found'});
        };

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);
        if(!isOwner) {
          return res.status(401).send({ message: 'Request denied' });
        };
        doc.update({
          title: req.body.title || doc.title,
          content: req.body.content || doc.content,
          access: req.body.access || doc.access,
          ownerId: doc.ownerId
        })
          .then(() => 
            res.status(200).send({ message: 'Document updated successfully'}))
          .catch(error => 
            res.status(500).send({ message: 'Server error', error: error}));
      })
      .catch(error => res.status(500).send({message: 'Server error'}));
  },

  deleteOne(req, res) {
    const loggedInUser = req.user
    const isAdmin = loggedInUser.roleId === 3;
    const queryId = req.params.id;
    ;

    Documents.findById(queryId)
      .then(doc => {
        if(!doc) {
          return res.status(404).send({ message: 'Document does not exist'});
        };
        if (isAdmin) {
          const isPrivate = doc.access === 'private';
          const ownedByAdmin = doc.ownerId === loggedInUser.id;
          if(isPrivate && !ownedByAdmin) {
            return res.status(401).send({ message: 'Request denied'});
          }
          return doc.destroy()
            .then(() => res.status(200)
              .send({ message: 'Document deleted successfully'}))
            .catch(error => res.status(500)
              .send({ message: 'Server error', error: error}));
        }
        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id); 
        if (!isOwner) {
          return res.status(401).send({ message: 'Request denied'});
        }
        doc.destroy()
          .then(() => res.status(200)
            .send({message: 'document deleted successfully'}))
          .catch(() => res.status(500)
            .send({ message: 'Server error', error: error}));     
      })
      .catch(error => res.status(500)
        .send( {message: 'Server error', error: error}));  
  },

}

export default documentController;
