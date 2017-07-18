import express from 'express';
import DocumentController from '../controllers/DocumentController';
import config from '../config/jwtConfig/config';
import auth from '../middleware/auth';


const routes = () => {
  const docRoutes = express.Router();  // eslint-disable-line

  // token authentication middleware
  docRoutes.use(auth.authenticate('jwt', config.jwtSession));

   /**
 * @swagger
 * /api/documents:
 *   post:
 *     tags:
 *       - Documents
 *     description: Creates a new document
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
 *       - name: title
 *         description: Document title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: access
 *         description: Document access type
 *         in: formData
 *         required: true
 *         type: string
 *       - name: content
 *         description: Document content
 *         in: formData
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Documents'
 *     responses:
 *       200:
 *         description: Successfully created
 */
  docRoutes.post('/', DocumentController.create);

  docRoutes.get('/private', DocumentController.getPrivateDocs);

  docRoutes.get('/public', DocumentController.getPublicDocs);

  docRoutes.get('/role', DocumentController.getRoleDocs);

  // retrieve all documents
  // docRoutes.get('/documents', DocumentController.getAll);

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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
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

  docRoutes.get('/:id', DocumentController.getOne);

 /**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     tags:
 *       - Documents
 *     description: Updates a single document
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
 *         description: Document's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: title
 *         description: Document title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: access
 *         description: Document access type
 *         in: formDataD
 *         required: true
 *         type: string
 *       - name: content
 *         description: Document content
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           $ref: '#/definitions/Users'
 */
  docRoutes.put('/:id', DocumentController.update);

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
 *       - name: authorization
 *         description: request x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: Document's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
  docRoutes.delete('/:id', DocumentController.deleteOne);

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
 *         description: An array of documents
 *         schema:
 *           $ref: '#/definitions/Documents'
 */

  docRoutes.get('/?', DocumentController.getPaginatedDocs);

  return docRoutes;
};

export default routes;
