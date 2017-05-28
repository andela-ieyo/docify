import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Users = models.Users;
const Roles = models.Roles;

 const isLoggedInUser = (userId, queryId) => {
    if (parseInt(userId) === parseInt(queryId)) return true;
  };

const UserController = {
   create(req, res) {
    const userData = req.body;
    Users.findOne({
      where: {
        $or: [
          {email: req.body.email},
          {username: req.body.username},
        ]
      }
    })
    .then((dbUser) => {
      if (dbUser) { // dbUser.username || dbUser.email
        return res.status(409).send({ message: 'An account with that email address already exists' });
      }
      Roles.findOne({
        where:{
          title: 'Writer'
        }
      }).then((role) =>
        Users.create(Object.assign({}, userData, { roleId: role.id }))
          .then((newUser) => {
            const payload = {
              roleId: newUser.roleId,
              email: newUser.email
            };
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
            return res.status(201).send({
              newUser,
              message: 'User signup completed successfully',
              token
            });
          })
      )
    })
    .catch(error => res.status(500).send(error));
  },

  login(req, res) {
    if (req.body.email && req.body.password ){
      const { email } = req.body;
      const query = { where: { email } };

      Users.findOne(query)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: 'Your account does not exist'});
          }
          if (Users.isPassword(user.password, req.body.password)) {
            const payload =  {
              id: user.id,
              roleId: user.roleId,
              email: user.email,
            };
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
            return res.status(201).send({
              message: 'User login completed successfully',
              token
            });
          } else {
            res.status(401).send({message: 'Please, enter the correct password or email'})
          };
        })
        .catch(error => {
          res.status(500).send(error);
        });
      } else return res.status(406).send('Enter a valid email address and password');
  },

  findAll(req, res) {
    const isAdmin = req.user.roleId === 3;
    if (!isAdmin){
      return res.status(403).send({ message: 'Request denied' })
    };
    Users.findAll()
      .then(allRegUsers => res.status(200).send(allRegUsers))
      .catch(error => res.status(500).send({ message: 'Server error' }));
  },

  findUser(req, res) {
    const query = req.params.id;
    Users.findById(query)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: 'User not found'});
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(500).send({message: 'Server error'}));
  },

  deleteUser(req, res) {
    const isAdmin = req.user.roleId === 3;
    const { id } = req.params;
    if (!isAdmin) {
      return res.status(403).send({ message: 'Request denied'});
    }

    Users.findById(id)
      .then(user => {
        if (!user) {
          return res.status(400).send({ message: 'User not found' });
        }
        Users.destroy()
          .then(() => {
            res.status(204).send({message: 'User record deleted successfully'});
          })
          .catch(error => res.status(500).send({message: 'Server error'}));
      })
      .catch(error => res.status(500).send({message: 'Server error'}));
  },

  update(req, res) {
    const queryId = req.params.id;
    const userId = req.user.id;
    const isUser = isLoggedInUser(userId, queryId);
    if(!isUser) {
      return res.status(403).send({ message: 'Request denied'});
    }

    Users.findById(queryId)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: 'User not found'});
        }
        user.update({
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          username: req.body.username || user.username,
          password: req.body.password || user.password,
          roleid: req.body.roleId || user.roleId
        })
        .then(() => {
          return res.status(200).send({ message: 'User record updated successfully'});
        })
        .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(500).send(error));   
  },

// Admin privilege to update any user's role 
  updateRole(req, res) {
    const isAdmin = req.user.roleId === 3;
    const queryId = req.params.id;
    console.log(queryId, 'query', req);
    if(!isAdmin) {
      return res.status(403).send({ message: 'Request Denied' });
    }
    Users.findById(queryId)
      .then(user => {
         if (!user) {
          return res.status(404).send({ message: 'User not found'});
        }
        user.update({
          roleId: req.body.roleId
        })
        .then(() => {
          return res.status(200).send({ message: 'User role updated successfully'});
        })
        .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(500).send(error));
  }

}

export default UserController;

