const checkDocOwner = (req, res, next) => {
  const isLoggedInUser = req.user;
  if (!isLoggedInUser) {
    return res.status(403).send({ message: 'Request Denied' });
  }

  return next();
};

export default checkDocOwner;
