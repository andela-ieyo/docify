const adminValidator = (req, res, next) => {
  const isAdmin = req.user.roleId === 3;
  if (!isAdmin) {
    return res.status(200).send({ meg: 'hello' });
    // return res.redirect('/');
  }

  return next();
};

export default adminValidator;
