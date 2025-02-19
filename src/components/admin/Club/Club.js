import { useEffect, useState } from "react"
import { fetchAllClubs } from "../../../services/ClubService";
import CreateClub from "./CreateClub";
import AllClubs from "./AllClubs";

function Club() {
    const [dataClubs, setDataClubs] = useState([]);
    const [filteredData, setFilteredData] = useState([]); 
    const [isModalOpen, setIsModelOpen] = useState(false);
    const tokenData = localStorage.getItem("tokenData");
    const { access_token } = JSON.parse(tokenData);
    console.log("access_token",access_token);
    console.log("dataUsers",dataClubs);

    const loadClubs = async () => {
        try {
            const data = await fetchAllClubs(access_token); // Now fetchAllClubs returns parsed data
            console.log("Response data:", data); // Log to see the structure

            if (data && Array.isArray(data.data)) {
                setDataClubs(data.data);
                setFilteredData(data.data);
                console.log("Clubs loaded successfully:", data.data);
            } else {
                console.error("Invalid data format received:", data);
                setDataClubs([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
            setDataClubs([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadClubs();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <CreateClub
                loadClubs={loadClubs}
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />

            <AllClubs
                loadClubs={loadClubs}
                dataClubs={dataClubs}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />
        </div>
    )
}

export default Club