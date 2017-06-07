import toastr from 'toastr';
import { SAVE_USER_SUCCESS, SAVE_USER_ERROR, SAVE_USER } from '../constants/user';

export const saveUserSuccess = (user) => ({ type: SAVE_USER_SUCCESS, user });

export const saveUserError = (error) =>
  ({ type: SAVE_USER_ERROR, error });


export const saveUser = () =>
   ({ type: SAVE_USER });

export const userSignUpRequest = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/users', fieldData)
      .then(res => {
        const { message, newUser, token } = res.data;

        window.localStorage.setItem('jwtToken_docify', token);
        dispatch(saveUserSuccess({ newUser }));
        toastr.success(message);
      }, error => {
        const errorMsgs = error.response.data.message;

        dispatch(saveUserError(errorMsgs));
        toastr.error(errorMsgs);
      });
  };
};
