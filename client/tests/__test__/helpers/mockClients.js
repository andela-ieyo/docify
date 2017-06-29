import {
  user,
  message,
  token
} from './fixtures';

export const successClient = {
  post() {
    return Promise.resolve({
      data: {
        message,
        token,
        user
      }
    });
  }
};

export const failedClient = {
  post() {
    return Promise.reject({
      response: {
        data: {
          message: 'error'
        }
      }
    });
  }
};
