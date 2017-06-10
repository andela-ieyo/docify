import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { SAVE_USER_SUCCESS, SAVE_USER_ERROR } from '../constants/user';


export const saveUserSuccess = (user) =>
  ({ type: SAVE_USER_SUCCESS, user });


export const saveUserError = (error) =>
  ({ type: SAVE_USER_ERROR, error });

export const userLoginRequest = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/users/login', fieldData)
      .then(res => {
        const { message, token, userInfo } = res.data;

        window.localStorage.setItem('jwtToken_docify', token);
        dispatch(saveUserSuccess(userInfo));
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
