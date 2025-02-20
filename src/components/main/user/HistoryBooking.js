import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../helpers/DataContext";
import { QRCode, Empty, Spin, Alert, Result, Button } from "antd";
import { HistoryOutlined, CalendarOutlined } from '@ant-design/icons';
import '../../../assets/css/QR.css';
import { jwtDecode } from "jwt-decode";

const HistoryBooking = () => {
    const { user } = useContext(DataContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQRCode, setSelectedQRCode] = useState(null);
    
    // Fetch booking history for the user
    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                // Get token from localStorage
                const tokenData = localStorage.getItem("tokenData");
                
                if (!tokenData) {
                    setError("Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.");
                    setLoading(false);
                    return;
                }
                
                const { access_token } = JSON.parse(tokenData);
                
                console.log("access_token",access_token);
                
                if (!access_token) {
                    setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `http://localhost:8082/api/booking/bookingRooms/history/${user.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const data = await response.json();
                if (!data.data || data.data.length === 0) {
                    setBookings([]);
                    setLoading(false);
                    return;
                }

                const bookingsWithQR = await Promise.all(
                    response.data.data.map(async (booking) => {
                        try {
                            // Fetch QR code for each booking with token
                            const qrResponse = await fetch(
                                `http://localhost:8082/api/booking/qrCode/${booking.id}`,
                                {
                                    headers: {
                                        'Authorization': `Bearer ${access_token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );
                            const dataQR = await qrResponse.json();
                            return {
                                ...booking,
                                checkInQRCode: dataQR.data || null, // Add QR code to booking
                            };
                        } catch (qrError) {
                            return { ...booking, checkInQRCode: null }; // Return booking without QR code if error occurs
                        }
                    })
                );

                setBookings(bookingsWithQR);
            } catch (err) {
                console.error("Error fetching booking history:", err);
                
                if (err.response && err.response.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    setError("Không thể tải dữ liệu lịch sử booking.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchBookingHistory();
        } else {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem lịch sử booking.");
        }
    }, [user?.id]);

    const handleQRCodeClick = (qrCode) => {
        setSelectedQRCode(qrCode);
    };

    const handleCloseQRCode = () => {
        setSelectedQRCode(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Đang tải dữ liệu lịch sử booking...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                className="error-alert"
                action={
                    <Button 
                        size="small" 
                        type="primary"
                        onClick={() => window.location.href = '/login'}
                    >
                        Đăng nhập lại
                    </Button>
                }
            />
        );
    }

    // Empty state
    if (bookings.length === 0) {
        return (
            <section id="services" className="empty-booking-container">
                <Result
                    icon={<HistoryOutlined />}
                    title="Không có lịch sử booking"
                    subTitle="Bạn chưa có lịch sử đặt phòng nào. Hãy đặt phòng để bắt đầu tập luyện!"
                    extra={
                        <Button type="primary" icon={<CalendarOutlined />} href="/booking">
                            Đặt phòng ngay
                        </Button>
                    }
                />
            </section>
        );
    }

    // Normal state with data
    return (
        <section id="services">
            <h2>Lịch Sử Booking</h2>
            <div className="booking-grid">
                {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                        <h3>Phòng: {booking.roomName}</h3>
                        <p>Ngày booking: {new Date(booking.bookingDate).toLocaleString()}</p>
                        <p>Trạng thái: {booking.status}</p>

                        {booking.checkInQRCode ? (
                            <div onClick={() => handleQRCodeClick(booking.checkInQRCode)} className="qr-code-container">
                                <QRCode value={booking.checkInQRCode} size={128} />
                                <p className="qr-hint">Nhấp để phóng to</p>
                            </div>
                        ) : (
                            <div className="no-qr-container">
                                <Empty 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                    description="Không có mã QR" 
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedQRCode && (
                <div className="qr-modal" onClick={handleCloseQRCode}>
                    <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
                        <QRCode value={selectedQRCode} size={256} />
                        <p>Sử dụng mã QR này để check-in</p>
                        <Button type="primary" onClick={handleCloseQRCode}>Đóng</Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HistoryBooking;