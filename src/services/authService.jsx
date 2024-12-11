import axios from "axios"
import { userAPI } from "../components/helpers/constants";

export const registerUser = async (newData) => {
    try {
        const response = await axios.post(`${userAPI}/users/register`, newData)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${userAPI}/users/login`, data);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

export const verifyAccountRegister = async (email, otp) => {
    try {
        const response = await axios.get(`${userAPI}/users/verify-account/${email}/${otp}`)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

export const changePassword = async (data) => {
    return await axios.post(`${userAPI}/users/change-pass`, data)
};
