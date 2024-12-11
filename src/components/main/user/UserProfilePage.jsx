// import React, { useContext } from 'react';
// import { Card, Avatar, Button, Row, Col, Typography, Divider, Space } from 'antd';
// import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
// import { DataContext } from '../../helpers/DataContext';

// const { Title, Text } = Typography;

// const UserProfilePage = () => {
//     const { user } = useContext(DataContext);

//     if (!user) {
//         return (
//             <div style={{ padding: '24px', textAlign: 'center' }}>
//                 <div className="alert alert-warning" role="alert">
//                     No user data available. Please log in.
//                 </div>
//             </div>
//         );
//     }

//     const {
//         fullName,
//         role,
//         gender,
//         active,
//         phone,
//         profileDTO,
//     } = user;

//     const {
//         hobbies = null,
//         address = null,
//         age = null,
//         heightValue = null,
//         avatar = null,
//         maritalStatus = null,
//         description = null,
//     } = profileDTO || {}; // Ensure profileDTO is safely handled

//     return (
//         <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
//             <Card
//                 style={{
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//                     borderRadius: '8px',
//                     padding: '24px',
//                     backgroundColor: '#ffffff',
//                 }}
//             >
//                 {/* Header Section */}
//                 <Row gutter={[16, 16]} align="middle">
//                     <Col span={6}>
//                         <Avatar
//                             size={120}
//                             src={avatar || 'https://via.placeholder.com/120'}
//                             style={{
//                                 border: '3px solid #1890ff',
//                                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//                             }}
//                         />
//                     </Col>
//                     <Col span={18}>
//                         <Space direction="vertical" size="small">
//                             <Title level={3} style={{ marginBottom: 0, color: '#001529' }}>
//                                 {fullName || 'User Name'}
//                             </Title>
//                             <Text type="secondary" strong>
//                                 {role || 'User Role'}
//                             </Text>
//                             <div>
//                                 <Button type="primary" icon={<MailOutlined />} style={{ marginRight: '8px' }}>
//                                     Send message
//                                 </Button>
//                                 <Button icon={<PhoneOutlined />}>Contacts</Button>
//                             </div>
//                         </Space>
//                     </Col>
//                 </Row>

//                 <Divider />

//                 {/* Contact Information */}
//                 <Row gutter={[16, 16]}>
//                     <Col span={12}>
//                         <Title level={5} style={{ color: '#595959' }}>Contact Information</Title>
//                         <Space direction="vertical" size="middle">
//                             <p>
//                                 <PhoneOutlined />{' '}
//                                 <Text style={{ fontSize: '14px', color: '#3b5999' }}>{phone || 'No phone available'}</Text>
//                             </p>
//                             <p>
//                                 <EnvironmentOutlined />{' '}
//                                 <Text style={{ fontSize: '14px', color: '#3b5999' }}>{address || 'No address available'}</Text>
//                             </p>
//                             <p>
//                                 <GlobalOutlined />{' '}
//                                 <Text style={{ fontSize: '14px', color: '#3b5999' }}>N/A</Text>
//                             </p>
//                         </Space>
//                     </Col>
//                     <Col span={12}>
//                         <Title level={5} style={{ color: '#595959' }}>Personal Details</Title>
//                         <Space direction="vertical" size="middle">
//                             <p>
//                                 <Text strong>Gender:</Text>{' '}
//                                 <Text style={{ fontSize: '14px', color: '#ff5722' }}>{gender || 'Not specified'}</Text>
//                             </p>
//                             <p>
//                                 <Text strong>Age:</Text>{' '}
//                                 <Text style={{ fontSize: '14px', color: '#4caf50' }}>{age ? `${age} years` : 'Not specified'}</Text>
//                             </p>
//                             <p>
//                                 <Text strong>Height:</Text>{' '}
//                                 <Text style={{ fontSize: '14px', color: '#4caf50' }}>
//                                     {heightValue ? `${heightValue} cm` : 'Not specified'}
//                                 </Text>
//                             </p>
//                             <p>
//                                 <Text strong>Marital Status:</Text>{' '}
//                                 <Text style={{ fontSize: '14px', color: '#1890ff' }}>{maritalStatus || 'Not specified'}</Text>
//                             </p>
//                         </Space>
//                     </Col>
//                 </Row>

//                 <Divider />

//                 {/* Hobbies and Description */}
//                 <Row>
//                     <Col span={24}>
//                         <Title level={5} style={{ color: '#595959' }}>About</Title>
//                         <Text style={{ fontSize: '14px', color: '#595959' }}>
//                             {description || 'No description available'}
//                         </Text>
//                     </Col>
//                 </Row>
//             </Card>
//         </div>
//     );
// };

// export default UserProfilePage;

// import React, { useContext, useState } from 'react';
// import { Card, Avatar, Button, Row, Col, Typography, Divider, Space } from 'antd';
// import { PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
// import { DataContext } from '../../helpers/DataContext';
// import ChangePasswordModal from '../login/ChangePasswordModal';

// const { Title, Text } = Typography;

// const UserProfilePage = () => {
//     const { user } = useContext(DataContext);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     if (!user) {
//         return (
//             <div style={{ padding: '24px', textAlign: 'center' }}>
//                 <div className="alert alert-warning" role="alert">
//                     No user data available. Please log in.
//                 </div>
//             </div>
//         );
//     }

//     const {
//         fullName,
//         role,
//         phone,
//         profileDTO: { address, avatar, description } = {},
//     } = user;

//     return (
//         <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
//             <Card>
//                 <Row gutter={[16, 16]} align="middle">
//                     <Col span={6}>
//                         <Avatar
//                             size={120}
//                             src={avatar || 'https://via.placeholder.com/120'}
//                             style={{
//                                 border: '3px solid #1890ff',
//                             }}
//                         />
//                     </Col>
//                     <Col span={18}>
//                         <Space direction="vertical" size="small">
//                             <Title level={3}>{fullName || 'User Name'}</Title>
//                             <Text type="secondary" strong>
//                                 {role || 'User Role'}
//                             </Text>
//                             <Button type="primary" onClick={() => setIsModalOpen(true)}>
//                                 Change Password
//                             </Button>
//                         </Space>
//                     </Col>
//                 </Row>

//                 <Divider />

//                 <Row>
//                     <Col span={12}>
//                         <Title level={5}>Contact Information</Title>
//                         <Text>
//                             <PhoneOutlined /> {phone || 'No phone available'}
//                         </Text>
//                         <br />
//                         <Text>
//                             <EnvironmentOutlined /> {address || 'No address available'}
//                         </Text>
//                     </Col>
//                     <Col span={12}>
//                         <Title level={5}>About</Title>
//                         <Text>{description || 'No description available'}</Text>
//                     </Col>
//                 </Row>
//             </Card>

//             <ChangePasswordModal
//                 open={isModalOpen} // Sửa visible thành open
//                 onClose={() => setIsModalOpen(false)}
//                 email={user.email}
//             />
//         </div>
//     );
// };

// export default UserProfilePage;


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
