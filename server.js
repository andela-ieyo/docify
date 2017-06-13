import express from 'express';
// import logger from 'morgan';
import path from 'path';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import auth from './server/config/middlewares/auth';
import userRoutes from './server/routes/userRoutes';
import docRoutes from './server/routes/documentRoutes';
import models from './server/models';

const Users = models.Users;
const Roles = models.Roles;
const salt = bcrypt.genSaltSync();

// Set up the express app
const app = express();

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

    Users.findAll().then(users => {
      if (!users.length) {
        Users.bulkCreate(
          {
            firstName: 'Ifiok',
            lastName: 'Eyo',
            username: 'Admin',
            email: 'ifiokabasi.eyo@andela.com',
            password: bcrypt.hashSync('sagehasson', salt),
            roleId: 3
          }
        );
      }
    });
  });
  console.log(`Listening on port ${port}`);
});

export default server;
