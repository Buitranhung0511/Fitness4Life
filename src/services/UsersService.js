import axios from "axios";

const URL_USER = "http://localhost:8080/api/users";

// Helper function to get token
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) throw new Error('No token found');
    const { access_token } = JSON.parse(tokenData);
    return access_token;
};

// Helper function to create auth config
const createAuthConfig = (contentType = 'application/json') => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': contentType
        }
    };
};

const fetchAllUsers = async () => {
    const URL_BACKEND = `${URL_USER}/manager/all`;
    return axios.get(URL_BACKEND, createAuthConfig());
}

const createUser = async (fullName, email, password, confirmPassword, role, gender) => {
    const URL_BACKEND = `${URL_USER}/register`;
    const data = {
        fullName,
        email,
        password,
        confirmPassword,
        role,
        gender
    };
    return axios.post(URL_BACKEND, data, createAuthConfig());
}

const updateUserAPI = async (
    id,
    fullName,
    role,
    gender,
    status,
    phone,
    hobbies,
    address,
    age,
    description,
    maritalStatus,
    file
) => {
    const URL_BACKEND = `${URL_USER}/update/${id}`;
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("status", status);
    formData.append("phone", phone);
    formData.append("hobbies", hobbies);
    formData.append("address", address);
    formData.append("age", age);
    formData.append("description", description);
    formData.append("maritalStatus", maritalStatus);

    if (file) {
        formData.append("file", file);
    }

    console.log("FormData being sent:");
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    return axios.put(URL_BACKEND, formData, {
        ...createAuthConfig('multipart/form-data'),
        timeout: 60000
    });
};

const GetOTP = async (email) => {
    const URL_BACKEND = `${URL_USER}/send-otp`;
    const data = { email };
    return axios.post(URL_BACKEND, data);
};

const ResetPass = async (email, otpCode) => {
    const URL_BACKEND = `${URL_USER}/reset-password`;
    try {
        const data = {
            email,
            otpCode
        };
        return axios.post(URL_BACKEND, data);
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    }
};

// Create axios instance with interceptors
const api = axios.create({
    baseURL: URL_USER
});

// Add request interceptor for automatic token handling
api.interceptors.request.use(
    (config) => {
        try {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export {
    fetchAllUsers,
    createUser,
    updateUserAPI,
    GetOTP,
    ResetPass
};