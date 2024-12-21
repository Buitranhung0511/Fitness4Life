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
