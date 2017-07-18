export const adminValidator = (req, res, next) => {
  const isAdmin = req.user.roleId === 3;
  if (!isAdmin) {
    return res.status(403).send({ message: 'Request Denied' });
  }

  return next();
};


export const paginate = (count, limit, offset) => {
  const totalPage = Math.ceil(count / limit);
  let currentPage = Math.floor((offset / limit) + 1);
  if (currentPage > totalPage) {
    currentPage = totalPage;
  }
  return { count, currentPage, totalPage, limit, offset };
};
