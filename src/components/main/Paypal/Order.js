import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { notification } from 'antd';

function OrderPage() {
    const location = useLocation(); // Lấy thông tin URL hiện tại

    useEffect(() => {
        // Hàm trích xuất query params từ URL
        const getQueryParams = (url) => {
            const params = new URLSearchParams(url);
            return {
                paymentId: params.get('paymentId'),
                token: params.get('token'),
                PayerID: params.get('PayerID'),
            };
        };

        const finalizePayment = async () => {
            const { paymentId, token, PayerID } = getQueryParams(location.search); // Lấy query params
            console.log("Extracted Query Params:", { paymentId, token, PayerID });

            if (!paymentId || !token || !PayerID) {
                notification.error({
                    message: 'Payment Error',
                    description: 'Missing payment details. Please try again.',
                });
                return;
            }

            try {
                console.log("Payload being sent to API:", { paymentId, token, PayerID });

                // Gửi POST request đến API
                const response = await axios.post(
                    `http://localhost:8082/api/paypal/success?paymentId=${paymentId}&token=${token}&PayerID=${PayerID}`
                );

                // Xử lý phản hồi từ API
                if (response.data.success) {
                    notification.success({
                        message: 'Payment Successful',
                        description: 'Your payment was completed successfully!',
                    });
                } else {
                    notification.error({
                        message: 'Payment Failed',
                        description: response.data.message || 'Unable to finalize payment. Please contact support.',
                    });
                }
            } catch (error) {
                console.error('Error finalizing payment:', error);

                if (error.response) {
                    // Lỗi từ API (response code khác 200)
                    notification.error({
                        message: 'Payment Error',
                        description: `Error from server: ${error.response.data.message || 'Unexpected error occurred.'} (Status: ${error.response.status})`,
                    });
                } else if (error.request) {
                    // Không nhận được phản hồi từ server
                    notification.error({
                        message: 'Payment Error',
                        description: 'No response from server. Please check your network or try again later.',
                    });
                } else {
                    // Lỗi khác
                    notification.error({
                        message: 'Payment Error',
                        description: `Unexpected error: ${error.message}`,
                    });
                }
            }
        };

        finalizePayment();
    }, [location.search]); // Chạy khi URL thay đổi

    return (
        <section id="services">
            <h1>Order Pay</h1>
        </section>
    );
}

export default OrderPage;
