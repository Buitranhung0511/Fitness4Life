
import { useEffect, useState } from "react"
import { fetchAllClubs } from "../../../services/ClubService";
import CreateClub from "./CreateClub";
import AllClubs from "./AllClubs";


function Club() {

    const [dataClubs, setDataClubs] = useState([]);
    const [filteredData, setFilteredData] = useState(dataClubs);

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        const res = await fetchAllClubs();
        setFilteredData(res.data.data);
        setDataClubs(res.data.data);
    }

    return (
        <div style={{ padding: "20px" }}>
            <CreateClub loadClubs={loadClubs} />

            <AllClubs
                loadClubs={loadClubs}
                dataClubs={dataClubs} 
                filteredData={filteredData}
                setFilteredData={setFilteredData}

                />
        </div>
    )
}

export default Club