export const Roles = {
  Writer : 1,
  Editor: 2,
  Admin: 3
};


export const chooseTitle = (id) => {
  let title;
  if (id === 3) {
    title = 'Admin';
    return title;
  }

  if (id === 2) {
    title = 'Editor';
    return title;
  }
  return 'Writer';
};
