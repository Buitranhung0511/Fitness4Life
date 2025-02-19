import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../../services/UsersService";
import AllUsers from "./AllUsers";
import CreateUser from "./CreateUser";
import { logDOM } from "@testing-library/react";

function Users() {
    const [dataUsers, setDataUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const tokenData = localStorage.getItem("tokenData");
    const { access_token } = JSON.parse(tokenData);

    console.log("access_token",access_token);
    console.log("dataUsers",dataUsers);

    const loadUsers = async () => {
        try {
            const res = await fetchAllUsers(access_token);
            
            if (res && Array.isArray(res.data)) {
                setDataUsers(res.data);
                setFilteredData(res.data);
                console.log("Users loaded successfully:", res.data);
            } else {
                console.error("Invalid data format received:", res);
                setDataUsers([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
            setDataUsers([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <CreateUser
                loadUsers={loadUsers}
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />

            <AllUsers
                loadUsers={loadUsers}
                dataUsers={dataUsers}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />
        </div>
    )
}

export default Users