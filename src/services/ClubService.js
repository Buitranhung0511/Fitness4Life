import axios from "axios";

const URL_CLUB = "http://localhost:9000/api/dashboard";

const createClubApi = (name, address, contactPhone, description, openHour, closeHour) => {
    const URL_BACKEND = `${URL_CLUB}/club/add`;
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
    const URL_BACKEND = `${URL_CLUB}/club/update/${id}`;
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


const fetchAllClubs = async (token) => {
    try {
        const response = await fetch('http://localhost:8081/api/dashboard/clubs', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch clubs');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw new Error(error.message || 'Failed to fetch clubs');
    }
  };

const deleteClubApi = (id) => {
    const URL_BACKEND = `${URL_CLUB}/club/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const addClubImageApi = async (formData) => {
    const response = await axios.post(`${URL_CLUB}/clubImage/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",  // Ensure content type is set to multipart/form-data
        },
    });
    return response.data;  // Returns the response data (assuming it contains the image upload response)

};

const fetchClubById = (id) => {
    const URL_BACKEND = `${URL_CLUB}/club/${id}`;
    return axios.get(URL_BACKEND);
}









export {
    fetchAllClubs,
    createClubApi,
    updateClubApi,
    deleteClubApi,
    addClubImageApi,
    fetchClubById
}


