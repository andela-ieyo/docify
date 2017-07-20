export const user = {
  id: 1,
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  roleId: 1
};

export const storeUser = {
  currentUser: {
    id: 1,
    firstName: 'Ifiok',
    lastName: 'Eyo',
    username: 'sage',
    email: 'eyo@gmail.com',
    roleId: 1
  }
};


export const message = 'login successful';
export const token = 'WRGVVH567878';

export const users = {
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
        id: 2,
        title: 'Editor'
      }
    }
  ]
};

export const publicDocuments = {
  count: 2,
  rows:[
    {
      id: 1,
      title: 'The Lord of the Rings',
      access: 'public',
      content: 'Adventure',
      User: {
        id: 2,
        firstName: 'Jed',
        lastName: 'Lee'
      }
    },
    {
      id: 2,
      title: 'The Clutch',
      access: 'public',
      content: 'Adventure',
      User: {
        id: 2,
        firstName: 'Jed',
        lastName: 'Lee'
      }
    }
  ]
};

export const privateDocuments = {
  count: 2,
  rows:[
    {
      id: 1,
      title: 'The Lord of the Rings',
      access: 'private',
      content: 'Adventure',
      User: {
        id: 2,
        firstName: 'Jed',
        lastName: 'Lee'
      }
    },
    {
      id: 2,
      title: 'The Clutch',
      access: 'private',
      content: 'Adventure',
      User: {
        id: 2,
        firstName: 'Jed',
        lastName: 'Lee'
      }
    }
  ]
};


export const document = {
  id: 1,
  title: 'The Lord of the Rings',
  access: 'public',
  content: 'Adventure',
  createdAt: '2017/02/04',
  User: {
    id: 2,
    firstName: 'Mercy',
    lastName: 'Lenk'
  }
};

export const documents = {
  publicDocuments: {
    count: 2,
    rows:[
      {
        id: 1,
        title: 'The Lord of the Rings',
        access: 'public',
        content: 'Adventure',
        createdAt: '2017/02/04',
        User: {
          id: 2,
          firstName: 'Jed',
          lastName: 'Lee'
        }
      },
      {
        id: 2,
        title: 'The Clutch',
        access: 'public',
        content: 'Adventure',
        createdAt: '2017/05/07',
        User: {
          id: 2,
          firstName: 'Jed',
          lastName: 'Lee'
        }
      }
    ]
  },
  privateDocuments: {
    count: 2,
    rows:[
      {
        id: 1,
        title: 'The Lord of the Rings',
        access: 'private',
        content: 'Adventure',
        createdAt: '2017/02/04',
        User: {
          id: 2,
          firstName: 'Jed',
          lastName: 'Lee'
        }
      },
      {
        id: 2,
        title: 'The Clutch',
        access: 'private',
        content: 'Adventure',
        createdAt: '2017/05/07',
        User: {
          id: 2,
          firstName: 'Jed',
          lastName: 'Lee'
        }
      }
    ]
  }
};

export const admin = {
  id: 4,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'Admin',
  email: 'ifiokabasi.eyo@andela.com',
  Role: {
    id: 3,
    title: 'Admin'
  }
};
