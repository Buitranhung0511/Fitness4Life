import { Drawer } from "antd";

const ViewUserDetail = (props) => {
    const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props
    return (
        <Drawer
            title="User Detail"
            onClose={() => {
                setDataDetail(null);
                setIsDataDetailOpen(false);
            }}
            open={isDataDetailOpen}
        >
            {dataDetail
                ?
                <>
                    <p>Id:{dataDetail.id}</p>
                    <br />
                    <p>Full Name:{dataDetail.name}</p>
                    <br />
                    <p>Address:{dataDetail.address}</p>
                    <br />
                    <p>Contact Phone:{dataDetail.contactPhone}</p>
                    <br />
                    <p>Description:{dataDetail.description}</p>
                    <br />
                    <p>Open Time:{dataDetail.openHour}</p>
                    <br />
                    <p>Close Time:{dataDetail.closeHour}</p>
                    <div>
                        <img src={`http://localhost:8080/uploads/ClubImage/${dataDetail.imageUrl}`} />
                    </div>


                </>
                :
                <>
                    <h3 style={{ color: "red" }}>dont have any thing here !!!!</h3>
                </>
            }

        </Drawer>
    )
}

export default ViewUserDetail