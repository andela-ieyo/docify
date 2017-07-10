import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import models from '../models';
import config from '../config/jwtConfig/config';
import validateInput from '../shared/validations/signup';
import validateLogin from '../shared/validations/login';
import { paginate } from '../middleware/validator';

const Users = models.Users;
const Roles = models.Roles;
const Documents = models.Documents;
const secretKey = config.jwtSecret;
const salt = bcrypt.genSaltSync();

/**
 *
 * @desc checks if a user is a registered user.
 * @param {number} userId
 * @param {number} queryId id passeds as params.
 * @returns {boolean} returns true or false
 */
const isLoggedInUser = (userId, queryId) => {
  if (parseInt(userId, 10) === parseInt(queryId, 10)) {
    return true;
  }
  return false;
};

const UserController = {
  /**
   * @desc sign up controller
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {object} returns userObject, token, success message
   */
  create(req, res) {
    const userData = req.body;
    const { firstName, lastName, username, email, password } = req.body;

    const { errors, isValid } = validateInput(userData);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const query = {
      where: {
        email
      }
    };

    return Users.findOne(query)
      .then(user => {
        if (user) {
          return res.status(400).send({
            message: 'An account with that email address already exists'
          });
        }

        return Users.create(
          {
            firstName,
            lastName,
            email,
            username,
            password,
            roleId: 1
          }
        )
          .then(userObj => {
            const payload = {
              roleId: userObj.roleId,
              email: userObj.email
            };

            const userInfo = {
              firstName: userObj.firstName,
              lastName: userObj.lastName,
              email: userObj.email,
              roleId: userObj.roleId,
              id: userObj.id
            };

            const token = jwt.sign(payload, secretKey, {
              expiresIn: '24h'
            });

            res.status(200).send(
              {
                user: userInfo,
                token,
                message: 'User signup completed successfully'
              }
            );
          })
          .catch(error => {
            res.status(500).send({ message: 'Server error', error });
          });
      })
      .catch(error => {
        res.status(500).send({ message: 'Server error', error });
      });
  },

  /**
   * @desc Login route.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP Response Object
   * @returns {object} returns user, token, and success message.
   */
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
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            };

            const token = jwt.sign(payload, secretKey, {
              expiresIn: '24h'
            });

            return res.status(201).send({
              user: payload,
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

  /**
   * @desc This route gets all registered users. It is not paginated.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {array} returns an array of all registered users.
   */
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

  /**
   * @desc This route deletes a user's record. UserId is required as params.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {object} returns a success message or an error message if it fails.
   */
  deleteUser(req, res) {
    const { id } = req.params;

    Users.findById(id)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User not found'
          });
        }

        if (parseInt(user.roleId, 10) === 3) {
          return res.status(403)
            .send({ message: 'User cannot be deleted' });
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
  },

  /**
   * @desc updates user record
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {object} returns a success message or an error message
   */
  update(req, res) {
    const queryId = req.params.id;
    const userId = req.user.id;
    let encryptedPassword;
    const isUser = isLoggedInUser(userId, queryId);

    if (req.body.password && req.body.password.length > 0 && req.body.password.length < 6) {
      return res.status(400)
        .send({ message: 'password must be at least 6 characters' });
    }

    if (req.body.password >= 6) {
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
          email: req.body.email || user.email,
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

  /**
   * @desc updates a user's record. The docId is passed as params.
   *
   * @param {any} req - HTTP Request Object
   * @param {any} res - HTTP response object
   * @returns {object} a success message or an error message if the process fails
   */
  updateRole(req, res) {
    const queryId = parseInt(req.params.id, 10);

    Users.findById(queryId)
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

  /**
   * @desc route to get all docs belonging to a particular user. It takes an userId as params.
   *
   * @param {object} req
   * @param {object} res - HTTP response object
   * @returns {array} all docs belonging to the user with the id passed as params.
   */
  findUserDoc(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const loggedInUser = req.user;
    const isAdmin = loggedInUser.roleId === 3;
    const id  = parseInt(req.params.id, 10);
    const isOwner = loggedInUser.id === id;

    if (!isOwner && !isAdmin) {
      return res.status(401).send({
        message: 'Request denied'
      });
    }

    console.log('i was here');

    if (isAdmin) {
      return Documents.findAndCountAll({
        offset,
        limit,
        where: {
          ownerId: id,
          access: {
            $ne: 'private'
          }
        },
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
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

    return Documents.findAndCountAll({
      offset,
      limit,
      where: {
        ownerId: id
      },
      include: [{ model: Users, attributes:['firstName', 'lastName'] }]
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

  /**
   * @desc search based on user's firstname or lastname.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {array} returns all users matching the search query.
   */
  search(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const { name } = req.query;
    Users.findAndCountAll({
      offset,
      limit,
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        $or: [
          { firstName: { $iLike: `%${name}%` } },
          { lastName: { $iLike: `%${name}%` } }
        ]
      },
      include: [{ model: Roles, attributes:['title'] }]
    })
      .then(users => {
        if (users.count === 0) {
          return res.status(404).send({
            message: 'No user record found'
          });
        }

        const count = users.count;
        const pagination = paginate(count, limit, offset);

        return res.status(200).send({
          rows: users.rows,
          Role: users.Role,
          ...pagination
        });
      })
      .catch(error => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   * @desc gets the current user info.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {object} returns the user's info.
   */
  getCurrentUser(req, res) {
    const user = JSON.parse(JSON.stringify(req.user));
    const currentUser = Object.assign({}, user, { password: '' });
    return res.status(200).send(currentUser);
  },

  /**
   * @desc this endpoint logs out a user.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {string} returns a succes message.
   */
  logout(req, res) {
    return res.status(200).send({ message: 'You have been successfully logged out' });
  },

  /**
   * @desc This route gets all registered users. It is a paginated route,
   *  with default limit set to 10.
   *
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {array} returns an array of all registered users.
   */
  getAllUsers(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;

    Users.findAndCountAll({
      offset,
      limit,
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: { exclude: ['roleId'] },
      include: [{ model: Roles, attributes:['id', 'title'] }]
    })
      .then(allRegUsers => {
        const count = allRegUsers.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: allRegUsers.rows,
          Role: allRegUsers.Role,
          ...pagination
        });
      })
      .catch(error => res.status(500).send({
        message: 'Server error',
        error
      }));
  },

  /**
   * @desc this endpoint deletes a user's account. It requires the userId to be passed as params.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP response object
   * @returns {string} returns a success message or an error message
   */
  deleteMyAccount(req, res) {
    const { email } = req.query;
    const isOwner = req.user.email === email;
    const id  = parseInt(req.user.id, 10);

    if (!isOwner) {
      return res.status(403).send({ message: 'This email does not belong to you' });
    }
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
              message: 'User account deleted successfully'
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
};


export default UserController;
