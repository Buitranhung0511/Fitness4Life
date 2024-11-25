import axios from "axios";





const createClubApi = (name, address, contactPhone, description, openHour, closeHour) => {
    const URL_BACKEND = "http://localhost:9999/api/manager/club/add";
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
    const URL_BACKEND = `http://localhost:9999/api/manager/club/update/${id}`;
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
    const URL_BACKEND = "http://localhost:9999/api/public/clubs";
    return axios.get(URL_BACKEND);
}

const deleteClubApi = (id) => {
    const URL_BACKEND = `http://localhost:9999/api/manager/club/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const addClubImageApi = async (formData) => {
    const response = await axios.post("http://localhost:9999/api/manager/clubImage/add", formData, {
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


