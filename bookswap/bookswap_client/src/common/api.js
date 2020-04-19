import axios from 'axios';

if (localStorage.getItem('token')) {
  const token = localStorage.getItem('token');
  setJwt(token);
}

axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  if (!expectedError) {
    console.log('Logging out error', error);
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common.authorization = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  setJwt,
};
