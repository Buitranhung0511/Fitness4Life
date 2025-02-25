import axios from 'axios';

import { userAPI } from "../components/helpers/constants";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${userAPI}/users/login`, { email, password });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    if (error.response) {
      // Trường hợp API trả về lỗi (4xx, 5xx)
      throw new Error(error.response.data.message || 'An error occurred while logging in.');
    } else if (error.request) {
      // Không nhận được phản hồi từ API
      throw new Error('No response from server. Please try again later.');
    } else {
      // Lỗi không xác định
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getUserByEmail = async (email, token) => {
  const response = await fetch(`${userAPI}/users/get-by-email?email=${email}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }

  return response.json();
};

export const changePassword = async (data, token) => {
  const response = await fetch(`${userAPI}/users/change-pass`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Added this header
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to change password');
  }

  return response.json();
};