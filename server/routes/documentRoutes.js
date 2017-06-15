import express from 'express';
import documentController from '../controllers/documents';
import config from '../config/middlewares/config';
import auth from '../config/middlewares/auth';


const routes = () => {
  const docRoutes = express.Router();  // eslint-disable-line

  // token authentication middleware
  docRoutes.use(auth.authenticate('jwt', config.jwtSession));

   /**
 * @swagger
 * /api/documents:
 *   post:
 *     tags:
 *       - Document
 *     description: Creates a new document
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Document object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Documents'
 *     responses:
 *       200:
 *         description: Successfully created
 */
  docRoutes.post('/documents', documentController.create);

  // retrieve all documents
  // docRoutes.get('/documents', documentController.getAll);

  /**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     tags:
 *       - Documents
 *     description: Returns a single document
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Document's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single document
 *         schema:
 *           $ref: '#/definitions/Documents'
 */

  docRoutes.get('/documents/:id', documentController.getOne);

 /**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     tags:
 *       - Documents
 *     description: Updates a single document
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Document's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  docRoutes.put('/documents/:id', documentController.update);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     tags:
 *       - Documents
 *     description: Deletes a single document
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Document's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
  docRoutes.delete('/documents/:id', documentController.deleteOne);

  docRoutes.get('/search/documents/', documentController.search);

/**
 * @swagger
 * definition:
 *   Documents:
 *     properties:
 *       title:
 *         type: string
 *       access:
 *         type: string
 *       content:
 *         type: text
 *       ownerId:
 *         type: integer
 */

 /**
 * @swagger
 * /api/documents:
 *   get:
 *     tags:
 *       - Documents
 *     description: Returns all documents
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of documents
 *         schema:
 *           $ref: '#/definitions/Documents'
 */

  docRoutes.get('/documents/?', documentController.getPaginatedDocs);

  return docRoutes;
};

export default routes;
