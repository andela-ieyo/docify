const adminValidator = (req, res, next) => {
  const isAdmin = req.user.roleId === 3;
  if (!isAdmin) {
    return res.status(403).send({ message: 'Request Denied' });
  }

  return next();
};

export default adminValidator;
