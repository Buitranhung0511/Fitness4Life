import { Input, notification, Modal, Select, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { updateTrainer } from "../../../services/TrainerService";
import axios from "axios";

const UpdateTrainer = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadTrainers } = props;
    const [fullName, setFullName] = useState("");
    const [slug, setSlug] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [experienceYear, setExperienceYear] = useState("");
    const [certificate, setCertificate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [scheduleTrainers, setScheduleTrainers] = useState([]);
    const [branch, setBranch] = useState("");
    const [file, setFile] = useState(null);
    const [branches, setBranches] = useState([]);  // State to store branch data
    const [error, setErrors] = useState({});

    // Fetch Branch data when component mounts
    useEffect(() => {
        const fetchAllBranch = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/dashboard/branchs");
                setBranches(response.data.data);  // Store the fetched branches
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        fetchAllBranch();
    }, []);

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "fullName":
                newErrors.fullName = value.trim() ? "" : "Full name is required.";
                break;
            case "phoneNumber":
                newErrors.phoneNumber = value.trim() ? "" : "Phone number is required.";
                break;
            case "experienceYear":
                newErrors.experienceYear = value && Number(value) >= 0 ? "" : "Experience year must be a positive number.";
                break;
            case "file":
                if (value && !/\.(jpg|jpeg|png)$/i.test(value.name)) {
                    newErrors.file = "File must be a .jpg, .jpeg, or .png image.";
                } else {
                    newErrors.file = "";
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            fullName: fullName.trim() ? "" : "Full name is required.",
            phoneNumber: phoneNumber.trim() ? "" : "Phone number is required.",
            experienceYear: experienceYear && Number(experienceYear) >= 0 ? "" : "Experience year must be a positive number.",
            specialization: specialization ? "" : "Specialization is required.",
            branch: branch ? "" : "Branch is required.",
        };

        if (file && !/\.(jpg|jpeg|png)$/i.test(file.name)) {
            newErrors.file = "File must be a .jpg, .jpeg, or .png image.";
        }

        setErrors(newErrors);
        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            fullName: setFullName,
            slug: setSlug,
            specialization: setSpecialization,
            experienceYear: setExperienceYear,
            certificate: setCertificate,
            phoneNumber: setPhoneNumber,
            scheduleTrainers: setScheduleTrainers,
            branch: setBranch,
            file: setFile,
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    useEffect(() => {
        if (dataUpdate) {
            setFullName(dataUpdate.fullName || "");
            setSlug(dataUpdate.slug || "");
            setSpecialization(dataUpdate.specialization || "");
            setExperienceYear(dataUpdate.experienceYear || "");
            setCertificate(dataUpdate.certificate || "");
            setPhoneNumber(dataUpdate.phoneNumber || "");
            setScheduleTrainers(dataUpdate.scheduleTrainers || []);
            setBranch(dataUpdate.branch || "");
            setFile(dataUpdate.file || null);
            console.log("súdsdsa: ", dataUpdate);

        }
    }, [dataUpdate]);

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
            });
            return;
        }

        try {
            const res = await updateTrainer(
                dataUpdate.id,
                fullName,
                slug,
                file,
                specialization,
                experienceYear,
                certificate,
                phoneNumber,
                scheduleTrainers,
                branch
            );

            notification.success({
                message: "Update Trainer",
                description: "Trainer updated successfully.",
            });
            resetAndCloseModal();
            await loadTrainers();
        } catch (error) {
            console.error("Error:", error.response || error.message);
            notification.error({
                message: "Error Updating Trainer",
                description: error.response?.data?.message || "An unexpected error occurred.",
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setFullName("");
        setSlug("");
        setSpecialization("");
        setExperienceYear("");
        setCertificate("");
        setPhoneNumber("");
        setScheduleTrainers([]);
        setBranch("");
        setFile(null);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit Trainer"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <Input
                    value={fullName}
                    placeholder="Full Name"
                    onChange={(e) => handleChange("fullName", e.target.value)}
                />
                <Input
                    value={slug}
                    placeholder="Slug"
                    onChange={(e) => handleChange("slug", e.target.value)}
                />
                <Input
                    value={specialization}
                    placeholder="Specialization"
                    onChange={(e) => handleChange("specialization", e.target.value)}
                />
                <Input
                    value={experienceYear}
                    placeholder="Experience Year"
                    onChange={(e) => handleChange("experienceYear", e.target.value)}
                />
                <Input
                    value={certificate}
                    placeholder="Certificate"
                    onChange={(e) => handleChange("certificate", e.target.value)}
                />
                <Input
                    value={phoneNumber}
                    placeholder="Phone Number"
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
                <Select
                    mode="multiple"
                    value={scheduleTrainers}
                    placeholder="Schedule"
                    onChange={(value) => handleChange("scheduleTrainers", value)}
                >
                    <Select.Option value="MONDAY">Monday</Select.Option>
                    <Select.Option value="TUESDAY">Tuesday</Select.Option>
                    <Select.Option value="WEDNESDAY">Wednesday</Select.Option>
                    <Select.Option value="THURSDAY">Thursday</Select.Option>
                    <Select.Option value="FRIDAY">Friday</Select.Option>
                    <Select.Option value="SATURDAY">Saturday</Select.Option>
                    <Select.Option value="SUNDAY">Sunday</Select.Option>
                </Select>
                <Select
                    value={branch}
                    placeholder="Branch"
                    onChange={(value) => handleChange("branch", value)}
                >
                    {branches.map((branchItem) => (
                        <Select.Option key={branchItem.id} value={branchItem.id}>
                            {branchItem.branchName}
                        </Select.Option>
                    ))}
                </Select>

                <Input
                    type="file"
                    onChange={(e) => handleChange("file", e.target.files[0])}
                />
                {error.file && <span style={{ color: "red" }}>{error.file}</span>}
            </div>
        </Modal>
    );
};

export default UpdateTrainer;
