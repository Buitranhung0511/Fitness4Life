import { useLocation } from 'react-router-dom';
import { Card, Button, notification } from 'antd';
import React, { useContext } from 'react';
import { DataContext } from '../../helpers/DataContext';
import { paymentApi } from '../../../services/PackageService';
import axios from 'axios';

function PaymentPage() {
    const location = useLocation();
    const { package: selectedPackage } = location.state || {}; // Get package info from state
    const { user } = useContext(DataContext); // Get user info from context

    // const handleSubmitPayment = async () => {
    //     if (!selectedPackage) {
    //         notification.error({
    //             message: 'Error',
    //             description: 'No package selected. Please go back and choose a package.',
    //         });
    //         return;
    //     }
    
    //     try {
    //         // Gọi paymentApi với thông tin từ gói và user
    //         const response = await paymentApi(
    //             selectedPackage.id, // packageId
    //             user.id, // userId từ context
    //             selectedPackage.price, // totalAmount
    //             new Date().toISOString(), // startDate (ngày hiện tại)
    //             new Date(
    //                 new Date().setMonth(new Date().getMonth() + selectedPackage.durationMonth)
    //             ).toISOString(), // endDate (ngày kết thúc tính theo thời hạn gói)
    //             selectedPackage.description, // description
    //             selectedPackage.packageName // packageName
    //         );
    //         // Kiểm tra nếu API trả về redirectUrl
    //         if (response.data && response.data.redirectUrl) {
    //             console.log('Payment API response:', response.data);
    //             window.location.href = response.data.redirectUrl; // Redirect đến URL thanh toán
    //         } else {
    //             notification.warning({
    //                 message: 'Payment Warning',
    //                 description: 'Payment API did not return a valid redirect URL. Please contact support.',
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error during payment submission:', error);
    //         notification.error({
    //             message: 'Payment Error',
    //             description: 'An error occurred while processing your payment. Please try again later.',
    //         });
    //     }
    // };


    // const handleSubmitPayment = async (pkg) => {
       
    //     try {
    //         const payload = {
    //             packageId: pkg.id,
    //             userId: user.id, // Use user ID from DataContext
    //             buyDate: new Date().toISOString(),
    //             totalAmount: pkg.price,
    //             startDate: "2024-10-10", // Replace with dynamic start date if needed
    //             endDate: "2024-11-10", // Replace with dynamic end date if needed
    //             description: pkg.description,
    //             cancelUrl: "http://localhost:5173/cancel",
    //             successUrl: "http://localhost:5173/success",
    //             packageName: pkg.packageName,
    //             currency: "USD",
    //             intent: "Sale",
    //         };
            

    //         const response = await axios.post('http://localhost:8082/api/paypal/pay', payload);
    //         console.log(">>>>>Check user pay:",user.id);

    //         if (response.data && response.data.redirectUrl) {
    //             window.location.href = response.data.redirectUrl;
    //         } else {
    //             console.warn('Redirecting to fallback URL from response log.');
    //             window.location.href = response.data;
    //         }
    //     } catch (error) {
    //         console.error('Error processing payment:', error);
    //     }
    // };
    const handleSubmitPayment = async () => {
        if (!selectedPackage) {
            notification.error({
                message: 'Error',
                description: 'No package selected. Please go back and choose a package.',
            });
            return;
        }
    
        try {
            const payload = {
                packageId: selectedPackage.id,
                userId: user.id, // Use user ID from DataContext
                buyDate: new Date().toISOString(),
                totalAmount: selectedPackage.price,
                startDate: new Date().toISOString(), // Dynamic start date (current date)
                endDate: new Date(
                    new Date().setMonth(new Date().getMonth() + selectedPackage.durationMonth)
                ).toISOString(), // Calculate end date dynamically based on package duration
                description: selectedPackage.description,
                cancelUrl: "http://localhost:5173/cancel",
                successUrl: "http://localhost:5173/success",
                packageName: selectedPackage.packageName,
                currency: "USD",
                intent: "Sale",
            };
    
            const response = await axios.post('http://localhost:8082/api/paypal/pay', payload);
    
            console.log(">>> Payment payload sent:", payload); // Log payload for debugging
            console.log(">>> Payment API response:", response.data); // Log API response


            if (response.data && response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else {
                console.warn('Redirecting to fallback URL from response log.');
                window.location.href = response.data;
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            notification.error({
                message: 'Payment Error',
                description: 'An error occurred while processing your payment. Please try again later.',
            });
        }
    };
    


    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment Page</h2>

            {selectedPackage ? (
                <Card
                    title={selectedPackage.packageName}
                    bordered={true}
                    style={{ width: 400, margin: '0 auto' }}
                >
                    <p><strong>Description:</strong> {selectedPackage.description}</p>
                    <p><strong>Duration:</strong> {selectedPackage.durationMonth} months</p>
                    <p><strong>Price:</strong> {selectedPackage.price.toLocaleString('vi-VN')} VND</p>
                    <p><strong>User:</strong> {user.fullName}</p> {/* Display user info */}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button type="primary" onClick={handleSubmitPayment}>
                            Submit Payment
                        </Button>
                    </div>
                </Card>
            ) : (
                <p style={{ textAlign: 'center' }}>No package selected. Please go back and choose a package.</p>
            )}
        </div>
    );
}

export default PaymentPage;
