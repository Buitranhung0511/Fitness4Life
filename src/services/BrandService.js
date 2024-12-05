import axios from "axios";

const URL_BRAND= "http://localhost:9998/api/dashboard";
const fetchAllBranch = () => {
    const URL_BACKEND = `${URL_BRAND}/branchs`;
    return axios.get(URL_BACKEND);
}

const deleteBranch = (id) => {
    const URL_BACKEND = `${URL_BRAND}/branch/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const createBrand = (branchName, slug, address, phoneNumber, email, openHours, closeHours, services) => {
    const URL_BACKEND = `${URL_BRAND}/branch/add`;
    const data = {
        branchName: branchName,
        slug: slug,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        openHours: openHours,
        closeHours: closeHours,
        services: services
    };
    return axios.post(URL_BACKEND, data);
}

const updateBranch = (id,branchName, slug, address, phoneNumber, email, openHours, closeHours, services) => {
    const URL_BACKEND = `${URL_BRAND}/branch/update/${id}`;
    const data = {
        branchName: branchName,
        slug: slug,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        openHours: openHours,
        closeHours: closeHours,
        services: services
    };
    return axios.post(URL_BACKEND, data);
}
export {
    fetchAllBranch,
    deleteBranch,
    createBrand,
    updateBranch
}