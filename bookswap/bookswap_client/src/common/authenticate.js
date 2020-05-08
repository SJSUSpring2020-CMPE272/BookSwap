import jwtDecode from 'jwt-decode';
import api from './api';
import { backendURI } from './config';


export async function login(email_id, password) {
  const credentials = {
    email_id,
    password,
  };
  try {
    const { data: token } = await api.post(`${backendURI}/login`, credentials);
    api.setJwt(token);
    localStorage.setItem('token', token);

    try {
      const authToken = localStorage.getItem('token');
      const jwt = authToken.split(' ')[1];
      const user = jwtDecode(jwt);
      if (!user) {
        return false;
      }

      localStorage.setItem('EmailId', user.EmailId);
      localStorage.setItem('StudentId', user.StudentId);
      localStorage.setItem('Name', user.Name);
      // localStorage.setItem("last_name", user.last_name);
      // localStorage.setItem("user_name", user.user_name);
      // if (user.user_image)
      //     localStorage.setItem("user_image", user.user_image);
      return true;
    } catch (ex) {
      return null;
    }
  } catch (err) {
    if (err.response) console.log(err.response.data);
  }
}

export function logout() {
  localStorage.clear();
}

export function getJwt() {
  return localStorage.getItem('token');
}

export default {
  login, logout,
};
