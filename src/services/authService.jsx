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


export const getOneUserById = async (id) => {
    try {
        const response = await axios.get(`${userAPI}/users/manager/oneUser/${id}`)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};


export const UpdateProflie = async (id, editData) => {
    try {
        const response = await axios.put(`${userAPI}/users/update/${id}`, editData)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

export const verifyOTP   = async ( otp) => {
    try {
        const response = await axios.get(`${userAPI}/users/verify-account/${otp}`)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};