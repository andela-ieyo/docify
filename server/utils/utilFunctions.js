export const paginate = (count, limit, offset) => {
  const totalPage = Math.ceil(count / limit);
  let currentPage = Math.floor((offset / limit) + 1);
  if (currentPage > totalPage) {
    currentPage = totalPage;
  }
  return { count, currentPage, totalPage, limit, offset };
};


/**
 * @desc  checks if the document owner id is equal to the request user id
 *
 * @param {object} ownerId - document owner id
 * @param {object} userId - user id present in the request header
 * @returns
 */
export const checkDocOwner = (ownerId, userId) => {
  if (parseInt(ownerId, 10) === parseInt(userId, 10)) {
    return true;
  }
  return false;
};

/**
 * @desc writer role validation
 *
 * @param {object} roleId
 * @returns
 */
export const checkIfWriter = (roleId) => {
  if (roleId === 1) {
    return true;
  }
  return false;
};

/**
 *
 * @desc checks if a user is a registered user.
 * @param {number} userId
 * @param {number} queryId id passeds as params.
 * @returns {boolean} returns true or false
 */
export const isLoggedInUser = (userId, queryId) => {
  if (parseInt(userId, 10) === parseInt(queryId, 10)) {
    return true;
  }
  return false;
};

