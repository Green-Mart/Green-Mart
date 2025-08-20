import axios from 'axios';
import { BASE_URL } from '../utils/Base_Url';

const URL = `${BASE_URL}/product`; // Update this to your backend URL

export const getAllProducts = async () => {
  const response = await axios.get(`${URL}/customer/allProducts`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axios.get(`${URL}/customer/all/categories`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await axios.get(`${URL}/customer/bycategory/${category}`);
  return response.data;
};

export const getProductsByExactPrice = (price) => {
  return axios.get(`${URL}/customer/byprice/price/${price}`);
};

export const getProductsByPriceRange = (min, max, category) => {
  return axios.get(`${URL}/customer/between/${min}/${max}/${category}`);
};

export const getProductById = async(productId) =>{
  // debugger
  const response = await axios.get(`${URL}/customer/get/by/pid/${productId}`);
  return response.data.data;
}
