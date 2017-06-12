import toastr from 'toastr';
import { SAVE_USER_SUCCESS, SAVE_USER_ERROR } from '../constants/user';

export const saveUserSuccess = (user) => ({ type: SAVE_USER_SUCCESS, user });

export const saveUserError = (error) =>
  ({ type: SAVE_USER_ERROR, error });


export const getUser = (userId) => {
  return (dispatch, getState, { client }) => {
    return client.get(`/api/users/${userId}`)
      .then(res => {
        console.log(res);
        const { user } = res.data;

        dispatch(saveUserSuccess({ user }));
      }, error => {
        const errorMsgs = error.response.data.message;

        dispatch(saveUserError(errorMsgs));
        toastr.error(errorMsgs);
      });
  };
};
