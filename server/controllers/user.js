const Todo = require('../models').Todo;

module.exports = {
  create(req, res) {
    return Todo
      .create({
        title: req.body.title,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
};

import user from './models/user';


export default = {
  create(req, res) {
    return user.create({
      
    })
  }
}