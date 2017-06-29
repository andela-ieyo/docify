import models from '../models';

const Documents = models.Documents;
const Users = models.Users;

/**
 *
 * @desc  checks if the request user is the owner of the requested document
 * @param {object} docId document id
 * @param {object} queryId id passed as params
 * @returns
 */
const checkDocOwner = (docId, queryId) => {
  if (parseInt(docId, 10) === parseInt(queryId, 10)) {
    return true;
  }
  return false;
};

/**
 *
 *
 * @param {object} roleId
 * @returns
 */
const checkIfWriter = (roleId) => {
  if (roleId === 1) {
    return true;
  }
  return false;
};

const documentController = {
  /**
   * @desc signup route
   *
   * @param {object} req
   * @param {object} res
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

    return Users.findOne({
      where: {
        id: loggedInUser.id
      }
    })
      .then(user => {
        Documents.create(
          Object.assign({},
          docData,
          { ownerId: loggedInUserId }
          ))
          .then(() => res.status(200).send({ message: 'Document created successfully.' }))
          .catch(error => res.status(500)
            .send({ message: 'Server error', error }));
      })
      .catch(error => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   * @desc retrieves all documents based on access privileges
   *
   * @param {object} req
   * @param {object} res
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
      .then(docs => res.status(200).send(docs))
      .catch(error => res.send(500)
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
        .then(docs => res.status(200).send(docs))
        .catch(error => res.status(404)
          .send({ message: 'No such Documents', error }));
    }
    return Documents.findAll()
      .then(docs => res.status(200).send(docs))
      .catch(error => res.status(500).send(error));
  },

  /**
   * @desc findOne route, to retrieve a single document using the id.
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} returns the document belonging to the id passed as params.
   */
  getOne(req, res) {
    const query = req.params.id;
    const loggedInUser = req.user;

    Documents.findById(query)
      .then(doc => {
        if (!doc) {
          return res.status(404).send({ message: 'Document not found' });
        }

        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);
        if (isOwner || loggedInUser.roleId === 3) {
          return res.status(200).send(doc);
        }
        return res.status(401).send({ message: 'Request denied' });
      })
      .catch(error =>
        res.status(500).send({ message: 'Server error', error }));
  },

  /**
   *
   * @desc updates a document using the id as the get params.
   * @param {any} req
   * @param {any} res
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
      .then(doc => {
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
          .catch(error =>
            res.status(500).send({ message: 'Server error', error }));
      })
      .catch(error => res.status(500)
        .send({ message: 'Server error', error }));
  },

  /**
   *
   * @desc deletes a document using the id as params
   * @param {any} req
   * @param {any} res
   * @returns {object} return a success message or an error message
   */
  deleteOne(req, res) {
    const loggedInUser = req.user;
    const isAdmin = loggedInUser.roleId === 3;
    const queryId = req.params.id;

    Documents.findById(queryId)
      .then(doc => {
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
            .catch(error => res.status(500)
              .send({ message: 'Server error', error }));
        }
        const isOwner = checkDocOwner(doc.ownerId, loggedInUser.id);
        if (!isOwner) {
          return res.status(401).send({ message: 'Request denied' });
        }
        return doc.destroy()
          .then(() => res.status(200)
            .send({ message: 'document deleted successfully' }))
          .catch(error => res.status(500)
            .send({ message: 'Server error', error }));
      })
      .catch(error => res.status(500)
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
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      })
        .then(docs => {
          if (docs.count === 0) {
            return res.status(404).send({ message: 'Not Found' });
          }
          return res.status(200).send(docs);
        })
        .catch(error => res.status(500)
          .send({ message: 'Server error', error }));
    }

    if (!isWriter && !isAdmin) {
      return Documents.findAndCountAll({
        offset,
        limit,
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
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      })
        .then(docs => {
          if (docs.count === 0) {
            return res.status(404).send({ message: 'Not Found' });
          }
          return res.status(200).send(docs);
        })
        .catch(error => res.status(500)
          .send({ message: 'Server error', error }));
    }

    return Documents.findAndCountAll({
      offset,
      limit,
      where: {
        title: {
          $iLike: `%${docTitle}%`
        }
      },
      include: [{ model: Users, attributes:['firstName', 'lastName'] }]
    })
      .then(docs => res.status(200).send(docs))
      .catch(error => res.status(500).send(error));
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
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'writer' }
          ]
        },
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      })
      .then(docs => res.status(200).send(docs))
      .catch(error => res.send(500)
        .send({ message: 'Server error', error }));
    }
    if (loggedInUserRoleId === editorId) {
      return Documents.findAndCountAll({
        offset,
        limit,
        where: {
          $or:
          [
            { access: 'public' },
            { ownerId: loggedInUserId },
            { access: 'editor' }
          ]
        },
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      })
        .then(docs => res.status(200).send(docs))
        .catch(error => res.status(404)
          .send({ message: 'No such Documents', error }));
    }
    return Documents.findAndCountAll(
      {
        offset,
        limit,
        include: [{ model: Users, attributes:['firstName', 'lastName'] }]
      }
    )
      .then(docs => res.status(200).send(docs))
      .catch(error => res.status(500).send(error));

  }

};

export default documentController;
