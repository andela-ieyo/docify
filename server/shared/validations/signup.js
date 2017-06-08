import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateInput = (data) => {
  const errors = {};

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'This field is required';
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'This field is required';
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'This field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password must be 6-8 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;
