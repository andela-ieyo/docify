import axios from 'axios';

const data = [{
    title: 'The Lord of the Rings',
    access: 'public',
    content: 'Adventure'
  },
  {
    title: 'The Clutch',
    access: 'public',
    content: 'Adventure'
  }
];


const mockApiCall = {
  get: (url, params) => {
    console.log(arguments);
    return Promise.resolve({
      data: {
        rows: data,
        count: data.length
      }
    });
  },
  default: axios.default
};

export default mockApiCall;
