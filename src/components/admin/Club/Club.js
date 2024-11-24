
import { useEffect, useState } from "react"
import { fetchAllClubs } from "../../../services/ClubService";
import CreateClub from "./CreateClub";
import AllClubs from "./AllClubs";


function Club() {

    const [dataClubs, setDataClubs] = useState([]);

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        const res = await fetchAllClubs()
        console.log("Dữ Liệu Trả Về từ res.date", res.data.data);
        setDataClubs(res.data.data);
    }

    return (
        <div style={{ padding: "20px" }}>
            <CreateClub loadClubs={loadClubs} />

            <AllClubs
                loadClubs={loadClubs}
                dataClubs={dataClubs} />
        </div>
    )
}

export default Club