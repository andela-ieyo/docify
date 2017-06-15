import {
  userInfo,
  message,
  token
} from './fixtures';
export const successClient = {
  post() {
    return Promise.resolve({
      data: {
        message,
        token,
        userInfo
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