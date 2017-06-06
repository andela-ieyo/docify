import { SAVE_USER_SUCCESS, SAVE_USER_ERROR, SAVE_USER } from '../constants/user';
import { addFlashMessage } from '../actions/flashMessages';


export const saveUserSuccess = (user) => {
  return { type: SAVE_USER_SUCCESS, user };
};

export const saveUserError = (error) => {
  return { type: SAVE_USER_ERROR, error };
};

export const saveUser = () => {
  return { type: SAVE_USER };
};

export const userLoginRequest = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/users/login', fieldData)
      .then(res => {
        const { message, token, userInfo } = res.data;

        window.localStorage.setItem('jwtToken_docify', token);
        dispatch(saveUserSuccess(userInfo));
        dispatch(addFlashMessage({
          type: 'success',
          text: message
        }));
      }, error => {
        const errorMsgs = error.response.data.message;

        dispatch(saveUserError(errorMsgs));
        dispatch(addFlashMessage({
          type: 'error',
          text: errorMsgs
        }));
      });
  };
};
