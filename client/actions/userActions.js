import _ from 'lodash';
import {
  SAVE_USER,
  LOAD_ALL_USERS,
  UPDATE_ROLE_SUCCESS,
  UPDATE_USER_SUCCESS } from '../constants/user';

/**
 * @desc loads current user
 *
 * @param {any} user
 * @returns {object} actiontype, and payload
 */
export const saveUser = (category, user) =>
  ({ type: SAVE_USER, user, category });


/**
 * @desc save updated user profile action creator.
 *
 * @param {object} user
 * @returns {object} actiontype, and payload
 */
export const updateUserSuccess = (user) =>
  ({ type: UPDATE_USER_SUCCESS, user });

/**
 * @desc load all users success action creator.
 *
 * @param {object} users
 * @param {string} category
 * @returns {object} actiontype, and payload
 */
export const loadAllUsers = (users, category) =>
  ({ type: LOAD_ALL_USERS, users, category });

/**
 * @desc update user role success action creator.
 *
 * @param {object} id - userId
 * @param {object} newRole - newId
 * @param {string} category - section of state
 * @returns {object} actiontype, and payload
 */
export const updateRoleSuccess = (id, newRole, category) =>
  ({ type: UPDATE_ROLE_SUCCESS, id, newRole, category });


/**
 * @desc get all users action
 *
 * @param {any} page
 * @returns {array} an array of all users (paginated)
 */
export const getAllUsers = (page) =>
(dispatch, getState, { client }) =>
  client.get(`/api/users/?page=${page}&limit=6`)
    .then(res => {
      const users = res.data;
      dispatch(loadAllUsers(users, 'allUsers'));
      return res;
    });

/**
 * @desc update user role action
 *
 * @param {number} id - user roleId
 * @param {number} newRole - user new roleId
 * @returns {object} returns a success message or error
 */
export const updateUserRole = (id, newRole) =>
(dispatch, getState, { client }) =>
  client.put(`/api/users/role/${id}`, { roleId: newRole.id })
    .then(res => {
      if (res.status === 200) {
        dispatch(updateRoleSuccess(id, newRole, 'allUsers'));
      }
      return res;
    });

/**
 * @desc delete user action
 *
 * @param {number} id - user roleId
 * @param {number} page - pagination
 * @returns {object} returns a success message or error
 */
export const deleteUser = (id, page) =>
(dispatch, getState, { client }) =>
  client.delete(`/api/users/${id}`)
    .then(res => {
      dispatch(getAllUsers(page));
      return res;
    });

export const updateUserProfile = (id, user) =>
(dispatch, getState, { client }) =>
  client.put(`/api/users/${id}`, user)
    .then(res => {
      if (res.status === 200) {
        const trimmedUser = _.omit(user, ['password']);
        dispatch(updateUserSuccess(trimmedUser));
      }
      return res;
    });
