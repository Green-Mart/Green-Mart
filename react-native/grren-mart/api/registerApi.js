// api/register.js
import axios from 'axios';
import { BASE_URL } from '../utils/Base_Url';


export const registerUser = async (userData) => {
  return await axios.post(`${BASE_URL}/users/signup`, userData);
};
