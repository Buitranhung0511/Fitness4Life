import React, { useContext, useState } from 'react';
import { Card, Avatar, Button, Row, Col, Typography, Divider, Space } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { DataContext } from '../../helpers/DataContext';
import ChangePasswordModal from '../login/ChangePasswordModal';

const { Title, Text } = Typography;

const UserProfilePage = () => {
    const { user } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <div className="alert alert-warning" role="alert">
                    No user data available. Please log in.
                </div>
            </div>
        );
    }

    const {
        fullName,
        email,
        phone,
        role,
        gender,
        profileDTO, // Không destructuring ngay
    } = user;

    // Gán giá trị mặc định nếu profileDTO là null
    const {
        address = 'No address provided',
        age = 'No age provided',
        avatar = 'https://via.placeholder.com/120',
        description = 'No description provided',
        heightValue = 'No height value provided',
        hobbies = 'No hobbies provided',
        maritalStatus = 'No marital status provided',
    } = profileDTO || {}; // Kiểm tra nếu profileDTO là null

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <Card>
                {/* Avatar and Basic Info */}
                <Row gutter={[16, 16]} align="middle">
                    <Col span={6}>
                        <Avatar
                            size={120}
                            src={avatar}
                            style={{
                                border: '3px solid #1890ff',
                            }}
                        />
                    </Col>
                    <Col span={18}>
                        <Space direction="vertical" size="small">
                            <Title level={3}>{fullName || 'User Name'}</Title>
                            <Text type="secondary" strong>
                                {role || 'User Role'}
                            </Text>
                            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                                Change Password
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Divider />

                {/* Contact Information */}
                <Row>
                    <Col span={12}>
                        <Title level={5}>Contact Information</Title>
                        <p>
                            <PhoneOutlined /> <Text>{phone || 'No phone available'}</Text>
                        </p>
                        <p>
                            <EnvironmentOutlined /> <Text>{address}</Text>
                        </p>
                        <p>
                            <GlobalOutlined /> <Text>{email}</Text>
                        </p>
                    </Col>

                    {/* Additional Info */}
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

                {/* Description */}
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
        </div>
    );
};

export default UserProfilePage;
