import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from './server/config/config';
import db from './server/models/index';
import auth from './server/config/middlewares/auth';
import userRoutes from './server/routes/userRoutes';

// Set up the express app
const app = express();

// userRoute.get('/one', (req, res) => {
//  res.status(200).send({ y: 99999});
// });

// userRoute.use(auth.authenticate('jwt', config.jwtSession));

// userRoute.get('/all', user.getAll());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth.initialize());



app.use('/api', userRoutes());

// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the beginning of nothingness.',
// }));

module.exports = app;
