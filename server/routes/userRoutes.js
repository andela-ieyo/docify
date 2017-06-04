import express from 'express';
import userController from '../controllers/user';
import config from '../config/config';
import auth from '../config/middlewares/auth';

const routes = () => {
  const userRoutes = express.Router(); // eslint-disable-line

  // endpoint for signup
  userRoutes.post('/users', userController.create);

  // endpoint for login
  userRoutes.post('/users/login', userController.login);

  // token authentication middleware
  userRoutes.use(auth.authenticate('jwt', config.jwtSession));

  // endpoint to retrieve all users
  userRoutes.get('/users', userController.findAll);

  // verify current user when browser reloads
  userRoutes.get('/users/current', userController.getCurrentUser);


  //endpoint to retrieve a user
  userRoutes.get('/users/:id', userController.findUser);

  // endpoint to delete user
  userRoutes.delete('/users/:id', userController.deleteUser);

  // update user records
  userRoutes.put('/users/:id', userController.update);

// update a user's role (Admin Privilege)
  userRoutes.put('/users/role/:id', userController.updateRole);

  // retrieve all docs belonging to a specific user
  userRoutes.get('/users/:id/documents', userController.findUserDoc);

  userRoutes.get('/search/users/', userController.search);

  return userRoutes;
};

export default routes;
