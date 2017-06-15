import express from 'express';
// import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import auth from './server/config/middlewares/auth';
import userRoutes from './server/routes/userRoutes';
import docRoutes from './server/routes/documentRoutes';
import models from './server/models';

// const Users = models.Users;
const Roles = models.Roles;

// Set up the express app
const app = express();

const swaggerJSDoc = require('swagger-jsdoc');

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Describing Docify RESTful API with Swagger'
  },
  host: 'localhost:8000',
  basePath: '/'
};
const swaggerPath = path.join(__dirname, 'server/routes/*.js');

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [swaggerPath]
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const port = process.env.PORT || 8000; // eslint-disable-line

// Log requests to the console.
// app.use(logger('combined'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));
app.use(auth.initialize());

// routes middleware
app.use('/api', userRoutes());
app.use('/api', docRoutes());


// Setup a default catch-all route that sends back a welcome message.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

const server = app.listen(port, () => {
  models.sequelize.sync().then(() => {
    Roles.findAll().then(roles => {
      if (!roles.length) {
        Roles.bulkCreate(
          [
            { title: 'Writer' },
            { title: 'Editor' },
            { title: 'Admin' }
          ]
        );
      }
    });
  });
  console.log(`Listening on port ${port}`);
});

export default server;
