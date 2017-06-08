import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../constants/flashMessage';

export const addFlashMessage = (message) => ({
  type: ADD_FLASH_MESSAGE,
  message
});

export const deleteFlashMessage = (id) => ({
  type: DELETE_FLASH_MESSAGE,
  id
});
