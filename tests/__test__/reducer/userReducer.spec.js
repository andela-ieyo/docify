/* global expect */

import reducer from '../../../app/reducers/userReducer';
import * as types from '../../../app/constants/user';


const user1 = {
  id: 1,
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  roleId: 1
};
const user2 = {
  id: 2,
  firstName: 'John',
  lastName: 'Doe',
  username: 'jon',
  roleId: 1
};

const errorMsgs = 'Server error';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer({ isLoading: false }, {})).toEqual({ isLoading: false });
  });

  it('should handle SAVE_USER_SUCCESS', () => {
    expect(
      reducer({ isLoading: false }, {
        type: types.SAVE_USER_SUCCESS,
        user: user1
      })
    ).toEqual({ isLoading: false, ...user1 });
  });
  expect(
      reducer(
        {
          isLoading: false,
          ...user1
        },
        {
          type: types.SAVE_USER_SUCCESS,
          user: user2
        }
      )
    ).toEqual(
    {
      isLoading: false,
      ...user2
    },
    );

  it('should handle SAVE_USER_ERROR if there is an error', () => {
    expect(
      reducer({ isLoading: false }, {
        type: types.SAVE_USER_ERROR,
        error: errorMsgs
      })
    ).toEqual({ isLoading: false, error: errorMsgs });
  });
});

