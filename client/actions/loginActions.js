import { SAVE_USER } from '../constants/user';

/**
 *
 * @desc save user success action creator.
 * @param {object} user
 * @returns {object} actiontype, and user Object
 */
export const saveUser = (user, category) =>
  ({ type: SAVE_USER, user, category });

/**
 *
 * @desc calls the login endpoint. Saves token to local Storage on sucess.
 * @param {object} fieldData. represents login info.
 * @returns {object} success or error message, token, and user Object.
 */
export const userLoginRequest = (fieldData) =>
  (dispatch, getState, { client }) => {
    return client.post('/api/users/login', fieldData)
    .then((result) => {
      const { user } = result.data;
      dispatch(saveUser(user, 'currentUser'));
      return Promise.resolve(result);
    });
  };

