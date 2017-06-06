import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateLogin = (data) => {
  const errors = {};

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password must be 6-8 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateLogin;
