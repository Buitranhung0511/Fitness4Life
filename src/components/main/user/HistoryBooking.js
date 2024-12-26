import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../helpers/DataContext";
import { QRCode } from "antd";
import '../../../assets/css/QR.css'

const HistoryBooking = () => {
    const { user } = useContext(DataContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQRCode, setSelectedQRCode] = useState(null);

    useEffect(() => {
        // Fetch booking history for the user
        const fetchBookingHistory = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8082/api/booking/bookingRooms"
                );

                // Filter bookings by userId
                const userBookings = response.data.data.filter(
                    (booking) => booking.userId === user.id
                );

                setBookings(userBookings);
            } catch (err) {
                setError("Không thể tải dữ liệu lịch sử booking.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, [user.id]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleQRCodeClick = (qrCode) => {
        setSelectedQRCode(qrCode);
    };

    const handleCloseQRCode = () => {
        setSelectedQRCode(null);
    };

    return (
        <section id="history-booking">
            <h2>Lịch Sử Booking</h2>
            {bookings.length === 0 ? (
                <p>Bạn chưa có lịch sử booking phòng nào.</p>
            ) : (
                <div className="booking-grid">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <h3>Phòng: {booking.roomName}</h3>
                            <p>Ngày booking: {new Date(booking.bookingDate).toLocaleString()}</p>
                            <p>Trạng thái: {booking.status}</p>
                            <div onClick={() => handleQRCodeClick(booking.checkInQRCode)}>
                                <QRCode value={booking.checkInQRCode} size={128} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedQRCode && (
                <div className="qr-modal" onClick={handleCloseQRCode}>
                    <div className="qr-modal-content">
                        <QRCode value={selectedQRCode} size={256} />
                    </div>
                </div>
            )}
        </section>
    );
};

export default HistoryBooking;
