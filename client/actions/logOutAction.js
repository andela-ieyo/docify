import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { REMOVE_CURRENT_USER } from '../constants/user';


 /**
 *@desc remove current user from the redux store
 * @param {object} user
 */
export const removeCurrentUser = (user) =>
  ({ type: REMOVE_CURRENT_USER, user });

/**
 *
 * @desc calls the logout endpoint. clears token from local storage.
 * Redirects user to homepage.
 * @returns {string} returns a success message.
 */
export const logOut = () => {
  return (dispatch, getState, { client }) => {
    return client.get('/api/users/logout')
      .then(res => {
        const { message } = res.data;

        window.localStorage.removeItem('jwtToken_docify');
        const user = {
          id: '',
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          email: '',
          createdAt: '',
          updatedAt: '',
          roleId: ''
        };
        dispatch(removeCurrentUser(user));
        toastr.info(message);
        browserHistory.push('/');
      });
  };
};

