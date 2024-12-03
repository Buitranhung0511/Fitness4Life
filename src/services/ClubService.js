import axios from "axios";

    const URL_CLUB = "http://localhost:9997/api";

const createClubApi = (name, address, contactPhone, description, openHour, closeHour) => {
    const URL_BACKEND = `${URL_CLUB}/manager/club/add`;
    const data = {
        name: name,
        address: address,
        contactPhone: contactPhone,
        description: description,
        openHour: openHour,
        closeHour: closeHour
    }
    return axios.post(URL_BACKEND, data);
}

const updateClubApi = (id, name, address, contactPhone, description, openHour, closeHour) => {
    const URL_BACKEND = `${URL_CLUB}/manager/club/update/${id}`;
    const data = {
        name: name,
        address: address,
        contactPhone: contactPhone,
        description: description,
        openHour: openHour,
        closeHour: closeHour
    }
    return axios.put(URL_BACKEND, data);
}

const fetchAllClubs = () => {
    const URL_BACKEND = `${URL_CLUB}/public/clubs`;
    return axios.get(URL_BACKEND);
}

const deleteClubApi = (id) => {
    const URL_BACKEND = `${URL_CLUB}/manager/club/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const addClubImageApi = async (formData) => {
    const response = await axios.post(`${URL_CLUB}/manager/clubImage/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",  // Ensure content type is set to multipart/form-data
        },
    });
    return response.data;  // Returns the response data (assuming it contains the image upload response)

};








export {
    fetchAllClubs,
    createClubApi,
    updateClubApi,
    deleteClubApi,
    addClubImageApi
}


