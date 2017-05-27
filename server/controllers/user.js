import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Users = models.User;
const Roles = models.Role;

const UserController = {
   create(req, res) {
    const userData = req.body;
    Users.findOne({
      where: {
        $or: [
          {email: req.body.email},
          {username: req.body.username},
        ]
      }
    })
    .then((dbUser) => {
      if (dbUser) { // dbUser.username || dbUser.email
        return res.status(409).send({ message: 'An account with that email address exists' });
      }
      Roles.findOne({
        where:{
          title: 'WRITER'
        }
      }).then((role) =>
        Users.create(Object.assign({}, userData, { roleId: role.id }))
          .then((newUser) => {
            const payload = {
              firstName: newUser.firstname,
              lastName: newUser.lastName,
              username: newUser.username,
              email: newUser.email,
            };
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
            return res.status(201).send({
              newUser,
              message: 'User signup completed successfully',
              token
            });
          })
      )
    })
    .catch(error => res.status(500).send(error));
  },

  login(req, res){
    console.log(JSON.stringify({ body: req.body }, null, 4));
    if (req.body.email && req.body.password ){
      const { email } = req.body;
      const query = { where: { email } };

      Users.findOne(query)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: 'Your account does not exist'});
          }
          if (Users.isPassword(user.password, req.body.password)) {
            const payload =  {
              id: user.id,
              email: user.email,
            };
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
            return res.status(201).send({
              message: 'User login completed successfully',
              token
            });
          } else {
            res.status(401).send({message: 'Please, enter the correct password or email'})
          };
        })
        .catch(error => {
          console.log(error) 
          res.status(500).send(error);
        });
      } else return res.status(406).send('Enter a valid email address and password');
  }
}

export default UserController;
