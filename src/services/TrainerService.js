import axios from "axios";

const URL_TRAINER= "http://localhost:9998/api/dashboard";
const fetchAllTrainer = () => {
    const URL_BACKEND = `${URL_TRAINER}/trainers`;
    return axios.get(URL_BACKEND);
}
const deleteTrainer = (id) => {
    const URL_BACKEND = `${URL_TRAINER}/trainer/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const createTrainer = (fullName, slug, file, specialization, experienceYear, certificate, phoneNumber, scheduleTrainers, branch) => {
    const URL_BACKEND = `${URL_TRAINER}/trainer/add`;
    
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('slug', slug);
    if (file) {
        formData.append("file", file);
    }
    formData.append('specialization', specialization);
    formData.append('experienceYear', experienceYear);
    formData.append('certificate', certificate);
    formData.append('phoneNumber', phoneNumber);
    formData.append('branch', branch);
    
    // Schedule trainers would likely need to be sent as a JSON string

    formData.append('scheduleTrainers', scheduleTrainers.join(','));
    
    console.log("FormData before sending:", {
        fullName,
        slug,
        specialization,
        experienceYear,
        certificate,
        phoneNumber,
        branch,
        scheduleTrainers: JSON.stringify(scheduleTrainers),
        file: file ? file.name : 'No file selected', // Log tên file hoặc trạng thái nếu không có file
    });

    return axios.post(URL_BACKEND, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}


export {
    fetchAllTrainer,
    deleteTrainer,
    createTrainer
}