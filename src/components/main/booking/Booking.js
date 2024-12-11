import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Input, Badge, Modal, Select, Button, Form, notification } from 'antd';
import { fetchAllRoom } from '../../../services/RoomService';
import { fetchAllUsers } from '../../../services/UsersService';
import { submitBookingRoom } from '../../../services/PackageService';

const { Meta } = Card;
const { Option } = Select;

function BookingMain() {
    const [rooms, setRooms] = useState([]); // State for storing rooms
    const [filteredRooms, setFilteredRooms] = useState([]); // State for filtered rooms
    const [searchText, setSearchText] = useState(''); // Search text
    const [selectedRoom, setSelectedRoom] = useState(null); // State for selected room
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [users, setUsers] = useState([]); // State for storing users
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user

    const [form] = Form.useForm(); // Form instance for validation and submission

    // Fetch data from API when component is mounted
    useEffect(() => {
        const loadRooms = async () => {
            try {
                const response = await fetchAllRoom();
                if (response.data && response.data.data) {
                    setRooms(response.data.data); // Set all rooms
                    setFilteredRooms(response.data.data); // Set initial filtered rooms
                } else {
                    throw new Error('Failed to fetch room data');
                }
            } catch (error) {
                notification.error({
                    message: 'Error Fetching Rooms',
                    description: error.message || 'Something went wrong while fetching room data.',
                });
            }
        };

        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers();
                if (response.data && response.data) {
                    setUsers(response.data); // Set all users
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                notification.error({
                    message: 'Error Fetching Users',
                    description: error.message || 'Something went wrong while fetching user data.',
                });
            }
        };

        loadRooms();
        loadUsers();
    }, []);

    // Handle search functionality
    const handleSearch = (value) => {
        const filtered = rooms.filter((room) =>
            room.roomName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRooms(filtered);
    };

    // Handle opening modal with selected room details
    const openModal = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    // Handle closing modal
    const closeModal = () => {
        setSelectedRoom(null);
        setSelectedUser(null); // Reset selected user
        form.resetFields(); // Reset form
        setIsModalOpen(false);
    };

    // Handle booking submission
    const handleSubmitBooking = async () => {
        if (!selectedRoom || !selectedUser) {
            notification.error({
                message: 'Booking Error',
                description: 'Please select a user and a room to book!',
            });
            return;
        }

        const bookingData = {
            userId: selectedUser,
            roomId: selectedRoom.id,
        };

        try {
            const response = await submitBookingRoom(bookingData);
            if (response.status === 201) {
                notification.success({
                    message: 'Booking Successful',
                    description: `Room ${selectedRoom.roomName} has been booked for the selected user.`,
                });
                closeModal(); // Close modal after successful booking
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
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1>Rooms</h1>
                <Input
                    placeholder="Search by Room Name"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    style={{ width: '50%', margin: '0 auto', display: 'block' }}
                />
            </div>
            <Row gutter={[16, 16]}>
                {filteredRooms.map((room) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                        <Badge.Ribbon
                            text={room.status ? 'Available' : 'Unavailable'}
                            color={room.status ? 'green' : 'red'}
                        >
                            <Card
                                hoverable
                                style={{ width: '100%' }}
                                title={room.roomName}
                                onClick={() => openModal(room)}
                            >
                                <Meta
                                    description={
                                        <>
                                            <p>
                                                <strong>Slot:</strong> {room.availableSeats}/{room.capacity}
                                            </p>
                                            <p>
                                                <strong>Facilities:</strong> {room.facilities}
                                            </p>
                                            <p>
                                                <strong>Start Time:</strong> {room.startTime}
                                            </p>
                                            <p>
                                                <strong>End Time:</strong> {room.endTime}
                                            </p>
                                        </>
                                    }
                                />

                            </Card>
                        </Badge.Ribbon>
                    </Col>
                ))}
            </Row>

            {selectedRoom && (
                <Modal
                    title={`Room Details: ${selectedRoom.roomName}`}
                    open={isModalOpen}
                    onCancel={closeModal}
                    footer={[
                        <Button key="cancel" onClick={closeModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleSubmitBooking}>
                            Submit Booking
                        </Button>,
                    ]}
                >
                    <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
                    <p><strong>Available Seats:</strong> {selectedRoom.availableSeats}</p>
                    <p><strong>Facilities:</strong> {selectedRoom.facilities}</p>
                    <p><strong>Start Time:</strong> {`${selectedRoom.startTime[0]}:${selectedRoom.startTime[1] === 0 ? '00' : selectedRoom.startTime[1]}`}</p>
                    <p><strong>End Time:</strong> {`${selectedRoom.endTime[0]}:${selectedRoom.endTime[1] === 0 ? '00' : selectedRoom.endTime[1]}`}</p>
                    <p><strong>Status:</strong> {selectedRoom.status ? 'Available' : 'Unavailable'}</p>

                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Select User"
                            name="userId"
                            rules={[{ required: true, message: 'Please select a user!' }]}
                        >
                            <Select
                                placeholder="Select a user"
                                onChange={(value) => setSelectedUser(value)}
                            >
                                {users.map((user) => (
                                    <Option key={user.id} value={user.id}>
                                        {user.fullName} (ID: {user.id})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
}

export default BookingMain;
