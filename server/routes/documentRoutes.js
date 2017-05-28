import express from 'express';
import documentController from '../controllers/documents';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import auth from '../config/middlewares/auth';


const routes = () => {
  const docRoutes = express.Router();

  // token authentication middleware
  docRoutes.use(auth.authenticate('jwt', config.jwtSession));

  // create documents
  docRoutes.post('/documents', documentController.create);

  return docRoutes; 
}

export default routes;