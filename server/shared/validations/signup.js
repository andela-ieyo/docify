import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateInput = (signUpInfo) => {
  const errors = {};

  if (!Validator.isEmail(signUpInfo.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(signUpInfo.username)) {
    errors.username = 'This field is required';
  }

  if (Validator.isEmpty(signUpInfo.firstName)) {
    errors.firstName = 'This field is required';
  }

  if (Validator.isEmpty(signUpInfo.lastName)) {
    errors.lastName = 'This field is required';
  }

  if (!Validator.isLength(signUpInfo.password, 6, undefined)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!Validator.isLength(signUpInfo.pwConfirmation, 6, undefined)) {
    errors.pwConfirmation = 'Password must be at least 6 characters';
  }

  if (!Validator.equals(signUpInfo.password, signUpInfo.pwConfirmation)) {
    errors.pwConfirmation = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateInput;
