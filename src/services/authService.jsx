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


export const UpdateProflie = async (id, editData, token) => {
    // Debug log
    for (let pair of editData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    try {
        const response = await fetch(`${userAPI}/users/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Không cần Content-Type với FormData
            },
            body: editData  // Truyền trực tiếp FormData, không cần JSON.stringify
        });
        return response.json();
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};


export const verifyOTP = async (otp) => {
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


