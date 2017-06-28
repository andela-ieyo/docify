import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { SAVE_USER_SUCCESS, SAVE_USER_ERROR } from '../constants/user';

/**
 *
 * @desc save user success action creator.
 * @param {object} user
 * @returns {object} actiontype, and user Object
 */
export const saveUserSuccess = (user) =>
  ({ type: SAVE_USER_SUCCESS, user });


export const saveUserError = (error) =>
  ({ type: SAVE_USER_ERROR, error });
/**
 *
 * @desc calls the login endpoint. Saves token to local Storage on sucess.
 * @param {object} fieldData. represents login info.
 * @returns {object} success or error message, token, and user Object.
 */
export const userLoginRequest = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/users/login', fieldData)
      .then(res => {
        const { message, token, user } = res.data;

        window.localStorage.setItem('jwtToken_docify', token);
        dispatch(saveUserSuccess(user));
        toastr.success(message);
        browserHistory.push('/dashboard');
      }, error => {
        const errorMsgs = error.response.data.message;

        dispatch(saveUserError(errorMsgs));
        toastr.error(errorMsgs);
        browserHistory.push('/');
      });
  };
};
