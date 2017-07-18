/* global expect */

import reducer from '../../../client/reducers/userReducer';
import * as types from '../../../client/constants/user';
import { user, users } from '../__mocks__/helpers/fixtures';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer({}, {})).toEqual({});
  });

  it('should handle SAVE_USER action and save user to store', () => {
    const category = 'currentUser';
    expect(
      reducer({}, {
        type: types.SAVE_USER,
        user,
        category
      })
    ).toEqual({ [category]: user });
  });

  it('should handle LOAD_ALL_USERS action and save the payload to the store', () => {
    const category = 'allUsers';
    expect(
      reducer({},
        {
          type: types.LOAD_ALL_USERS,
          users,
          category
        }
      )
    ).toEqual(
      {
        [category]: users
      });
  });


  it('should handle UPDATE_ROLE_SUCCESS action and update user role', () => {
    const category = 'allUsers';
    expect(
      reducer({ [category]: users },
        {
          type: types.UPDATE_ROLE_SUCCESS,
          id: 2,
          newRole: {
            id: 1,
            title: 'Writer'
          },
          category
        }
      )
    ).toEqual(
      {
        [category]: {
          count: 2,
          rows: [
            {
              id: 1,
              firstName: 'Moe',
              lastName: 'Abraham',
              username: 'moe',
              email: 'moe.abraham@andela.com',
              Role: {
                id: 1,
                title: 'Writer'
              }
            },
            {
              id: 2,
              firstName: 'John',
              lastName: 'Doe',
              username: 'jon',
              email: 'john.doe@andela.com',
              Role: {
                id: 1,
                title: 'Writer'
              }
            }
          ]
        }
      }
    );
  });

  it('should handle UPDATE_USER_SUCCESS action and update user record', () => {
    const category = 'currentUser';
    expect(
      reducer({ [category]: user },
        {
          type: types.UPDATE_USER_SUCCESS,
          user: {
            id: 1,
            firstName: 'Moe',
            lastName: 'Abraham',
            username: 'moezy',
            roleId: 1
          }
        }
        )
      ).toEqual(
      {
        [category]: {
          id: 1,
          firstName: 'Moe',
          lastName: 'Abraham',
          username: 'moezy',
          roleId: 1
        }
      },
      );
  });

});
