import React, { useEffect, useState, useContext } from 'react';
import { Card, Modal, Button, notification, Layout, Typography } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../helpers/DataContext';
import { GetRoomsByPackage, submitBookingRoom } from '../../../services/PackageService';

const { Content } = Layout;
const { Title, Text } = Typography;

const BookingMain = () => {
    const { user, isLoggedIn } = useContext(DataContext);
    const navigate = useNavigate();
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const currentDate = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        return date;
    });

    useEffect(() => {
        const loadRoomsByPackage = async () => {
            try {
                const rooms = await GetRoomsByPackage(user?.workoutPackageId);
                setFilteredRooms(rooms);
            } catch (error) {
                notification.error({
                    message: 'Error Fetching Rooms',
                    description: error.message || 'Something went wrong while fetching rooms.',
                });
            }
        };

        if (user?.workoutPackageId) {
            loadRoomsByPackage();
        }
    }, [user]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const openModal = (room) => {
        if (!isLoggedIn) {
            notification.warning({
                message: 'Authentication Required',
                description: 'You need to log in to book a room. Redirecting to login page...',
            });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleSubmitBooking = async () => {
        if (!selectedRoom) {
            notification.error({
                message: 'Booking Error',
                description: 'Please select a room to book.',
            });
            return;
        }

        const bookingData = {
            userId: user.id,
            roomId: selectedRoom.id,
        };

        try {
            const response = await submitBookingRoom(bookingData);
            if (response.status === 201) {
                notification.success({
                    message: 'Booking Successful',
                    description: `Room ${selectedRoom.roomName} has been booked for ${user.fullName}.`,
                });
                // closeModal();
            } else {
                throw new Error(response.data.message || 'Failed to book the room');
            }
        } catch (error) {
            notification.error({
                message: 'Booking Error',
                description: error.message || 'Something went wrong while booking the room.',
            });
        }
    };

    return (
        <section id="services">
            <Layout className="min-h-screen" style={{ background: '#f5f5f5' }}>
                <Content style={{ padding: '16px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {/* Date Selection */}
                        {/* <Card style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {dates.map((date, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: date.toDateString() === selectedDate.toDateString() ? '#f5222d' : 'transparent',
                                            color: date.toDateString() === selectedDate.toDateString() ? 'white' : 'inherit',
                                        }}
                                    >
                                        <Text strong>{daysOfWeek[date.getDay()]}</Text>
                                        <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{date.getDate()}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card> */}

                        {/* Class Cards */}
                        {filteredRooms.map((room) => (
                            <Card
                                key={room.id}
                                style={{ marginBottom: '16px' }}
                                bodyStyle={{ padding: '16px' }}
                                hoverable
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <Title level={4} style={{ marginBottom: '16px' }}>{room.roomName}</Title>

                                        <div style={{ marginBottom: '8px' }}>
                                            <CalendarOutlined style={{ marginRight: '8px' }} />
                                            <Text>{`${room.startTime[0]}:${room.startTime[1].toString().padStart(2, '0')} - ${room.endTime[0]
                                                }:${room.endTime[1].toString().padStart(2, '0')}`}</Text>
                                        </div>

                                        <div style={{ marginBottom: '8px' }}>
                                            <EnvironmentOutlined style={{ marginRight: '8px' }} />
                                            <Text>{room.facilities}</Text>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <UserOutlined style={{ marginRight: '4px' }} />
                                        <Text type="secondary">
                                            {room.availableSeats}/{room.capacity}
                                        </Text>
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    danger
                                    block
                                    style={{ marginTop: '16px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(room);
                                    }}
                                >
                                    Đặt lịch
                                </Button>
                            </Card>
                        ))}
                    </div>

                    <Modal
                        title={`Book: ${selectedRoom?.roomName}`}
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={[
                            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" danger onClick={handleSubmitBooking}>
                                Confirm Booking
                            </Button>,
                        ]}
                    >
                        {selectedRoom && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <Text strong>Date: </Text>
                                    <Text>{selectedDate.toLocaleDateString()}</Text>
                                </div>
                                <div>
                                    <Text strong>Time: </Text>
                                    <Text>{`${selectedRoom.startTime[0]}:${selectedRoom.startTime[1]} - ${selectedRoom.endTime[0]}:${selectedRoom.endTime[1]}`}</Text>
                                </div>
                                <div>
                                    <Text strong>Available Slots: </Text>
                                    <Text>{selectedRoom.availableSeats}/{selectedRoom.capacity}</Text>
                                </div>
                                <div>
                                    <Text strong>Facilities: </Text>
                                    <Text>{selectedRoom.facilities}</Text>
                                </div>
                            </div>
                        )}
                    </Modal>
                </Content>
            </Layout>
        </section>
    );
};

export default BookingMain;