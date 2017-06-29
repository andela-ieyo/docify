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
 *     consumes:
 *       - x-www-form-urlencoded
 *     parameters:
 *       - name: firstName
 *         description: User's first name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User's last name
 *         in: form
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: username
 *         description: User's username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: pwConfirmation
 *         description: password confirmation
 *         in: formData
 *         required: true
 *         type: string
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
 *     consumes:
 *       - x-www-form-urlencoded
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
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
 *     consumes:
 *       - x-www-form-urlencoded
 *     parameters:
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: firstName
 *         description: User's first name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User's last name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: username
 *         description: User's username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
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
   *       - Users
   *     description: Returns all of the users Documents
   *     produces:
   *       - application/json
   *     parameters:
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
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
 *     consumes:
 *       - x-www-form-urlencoded
 *     parameters:
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: roleId
 *         description: User's new roleId
 *         in: formData
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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: offset
 *         description: number of data rows to skip
 *         in: path
 *         required: false
 *         type: integer
 *       - name: limit
 *         description: number of rows to return
 *         in: path
 *         required: false
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
*         type: string
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
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
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
