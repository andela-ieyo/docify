import { SAVE_USER } from '../constants/user';


export const saveUser = (user, category) =>
  ({ type: SAVE_USER, user, category });

/**
 * @desc handles signup request. Stores token to local Storage.
 *  Redirects user to dashboard on success.
 *
 * @param {object} input from form fields.
 * @returns {object} returns success message, user, and token.
 */
export const userSignUpRequest = (fieldData) =>
  (dispatch, getState, { client }) => {
    return client.post('/api/users', fieldData)
      .then(res => {
        const { user } = res.data;
        dispatch(saveUser(user, 'currentUser'));
        return res;
      });
  };
