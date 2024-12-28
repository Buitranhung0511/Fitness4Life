import axios from "axios"
import { smartAPI } from "../components/helpers/constants";

export const GetAllQuestion = async () => {
    try {
        const response = await axios.get(`${smartAPI}/forums/questions`)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

export const getQuestionById = async (id) => {
    try {
        const response = await axios.get(`${smartAPI}/forums/questions/${id}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};
export const CreateQuestion = async (newQuestion) => {
    try {
        const response = await axios.post(`${smartAPI}/forums/questions/create`, newQuestion)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};


export const voteQuestion = async (id, voteType, userId) => {
    try {
        const response = await axios.post(`${smartAPI}/forums/${id}/vote?userId=${userId}&voteType=${voteType}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const incrementViewCount = async (id, userId) => {
    try {
        const response = await axios.get(`${smartAPI}/forums/${id}/view?userId=${userId}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};


export const updateQuestion = async (id, updateData) => {
    try {
        const response = await axios.put(`${smartAPI}/forums/questions/update/${id}`, updateData);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

//============================comment=======================

export const createComment = async (data) => {
    try {
        const response = await axios.post(`${smartAPI}/forums/comments/create`, data);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const GetCommentByQuestionId = async (idQuestion) => {
    try {
        const response = await axios.get(`${smartAPI}/forums/question/${idQuestion}/comment`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};
