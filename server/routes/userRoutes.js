import express from 'express';
import userController from '../controllers/user';
import config from '../config/middlewares/config';
import auth from '../config/middlewares/auth';

const routes = () => {
  const userRoutes = express.Router(); // eslint-disable-line

  /**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - User
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
  userRoutes.post('/users', userController.create);

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
  userRoutes.post('/users/login', userController.login);

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
  userRoutes.get('/users/logout', userController.logout);

  // token authentication middleware
  userRoutes.use(auth.authenticate('jwt', config.jwtSession));

/**
 * @swagger
 * definition:
 *   Users:
 *     properties:
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
  userRoutes.get('/users', userController.findAll);

  // verify current user when browser reloads
  userRoutes.get('/users/current', userController.getCurrentUser);


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
  userRoutes.get('/users/:id', userController.findUser);

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

  userRoutes.delete('/users/:id', userController.deleteUser);


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
  userRoutes.put('/users/:id', userController.update);

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
  userRoutes.put('/users/role/:id', userController.updateRole);

  // retrieve all docs belonging to a specific user
  userRoutes.get('/users/:id/documents', userController.findUserDoc);


  /**
 * @swagger
 * /api/search/users/:
 *   get:
 *     tags:
 *       - Users
 *     description: Search for a user
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
  userRoutes.get('/search/users/', userController.search);

  return userRoutes;
};

export default routes;
