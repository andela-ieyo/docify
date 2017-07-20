import {
  user
} from './fixtures';

export const successClient = {
  post() {
    return Promise.resolve({
      data: {
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

export const getClient = {
  get() {
    return Promise.resolve({
      data: {
        user
      }
    });
  }
};

