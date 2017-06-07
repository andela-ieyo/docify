import toastr from 'toastr';
import { browserHistory } from 'react-router';

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
