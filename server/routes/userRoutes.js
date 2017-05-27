import express from 'express';
import userController from '../controllers/user';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import auth from '../config/middlewares/auth';

const routes = () => {
  const userRoutes = express.Router();
  userRoutes.post('/users', userController.create);
  userRoutes.post('/users/login', userController.login);
  userRoutes.use(auth.authenticate('jwt', config.jwtSession));
  userRoutes.get('/users/test', (req, res) => {
    res.status(200).send({ msg: 'welcome to docify' });
  });
  return userRoutes;
}

export default routes;

// app.get('/token', (req, res) => {
//   res.status(200).send(jwt.sign({ a: 1}, config.jwtSecret));
// });
