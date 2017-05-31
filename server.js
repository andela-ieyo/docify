import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import db from './server/models/index';
import auth from './server/config/middlewares/auth';
import userRoutes from './server/routes/userRoutes';
import docRoutes from './server/routes/documentRoutes';

// import models from './server/models';

// let Users = models.Users;
// let Roles = models.Roles;

// Set up the express app
const app = express();

const port = process.env.PORT || 8000; // eslint-disable-line

// Log requests to the console.
app.use(logger('combined'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(auth.initialize());

// routes middleware
app.use('/api', userRoutes());
app.use('/api', docRoutes());


// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the beginning of nothingness.',
// }));

const server = app.listen(port, () => {
  db.sequelize.sync();
  console.log(`Listening on port ${port}`);
});

export default server;
