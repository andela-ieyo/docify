/* global expect */

import validateInput from '../../../server/shared/validations/signup';

const signUpInfo = {
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  pwConfirmation: ''
};

const signUpInfo2 = {
  email: 'eyo@gmail.com',
  username: 'eyo',
  firstName: 'Ifiok',
  lastName: 'Eyo',
  password: 'testing',
  pwConfirmation: 'testing'
};

const signUpInfo3 = {
  email: 'eyo@gmail.com',
  username: 'eyo',
  firstName: 'Ifiok',
  lastName: 'Eyo',
  password: 'testing',
  pwConfirmation: 'test'
};


describe('signUp client validation', () => {
  it('throws an error for empty form fields', () => {
    expect(validateInput(signUpInfo).errors).toBeDefined();
    expect(validateInput(signUpInfo).errors.email).toBe('Email is invalid');
    expect(validateInput(signUpInfo).errors.password).toBe('Password must be at least 6 characters');
    expect(validateInput(signUpInfo).errors.firstName).toBe('This field is required');
    expect(validateInput(signUpInfo).errors.lastName).toBe('This field is required');
    expect(validateInput(signUpInfo).errors.username).toBe('This field is required');
    expect(validateInput(signUpInfo).errors.pwConfirmation).toBe('Password must be at least 6 characters');
    expect(validateInput(signUpInfo).isValid).toBe(false);
  });

  it('throws no error for form fields with the required inputs', () => {
    expect(validateInput(signUpInfo2).errors).toMatchObject({});
    expect(validateInput(signUpInfo2).isValid).toBe(true);
  });

  it('throws no error for non matching password fields', () => {
    expect(validateInput(signUpInfo3).errors.pwConfirmation).toBe('Passwords must match');
    expect(validateInput(signUpInfo3).isValid).toBe(false);
  });


});
