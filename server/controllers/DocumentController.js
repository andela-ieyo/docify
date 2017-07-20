import models from '../models';
import {
  paginate,
  checkIfWriter,
  checkDocOwner
 } from '../utils/utilFunctions';

const Documents = models.Documents;
const Users = models.Users;


const DocumentController = {
  /**
   * @desc signup route
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP Response Object
   * @returns {object} returns token, success message, and userInfo
   */
  create(req, res) {
    const docData = req.body;
    const loggedInUser = req.user;
    const loggedInUserId = parseInt(loggedInUser.id, 10);

    if (req.body.title === '' || req.body.content === ''
    || req.body.access === '') {
      return res.status(400).send({ message: 'All fields must not be empty' });
    }

    return Documents.findOne({
      where: {
        title: req.body.title
      }
    })
      .then((result) => {
        if (result) {
          return res.status(406).send({ message: 'A document with that title exists' });
        }

        return Users.findOne({
          where: {
            id: loggedInUser.id
          }
        })
        .then((user) => {
          Documents.create(
            Object.assign({},
            docData,
            { ownerId: loggedInUserId }
          ))
            .then((document) => res.status(200).send({ document, message: 'Document created successfully' }))
            .catch((error) => res.status(500)
              .send({ message: 'Server error', error }));
        });
      })
      .catch((error) => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   * @desc retrieves all documents based on access privileges
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP Response Object
   * @returns {array} all documents accessible by the user
   */
  getAll(req, res) {
    const loggedInUser = req.user;
    const loggedInUserId = req.user.id;
    const loggedInUserRoleId = loggedInUser.roleId;
    const isWriter = checkIfWriter(loggedInUserRoleId);
    const editorId = 2;

    if (isWriter) {
      return Documents.findAll({
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'writer' }
          ]
        }
      })
      .then((docs) => res.status(200).send(docs))
      .catch((error) => res.send(500)
        .send({ message: 'Server error', error }));
    }

    if (loggedInUserRoleId === editorId) {
      return Documents.findAll({
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'editor' }
          ]
        }
      })
        .then((docs) => res.status(200).send(docs))
        .catch((error) => res.status(404)
          .send({ message: 'No such Documents', error }));
    }
    return Documents.findAll()
      .then((docs) => res.status(200).send(docs))
      .catch((error) => res.status(500).send(error));
  },

  /**
   * @desc findOne route, to retrieve a single document using the id.
   *
   * @param {object} req - HTTP Request Object
   * @param {object} res - HTTP Response Object
   * @returns {object} returns the document belonging to the id passed as params.
   */
  getOne(req, res) {
    const query = req.params.id;
    const loggedInUser = req.user;

    if (query < 0) {
      return res.status(400).send({ message: 'Request Denied' });
    }

    return Documents.findById(query)
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({ message: 'Document not found' });
        }

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);

        if (isOwner || loggedInUser.roleId === 3) {
          return res.status(200).send(doc);
        }
        return res.status(401).send({ message: 'Request denied' });
      })
      .catch((error) =>
        res.status(500).send({ message: 'Server error', error }));
  },

  /**
   * @desc updates a document using the id as the get params.
   *
   * @param {any} req - HTTP Request Object
   * @param {any} res - HTTP Response Object
   * @returns {object} returns success message for a successful update or an error message.
   */
  update(req, res) {
    const query = req.params.id;
    const loggedInUser = req.user;
    const { title, access, content } = req.body;

    if (!title || !content
    || !access) {
      return res.status(400).send({ message: 'All fields must not be empty' });
    }

    return Documents.findById(query)
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({ message: 'Document not found' });
        }

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);

        if (!isOwner) {
          return res.status(401).send({ message: 'Request denied' });
        }
        return doc.update({
          title: req.body.title,
          content: req.body.content,
          access: req.body.access
        })
          .then(() =>
            res.status(200).send({ message: 'Document updated successfully' }))
          .catch((error) =>
            res.status(500).send({ message: 'Server error', error }));
      })
      .catch((error) => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   * @desc deletes a document using the id as params
   *
   * @param {any} req - HTTP Request Object
   * @param {any} res - HTTP Response Object
   * @returns {object} return a success message or an error message
   */
  deleteOne(req, res) {
    const loggedInUser = req.user;
    const isAdmin = loggedInUser.roleId === 3;
    const queryId = req.params.id;

    if (queryId < 0) {
      return res.status(400).send({ message: 'Request Denied' });
    }

    return Documents.findById(queryId)
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({ message: 'Document does not exist' });
        }

        if (isAdmin) {
          const isPrivate = doc.access === 'private';
          const ownedByAdmin = doc.ownerId === loggedInUser.id;

          if (isPrivate && !ownedByAdmin) {
            return res.status(401).send({ message: 'Request denied' });
          }
          return doc.destroy()
            .then(() => res.status(200)
              .send({ message: 'Document deleted successfully' }))
            .catch((error) => res.status(500)
              .send({ message: 'Server error', error }));
        }

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);

        if (!isOwner) {
          return res.status(401).send({ message: 'Request denied' });
        }
        return doc.destroy()
          .then(() => res.status(200)
            .send({ message: 'document deleted successfully' }))
          .catch((error) => res.status(500)
            .send({ message: 'Server error', error }));
      })
      .catch((error) => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   *
   * @desc search based on doc title.
   * @param {object} req
   * @param {object} res
   * @returns {array} returns all docs matching the search query
   */
  search(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const { docTitle } = req.query;
    const isAdmin = req.user.roleId === 3;
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser.id;
    const isWriter = checkIfWriter(loggedInUser.roleId);

    if (isWriter) {
      return Documents.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ['ownerId'] },
        order: [
        ['createdAt', 'DESC']
        ],
        where: {
          title: {
            $iLike: `%${docTitle}%`
          },
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'writer' }
          ]
        },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      })
        .then((docs) => {
          if (docs.count === 0) {
            return res.status(404).send({ message: 'Not Found' });
          }

          const count = docs.count;
          const pagination = paginate(count, limit, offset);
          return res.status(200).send({
            rows: docs.rows,
            User: docs.User,
            ...pagination
          });
        })
        .catch((error) => res.status(500)
          .send({ message: 'Server error', error }));
    }

    if (!isWriter && !isAdmin) {
      return Documents.findAndCountAll({
        offset,
        limit,
        order: [
        ['createdAt', 'DESC']
        ],
        attributes: { exclude: ['ownerId'] },
        where: {
          title: {
            $iLike: `%${docTitle}%`
          },
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'writer' },
            { access: 'editor' }
          ]
        },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      })
        .then((docs) => {
          if (docs.count === 0) {
            return res.status(404).send({ message: 'Not Found' });
          }

          const count = docs.count;
          const pagination = paginate(count, limit, offset);
          return res.status(200).send({
            rows: docs.rows,
            User: docs.User,
            ...pagination
          });
        })
        .catch((error) => res.status(500)
          .send({ message: 'Server error', error }));
    }

    return Documents.findAndCountAll({
      offset,
      limit,
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: { exclude: ['ownerId'] },
      where: {
        title: {
          $iLike: `%${docTitle}%`
        }
      },
      include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
    })
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: docs.rows,
          User: docs.User,
          ...pagination
        });
      })
      .catch((error) => res.status(500).send(error));
  },

  /**
   *
   * @desc this endpoint retrieves all documents. It is paginated.
   * It has a default limit of 10.
   * @param {any} req
   * @param {any} res
   * @returns {array} returns an array of all doc objects.
   */
  getPaginatedDocs(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const loggedInUser = req.user;
    const loggedInUserId = req.user.id;
    const loggedInUserRoleId = loggedInUser.roleId;
    const isWriter = checkIfWriter(loggedInUserRoleId);
    const editorId = 2;

    if (isWriter) {
      return Documents.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ['ownerId'] },
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'writer' }
          ]
        },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      })
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: docs.rows,
          User: docs.User,
          ...pagination
        });
      })
      .catch((error) => res.send(500)
        .send({ message: 'Server error', error }));
    }

    if (loggedInUserRoleId === editorId) {
      return Documents.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ['ownerId'] },
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'editor' }
          ]
        },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      })
        .then((docs) => {
          const count = docs.count;
          const pagination = paginate(count, limit, offset);
          res.status(200).send({
            rows: docs.rows,
            User: docs.User,
            ...pagination
          });
        })
        .catch((error) => res.status(404)
          .send({ message: 'No such Documents', error }));
    }
    return Documents.findAndCountAll(
      {
        offset,
        limit,
        attributes: { exclude: ['ownerId'] },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      }
    )
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: docs.rows,
          User: docs.User,
          ...pagination
        });
      })
      .catch((error) => res.status(500).send(error));

  },

  getPrivateDocs(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser.id;

    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request Denied' });
    }

    return Documents.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['ownerId'] },
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        $or:
        [
          { ownerId: loggedInUserId }
        ]
      },
      include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
    })
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: docs.rows,
          User: docs.User,
          ...pagination });
      })
      .catch((error) => res.send(500)
        .send({ message: 'Server error', error }));

  },

  getPublicDocs(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request Denied' });
    }

    return Documents.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['ownerId'] },
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        access: 'public'
      },
      include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
    })
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({ rows: docs.rows, User: docs.User, ...pagination });
      })
      .catch((error) => res.send(500)
        .send({ message: 'Server error', error }));

  },

  getRoleDocs(req, res) {
    const limit = req.query.limit || 10;
    const offset = (req.query.page || 0) * limit;
    const loggedInUser = req.user;
    const loggedInUserRoleId = loggedInUser.roleId;
    const isWriter = checkIfWriter(loggedInUserRoleId);
    const editorId = 2;

    if (!loggedInUser) {
      return res.status(403).send({ message: 'Request Denied' });
    }

    if (isWriter) {
      return Documents.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ['ownerId'] },
        order: [
        ['createdAt', 'DESC']
        ],
        where: {
          access: 'writer'
        },
        include: [{ model: Users, attributes:['id', 'firstName', 'lastName'] }]
      })
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({ rows: docs.rows, User: docs.User, ...pagination });
      })
      .catch((error) => res.send(500)
        .send({ message: 'Server error', error }));
    }

    if (loggedInUserRoleId === editorId) {
      return Documents.findAndCountAll({
        offset,
        limit,
        order: [
        ['createdAt', 'DESC']
        ],
        where: {
          $or:
          [
            { access: 'writer' },
            { access: 'editor' }
          ]
        },
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      })
        .then((docs) => {
          const count = docs.count;
          const pagination = paginate(count, limit, offset);
          res.status(200).send({
            rows: docs.rows,
            User: docs.User,
            ...pagination
          });
        })
        .catch((error) => res.status(404)
          .send({ message: 'No such Documents', error }));
    }

    return Documents.findAndCountAll(
      {
        offset,
        limit,
        order: [
        ['createdAt', 'DESC']
        ],
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      }
    )
      .then((docs) => {
        const count = docs.count;
        const pagination = paginate(count, limit, offset);
        res.status(200).send({
          rows: docs.rows,
          User: docs.User,
          ...pagination
        });
      })
      .catch((error) => res.status(500).send(error));
  }

};

export default DocumentController;
