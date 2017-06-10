import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from '../models';
import config from '../config/config';
import validateInput from '../shared/validations/signup';
import validateLogin from '../shared/validations/login';

const Users = models.Users;
const Roles = models.Roles;
const Documents = models.Documents;
const secretKey = config.jwtSecret;
const salt = bcrypt.genSaltSync();

const isLoggedInUser = (userId, queryId) => {
  if (parseInt(userId, 10) === parseInt(queryId, 10)) {
    return true;
  }
  return false;
};

const UserController = {
  create(req, res) {
    const userData = req.body;

    const { errors, isValid } = validateInput(userData);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const query = {
      where: {
        email: req.body.email
      }
    };
    const defaultRole = {
      where: {
        title: 'Writer'
      }
    };

    return Users.findOne(query)
      .then(checkReturnedUSer)
      .then(getDefaultRoleInfo)
      .then(createUser)
      .then(generateToken)
      .then(resHandler)
      .catch(errorHandler);


    function checkReturnedUSer(user) {
      if (user) {
        throw new Error('checkReturnedUSer');
      }
      return user;
    }

    function getDefaultRoleInfo() {
      return Roles.findOne(defaultRole);
    }

    function createUser(role) {
      return Users.create(Object.assign({}, userData, {
        roleId: role.id
      }));
    }

    function generateToken(newUserObj) {
      const payload = {
        roleId: newUserObj.roleId,
        email: newUserObj.email
      };
      return {
        newUser: newUserObj,
        token: jwt.sign(payload, secretKey, {
          expiresIn: '24h'
        })
      };
    }

    function resHandler(resObj) {
      return res.status(201).send(Object.assign({}, resObj, {
        message: 'User signup completed successfully'
      }));
    }

    function errorHandler(error) {
      const message = error.message;
      if (message === 'checkReturnedUSer') {
        return res.status(400).send({
          message: 'An account with that email address already exists'
        });
      }
      return res.status(500).send({
        message: 'Server error',
        error
      });
    }
  },

  login(req, res) {

    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // if (req.body.email && req.body.password)
    const { email } = req.body;
    const query = {
      where: {
        email
      }
    };

    return Users.findOne(query)
        .then((user) => {
          if (!user) {
            return res.status(404).send({
              message: 'Your account does not exist'
            });
          }
          if (Users.isPassword(user.password, req.body.password)) {
            const payload = {
              id: user.id,
              roleId: user.roleId,
              email: user.email
            };
            const token = jwt.sign(payload, secretKey, {
              expiresIn: '24h'
            });
            return res.status(201).send({
              userInfo: payload,
              message: 'User login completed successfully',
              token
            });
          }
          return res.status(401).send({
            message: 'Please, enter the correct password or email'
          });
        })
        .catch(error => {
          res.status(500).send({ message: 'Server error', error });
        });
  },

  findAll(req, res) {
    const isAdmin = req.user.roleId === 3;
    if (!isAdmin) {
      return res.status(403).send({
        message: 'Request denied'
      });
    }
    return Users.findAll()
      .then(allRegUsers => res.status(200).send(allRegUsers))
      .catch(error => res.status(500).send({
        message: 'Server error',
        error
      }));
  },

  findUser(req, res) {
    const query = req.params.id;
    Users.findById(query)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(500).send({
        message: 'Server error',
        error
      }));
  },

  deleteUser(req, res) {
    const isAdmin = req.user.roleId === 3;
    const { id } = req.params;
    const isUser = req.user.id === parseInt(id, 10);
    console.log(isUser, 'oooooo');

    if (isAdmin || isUser) {
      return Users.findById(id)
        .then(user => {
          if (!user) {
            return res.status(400).send({
              message: 'User not found'
            });
          }
          return user.destroy()
            .then(() => {
              res.status(204).send({
                message: 'User record deleted successfully'
              });
            })
            .catch(error => res.status(500).send({
              message: 'Server error', error })
            );
        })
        .catch(error => res.status(500).send({
          message: 'Server error', error })
        );
    }
    return res.status(403).send({
      message: 'Request denied'
    });
  },

  /**
   * 
   *
   * @param {any} req
   * @param {any} res
   * @returns
   */
  update(req, res) {
    const queryId = req.params.id;
    const userId = req.user.id;
    let encryptedPassword;
    const isUser = isLoggedInUser(userId, queryId);

    if (req.body.password) {
      encryptedPassword = bcrypt.hashSync(req.body.password, salt);

    }

    if (!isUser) {
      return res.status(403).send({
        message: 'Request denied'
      });
    }

    return Users.findById(queryId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          });
        }
        return user.update({
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          username: req.body.username || user.username,
          password: encryptedPassword || user.password,
          roleId: req.body.roleId || user.roleId
        })
          .then(() => res.status(200).send({
            message: 'User record updated successfully'
          }))
          .catch(error => res.status(500)
            .send({ message: 'Server error', error }));
      })
      .catch(error => res.status(500)
        .send({ message: 'Server error', error }));
  },

  // Admin privilege to update any user's role
  updateRole(req, res) {
    const isAdmin = req.user.roleId === 3;
    const queryId = parseInt(req.params.id, 10);
    if (!isAdmin) {
      return res.status(403).send({
        message: 'Request Denied'
      });
    }
    return Users.findById(queryId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          });
        }
        return user.update({
          roleId: req.body.roleId
        })
          .then(() => res.status(200).send({
            message: 'User role updated successfully'
          }))
          .catch(error => res.status(500)
            .send({ message: 'Server error', error }));
      })
      .catch(error => res.status(500).send(error));
  },

  findUserDoc(req, res) {
    const loggedInUser = req.user;
    const isAdmin = loggedInUser.roleId === 3;
    const id  = parseInt(req.params.id, 10);
    const isOwner = loggedInUser.id === id;
    if (!isOwner && !isAdmin) {
      return res.status(401).send({
        message: 'Request denied'
      });
    }

    if (isAdmin) {
      return Documents.findAll({
        where: {
          ownerId: id,
          access: {
            $ne: 'private'
          }
        }
      })
        .then(docs => {
          if (!docs) {
            return res.send(404).send({
              message: 'No document found'
            });
          }
          return res.status(200).send(docs);
        })
        .catch(error =>
          res.status(500).send({
            message: 'Server error',
            error
          }));
    }

    return Documents.findAll({
      where: {
        ownerId: id
      }
    })
    .then(docs => {
      if (!docs) {
        return res.send(404).send({
          message: 'No document found'
        });
      }
      return res.status(200).send(docs);
    })
    .catch(error =>
      res.status(500).send({
        message: 'Server error',
        error
      }));
  },

  search(req, res) {
    const loggedInUser = req.user;
    const { firstName, lastName } = req.query;
    Users.findAll({
      where: {
        firstName,
        lastName
      }
    })
      .then(users => {
        if (!users) {
          return res.status(404).send({
            message: 'No user record found'
          });
        }
        const filteredUsers = users.filter(user => user.id !== loggedInUser.id);
        return res.status(200).send(filteredUsers);
      })
      .catch(error => res.status(500)
        .send({ message: 'Server error', error }));
  },

  getCurrentUser(req, res) {
    const user = JSON.parse(JSON.stringify(req.user));
    const currentUser = Object.assign({}, user, { password: '' });
    return res.status(200).send(currentUser);
  },

  logout(req, res) {
    return res.status(200).send({ message: 'You have been successfully logged out' });
  }

};

export default UserController;
