import express from 'express';
import documentController from '../controllers/documents';
import config from '../config/middlewares/config';
import auth from '../config/middlewares/auth';


const routes = () => {
  const docRoutes = express.Router();  // eslint-disable-line

  // token authentication middleware
  docRoutes.use(auth.authenticate('jwt', config.jwtSession));

  // create documents
  docRoutes.post('/documents', documentController.create);

  // retrieve all documents
  // docRoutes.get('/documents', documentController.getAll);

  // retrieve a document
  docRoutes.get('/documents/:id', documentController.getOne);

  // update a doc
  docRoutes.put('/documents/:id', documentController.update);

  // delete a document
  docRoutes.delete('/documents/:id', documentController.deleteOne);

  docRoutes.get('/search/documents/', documentController.search);

  // paginated docs
  docRoutes.get('/documents/?', documentController.getPaginatedDocs);

  return docRoutes;
};

export default routes;
