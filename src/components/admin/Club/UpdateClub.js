import { Input, notification, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateClubApi } from "../../../services/ClubService";


const UpdateClub = (props) => {

    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadClubs } = props
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [description, setDescription] = useState("");
    const [openHour, setOpenHour] = useState("");
    const [closeHour, setCloseHour] = useState("");


    useEffect(() => {
        console.log(">>>Check dataUpdate", dataUpdate);
        if (dataUpdate) {
            setId(dataUpdate.id);
            setName(dataUpdate.name);
            setAddress(dataUpdate.address);
            setContactPhone(dataUpdate.contactPhone);
            setDescription(dataUpdate.description);
            setOpenHour(dataUpdate.openHour);
            setCloseHour(dataUpdate.closeHour);
        }
    }, [dataUpdate])

    const handleSubmitBtn = async () => {
        const res = await updateClubApi(id, name, address, contactPhone, description, openHour, closeHour);
        if (res.data.data) {
            notification.success({
                message: "Update Club",
                description: "Update Club Successfully !! ....."
            })
            resetAndCloseModal()
            await loadClubs();
        } else {
            notification.error({
                message: "Error Update Club",
                description: JSON.stringify(res.message)
            })
        }

    }

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setId("");
        setName("");
        setAddress("");
        setContactPhone("");
        setDescription("");
        setOpenHour("");
        setCloseHour("");
        setDataUpdate(null);
    }

    return (
        <Modal
            title="Edit Club"
            open={isModalUpdateOpen}
            onOk={() => { handleSubmitBtn(()=>{console.log(dataUpdate);
            }) }}
            onCancel={() => { resetAndCloseModal() }}
            okText={"Update"}
            cancelText={"No"}
            //Nếu không set thằng nừ thì khi nhấn CreateUser xong người dùng nhấn vào khoản trống bên ngoai popop sẽ tự đóng
            maskClosable={false}//
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Id</span>
                    <Input
                        value={id}
                        disabled
                    />
                </div>
                <div>
                    <span>Club Name</span>
                    <Input
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Address</span>
                    <Input
                        value={address}
                        onChange={(event) => { setAddress(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Contact phone</span>
                    <Input
                        value={contactPhone}
                        onChange={(event) => { setContactPhone(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Description</span>
                    <Input
                        value={description}
                        onChange={(event) => { setDescription(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Open_Hour</span>
                    <Input
                        type="time"
                        value={openHour}
                        onChange={(event) => { setOpenHour(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Close_Hour</span>
                    <Input
                        type="time"
                        value={closeHour}
                        onChange={(event) => { setCloseHour(event.target.value) }}
                    />
                </div>
            </div>
        </Modal>
    )
}


export default UpdateClub