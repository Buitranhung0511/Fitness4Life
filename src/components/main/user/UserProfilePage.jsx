import React, { useContext, useState, useEffect } from "react";
import { Card, Avatar, Button, Row, Col, Typography, Divider, Space, notification } from "antd";
import { PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from "@ant-design/icons";
import { DataContext } from "../../helpers/DataContext";
import { getOneUserById } from "../../../services/authService";
import ChangePasswordModal from "../login/ChangePasswordModal";
import UpdateProfileModal from "./UpdateProfileModal";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const UserProfilePage = () => {
    const { user, setUser } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const navigate = useNavigate();
    // Lấy dữ liệu người dùng bằng API
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const response = await getOneUserById(user.id); // Gọi API lấy dữ liệu user
                // console.log("data trước :", response);

                if (response.status === 200) {
                    const userData = response.data;

                    // Kiểm tra và gán giá trị mặc định nếu profile không tồn tại hoặc null
                    if (!userData.profile) {
                        userData.profile = {
                            hobbies: "No hobbies available",
                            address: "No address available",
                            age: "No age available",
                            heightValue: "No height value available",
                            description: "No description available",
                            maritalStatus: "No marital status available",
                            avatar: "https://via.placeholder.com/120", // Giá trị mặc định
                        };
                    }

                    setUser(userData); // Cập nhật DataContext
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: response.message || "Không thể tải dữ liệu người dùng.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể kết nối với máy chủ.",
                });
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchUserData();
    }, [user?.id, setUser]);


    if (loading) {
        return <div style={{ textAlign: "center", padding: "24px" }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <div className="alert alert-warning" role="alert">
                    No user data available. Please log in.
                </div>
            </div>
        );
    }

    const {
        fullName = "No name available",
        email = "No email available",
        phone = "No phone available",
        role = "No role available",
        gender = "No gender available",
        profile = {}, // Cập nhật từ profile thay vì profileDTO
    } = user;

    const {
        hobbies = "No hobbies available",
        address = "No address available",
        age = "No age available",
        heightValue = "No height value available",
        description = "No description available",
        maritalStatus = "No marital status available",
        avatar = "https://via.placeholder.com/120", // Giá trị mặc định
    } = profile;

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                <Card>
                    <Row gutter={[16, 16]} align="middle">
                        <Col span={6}>
                            <Avatar
                                size={120}
                                src={`${avatar?.startsWith("http") ? avatar : "https://via.placeholder.com/120"}?t=${Date.now()}`}
                                style={{
                                    border: "3px solid #1890ff",
                                }}
                            />
                        </Col>
                        <Col span={18}>
                            <Space direction="vertical" size="small">
                                <Title level={3}>{fullName}</Title>
                                <Text type="secondary" strong>
                                    {role}
                                </Text>
                                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                                    Change Password
                                </Button>
                                <Button type="primary" onClick={() => setIsUpdateModalOpen(true)}>
                                    Update Profile
                                </Button>
                                <Button type="dashed" onClick={() => navigate("/post-thread")}>
                                    Create Post
                                </Button>
                                <Button type="dashed" onClick={() => navigate("/your-posts")}>
                                    Your Posts
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <Divider />

                    <Row>
                        <Col span={12}>
                            <Title level={5}>Contact Information</Title>
                            <p>
                                <PhoneOutlined /> <Text>{phone}</Text>
                            </p>
                            <p>
                                <EnvironmentOutlined /> <Text>{address}</Text>
                            </p>
                            <p>
                                <GlobalOutlined /> <Text>{email}</Text>
                            </p>
                        </Col>

                        <Col span={12}>
                            <Title level={5}>Additional Details</Title>
                            <p>
                                <Text strong>Gender:</Text> <Text>{gender}</Text>
                            </p>
                            <p>
                                <Text strong>Age:</Text> <Text>{age}</Text>
                            </p>
                            <p>
                                <Text strong>Height:</Text> <Text>{heightValue} cm</Text>
                            </p>
                            <p>
                                <Text strong>Marital Status:</Text> <Text>{maritalStatus}</Text>
                            </p>
                            <p>
                                <Text strong>Hobbies:</Text> <Text>{hobbies}</Text>
                            </p>
                        </Col>
                    </Row>

                    <Divider />

                    <Row>
                        <Col span={24}>
                            <Title level={5}>About</Title>
                            <Text>{description}</Text>
                        </Col>
                    </Row>
                </Card>

                {/* Change Password Modal */}
                <ChangePasswordModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    email={user.email}
                />

                {/* Update Profile Modal */}
                <UpdateProfileModal
                    open={isUpdateModalOpen}
                    onClose={async (updatedUserData) => {
                        setIsUpdateModalOpen(false);
                        if (updatedUserData) {
                            try {
                                const response = await getOneUserById(user.id); // Gọi API lấy lại dữ liệu user mới
                                // console.log("data sau :", response);
                                if (response.status === 200) {
                                    setUser(response.data); // Cập nhật DataContext
                                    localStorage.setItem("user", JSON.stringify(response.data)); // Lưu vào localStorage
                                }
                            } catch (error) {
                                notification.error({
                                    message: "Lỗi",
                                    description: "Không thể kết nối với máy chủ để tải lại dữ liệu.",
                                });
                            }
                        }
                    }}
                    userId={user.id}
                    userData={{
                        fullName,
                        phone,
                        gender,
                        hobbies,
                        address,
                        age,
                        maritalStatus,
                        heightValue,
                        description,
                        role,
                        avatar,
                    }}
                />

            </div>
        </section>
    );
};

export default UserProfilePage;