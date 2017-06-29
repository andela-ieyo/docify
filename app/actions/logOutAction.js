import toastr from 'toastr';
import { browserHistory } from 'react-router';

/**
 *
 * @desc calls the logout endpoint. clears token from local storage.
 * Redirects user to homepage.
 * @returns {string} returns a success message.
 */
const logOut = () => {
  return (dispatch, getState, { client }) => {
    return client.get('/api/users/logout')
      .then(res => {
        const { message } = res.data;

        window.localStorage.removeItem('jwtToken_docify');
        toastr.info(message);
        browserHistory.push('/');
      });
  };
};

export default logOut;
