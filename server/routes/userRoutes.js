import express from 'express';
import userController from '../controllers/user';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import auth from '../config/middlewares/auth';

const routes = () => {
  const userRoutes = express.Router();

  // endpoint for signup
  userRoutes.post('/users', userController.create);

  // endpoint for login
  userRoutes.post('/users/login', userController.login);
  
  // token authentication middleware
  userRoutes.use(auth.authenticate('jwt', config.jwtSession));

  // endpoint to retrieve all users
  userRoutes.get('/users', userController.findAll);

  //endpoint to retrieve a user
  userRoutes.get('/users/:id', userController.findUser);

  // endpoint to delete user
  userRoutes.delete('/users/:id', userController.deleteUser);

  // update user records
  userRoutes.put('/users/:id', userController.update);

// update a user's role (Admin Privilege)
  userRoutes.put('/users/role/:id', userController.updateRole);
  
  return userRoutes;
}

export default routes;
