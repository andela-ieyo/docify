import express from 'express';
import userController from '../controllers/userController';
import config from '../config/jwtConfig/config';
import auth from '../middleware/auth';
import adminValidator from '../middleware/adminValidator';

const routes = () => {
  const userRoutes = express.Router(); // eslint-disable-line

  /**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Users'
 *     responses:
 *       200:
 *         description: Successfully created
 */
  userRoutes.post('/', userController.create);

  /**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: log in a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Users'
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
  userRoutes.post('/login', userController.login);

  /**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     description: Logs out a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Users'
 *     responses:
 *       200:
 *         description: Successfully logged out.
 */
  userRoutes.get('/logout', userController.logout);

  // token authentication middleware
  userRoutes.use(auth.authenticate('jwt', config.jwtSession));

  // verify current user when browser reloads
  userRoutes.get('/current', userController.getCurrentUser);


  /**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  userRoutes.get('/:id', userController.findUser);

  /**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  userRoutes.put('/:id', userController.update);

  userRoutes.delete('/', userController.deleteMyAccount);

   /**
   * @swagger
   * /api/users/{id}/documents:
   *   get:
   *     tags:
   *       - Users Documents
   *     description: Returns all of the users Documents
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of documents
   *         schema:
   *           $ref: '#/definitions/Documents'
   */

  userRoutes.get('/:id/documents', userController.findUserDoc);

  userRoutes.use(adminValidator);

 /**
 * @swagger
 * /api/users/role/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a single user role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  userRoutes.put('/role/:id', userController.updateRole);


    /**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */

  userRoutes.delete('/:id', userController.deleteUser);

  /**
 * @swagger
 * /api/users/?:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: offset
 *         description: number of data rows to skip
 *         in: path
 *         required: true
 *         type: integer
 *       - name: limit
 *         description: number of rows to return
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  userRoutes.get('/?', userController.getAllUsers);

/**
* @swagger
* definition:
*   Documents:
*     properties:
*       title:
*         type: string
*       content:
*         type: text
*       access:
*         type: string
*       ownerId:
*         type: integer
*/

  /**
 * @swagger
 * definition:
 *   Users:
 *     properties:
 *       id:
 *         type: integer
 *       firstName:
 *         type: string
 *       LastName:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       roleId:
 *         type: integer
 */

  /**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  userRoutes.get('/', userController.findAll);

  return userRoutes;
};

export default routes;
