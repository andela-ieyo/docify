import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateLogin = (loginInfo) => {
  const errors = {};

  if (!Validator.isEmail(loginInfo.email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(loginInfo.password, 6, undefined)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateLogin;
