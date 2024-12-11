import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyAccountRegister } from '../../../services/authService';
import { Spin, Alert, Card } from 'antd';

const OTPVerification = () => {
    const { email, otp } = useParams(); // Nhận email và otp từ URL
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('info'); // Kiểu thông báo: success, error, warning, info
    const navigate = useNavigate();

    useEffect(() => {
        const verifyOTP = async () => {
            try {
                let result = await verifyAccountRegister(email, otp);
                if (result.status === 200) {
                    setMessage('Verification successful! Redirecting to login...');
                    setAlertType('success');
                    setTimeout(() => {
                        navigate('/login'); // Đường dẫn đến trang đăng nhập
                    }, 2000);
                } else if (result.status === 404) {
                    setMessage('Verification failed. Please check your OTP and try again.');
                    setAlertType('error');
                } else if (result.status === 400) {
                    setMessage(result.message || 'Invalid request.');
                    setAlertType('warning');
                }
            } catch (error) {
                setMessage('An error occurred during verification. Please try again later.');
                setAlertType('error');
            } finally {
                setIsLoading(false);
            }
        };

        verifyOTP();
    }, [email, otp]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 400, textAlign: 'center' }}>
                <h2>OTP Verification</h2>
                {isLoading ? (
                    <Spin size="large" tip="Verifying OTP..." />
                ) : (
                    <Alert message={message} type={alertType} showIcon />
                )}
            </Card>
        </div>
    );
};

export default OTPVerification;

