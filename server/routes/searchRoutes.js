import express from 'express';
import userController from '../controllers/userController';
import documentController from '../controllers/documentController';
import config from '../config/jwtConfig/config';
import auth from '../middleware/auth';

const routes = () => {
  const searchRoutes = express.Router(); // eslint-disable-line

  searchRoutes.use(auth.authenticate('jwt', config.jwtSession));

  /**
   * @swagger
   * /api/search/users:
   *   get:
   *     tags:
   *       - Users
   *     description: Returns all users based on the search criteria
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: User's first or last name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: An array of users
   *         schema:
   *           $ref: '#/definitions/Users'
   */
  searchRoutes.get('/users/?', userController.search);

   /**
   * @swagger
   * /api/search/documents:
   *   get:
   *     tags:
   *       - Documents
   *     description: Returns all documents based on the search criteria
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: docTitle
   *         description: document title
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: An array of documents
   *         schema:
   *           $ref: '#/definitions/Documents'
   */
  searchRoutes.get('/documents/?', documentController.search);

  return searchRoutes;
};

export default routes;
