import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { SAVE_USER_SUCCESS, SAVE_USER_ERROR, SAVE_USER } from '../constants/user';


export const saveUserSuccess = (user) => ({ type: SAVE_USER_SUCCESS, user });

export const saveUserError = (error) =>
  ({ type: SAVE_USER_ERROR, error });


export const saveUser = () =>
   ({ type: SAVE_USER });

/**
 *
 * @desc handles signup request. Stores token to local Storage.
 *  Redirects user to dashboard on success.
 * @param {object} input from form fields.
 * @returns {object} returns success message, user, and token.
 */
export const userSignUpRequest = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/users', fieldData)
      .then(res => {
        const { message, user, token } = res.data;
        window.localStorage.setItem('jwtToken_docify', token);
        dispatch(saveUserSuccess(user));
        toastr.success(message);
        browserHistory.push('/dashboard');
      }, error => {
        const errorMsgs = error.response.data.message;

        dispatch(saveUserError(errorMsgs));
        toastr.error(errorMsgs);
      });
  };
};
