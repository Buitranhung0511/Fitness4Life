import React, { useContext, useState } from 'react';
import { Card, Button, notification, Row, Col, Typography, Tag, Divider, Space, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../helpers/DataContext';
import axios from 'axios';
import {
  SyncOutlined
} from '@ant-design/icons';
import stickman from '../../../assets/images/Stickman.gif';
import { jwtDecode } from 'jwt-decode';


const { Title, Text } = Typography;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { package: selectedPackage, months: selectedMonths } = location.state || {};
  const { user } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);


  if (!selectedPackage) {
    return (
      <div className="p-8 text-center">
        <Text className="text-xl">No package selected. Please go back and choose a package.</Text>
        <Button
          type="primary"
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    const basePrice = selectedPackage.price;
    const totalPrice = basePrice * selectedMonths;

    let discount = 0;
    if (selectedMonths >= 12) {
      discount = 0.2;
    } else if (selectedMonths >= 9) {
      discount = 0.15;
    } else if (selectedMonths >= 6) {
      discount = 0.1;
    } else if (selectedMonths >= 3) {
      discount = 0.05;
    }

    return Math.round(totalPrice * (1 - discount));
  };



  const handleSubmitPayment = async () => {
    setIsLoading(true);
    try {
      const totalAmount = calculateTotalPrice();
      console.log("totalAmount1212", totalAmount);

      // Validate required data
      if (!selectedPackage?.id || !user?.id) {
        console.error("Validation Error:", {
          selectedPackage: selectedPackage,
          user: user,
          message: "Package or user information is missing"
        });
        throw new Error("Package or user information is missing");
      }

      const payload = {
        packageId: selectedPackage.id,
        userId: user.id,
        description: selectedPackage.description || "Package Subscription",
        cancelUrl: "http://localhost:5173/cancel",
        successUrl: "http://localhost:3000/order",
        currency: "USD",
        intent: "Sale",
      };
      console.log(">> Payment payload:", payload);

      // Get and validate token
      const tokenData = localStorage.getItem("tokenData");
      if (!tokenData) {
        console.error("Token Error: No token data found in localStorage");
        notification.error({
          message: 'Authentication Error',
          description: 'Please log in again to continue.',
        });
        return;
      }

      let parsedTokenData;
      try {
        parsedTokenData = JSON.parse(tokenData);
        console.log(">> Token parsed successfully");
      } catch (error) {
        console.error("Token Parse Error:", {
          error: error,
          tokenData: tokenData
        });
        notification.error({
          message: 'Session Error',
          description: 'Your session is invalid. Please log in again.',
        });
        return;
      }

      const { access_token } = parsedTokenData;
      const decodedToken = jwtDecode(access_token);


      if (!access_token) {
        console.error("Token Validation Error: No access_token in parsed data", parsedTokenData);
        notification.error({
          message: 'Authentication Error',
          description: 'Invalid session. Please log in again.',
        });
        return;
      }

      console.log(">> Making API request to PayPal service...");
      // Use message.loading instead of notification.loading
      const hide = message.loading('Processing payment...', 0);

      try {
        const response = await axios.post(
          'http://localhost:8082/api/paypal/pay',
          payload,
          {
            headers: {
              Authorization: `Bearer ${access_token}`

            },
            timeout: 10000,
          }
        );

        // Hide loading message
        hide();

        const redirectUrl = response.data?.redirectUrl || response.data;
        if (!redirectUrl) {
          console.error("Redirect URL Error:", {
            responseData: response.data,
            message: "No redirect URL received from payment service"
          });
          throw new Error("No redirect URL received from payment service");
        }

        console.log(">> Redirect URL received:", redirectUrl);
        notification.success({
          message: 'Payment Initiated',
          description: 'Redirecting to PayPal...',
          duration: 2,
        });

        setTimeout(() => {
          console.log(">> Redirecting to PayPal...");
          window.location.href = redirectUrl;
        }, 1000);

        // Thành như sau:
        const approvalUrl = response.data?.approvalUrl;
        if (!approvalUrl) {
          console.error("Approval URL Error:", {
            responseData: response.data,
            message: "No approval URL received from PayPal service"
          });
          throw new Error("No approval URL received from PayPal service");
        }

        console.log(">> Approval URL received:", approvalUrl);
        notification.success({
          message: 'Payment Initiated',
          description: 'Redirecting to PayPal Sandbox...',
          duration: 2,
        });

        setTimeout(() => {
          console.log(">> Redirecting to PayPal Sandbox...");
          window.location.href = approvalUrl;
        }, 1000);

      } catch (error) {
        // Hide loading message in case of error
        hide();
        console.error("API Error Details:", {
          error: error,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });

        if (error.response) {
          console.error("Server Error Response:", {
            status: error.response.status,
            data: error.response.data
          });
          notification.error({
            message: 'Payment Error',
            description: error.response.data?.message || 'Server error occurred during payment processing.',
          });
        } else if (error.request) {
          console.error("Network Error:", {
            request: error.request,
            message: "No response received from server"
          });
          notification.error({
            message: 'Connection Error',
            description: 'Unable to connect to payment service. Please check your internet connection.',
          });
        } else {
          console.error("General Error:", {
            error: error,
            message: error.message
          });
          notification.error({
            message: 'Payment Error',
            description: error.message || 'An unexpected error occurred during payment.',
          });
        }
      }

    } catch (error) {
      console.error("General Process Error:", {
        error: error,
        stack: error.stack
      });
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      console.log(">> Payment process completed. Loading state reset.");
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18}>
          <Card className="shadow-lg rounded-lg">
            {/* Header Section */}
            <div className="text-center mb-8">
              <Title level={2} className="text-3xl">
                Payment Summary
              </Title>
              <Text className="text-gray-500">
                Review your selected package details and confirm payment
              </Text>
            </div>

            <Divider />

            {/* User Information */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <Title level={4}>Customer Information</Title>
              <Text className="block text-lg">
                <strong>Name:</strong> {user.fullName}
              </Text>
            </div>

            {/* Package Details */}
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center">
                <Text className="text-gray-600">Package Name:</Text>
                <Text strong className="text-lg">
                  {selectedPackage.packageName}
                </Text>
              </div>

              <div className="flex justify-between items-center">
                <Text className="text-gray-600">Duration:</Text>
                <Tag color="blue" className="text-lg px-4 py-1">
                  {selectedMonths} Months
                </Tag>
              </div>

              <div className="flex justify-between items-center">
                <Text className="text-gray-600">Monthly Base Price:</Text>
                <Text className="text-lg">
                  {selectedPackage.price} $
                </Text>
              </div>

              {/* Discount Section */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Discount Applied:</Text>
                  <Tag color="green">
                    {selectedMonths >= 12 ? '20%' :
                      selectedMonths >= 9 ? '15%' :
                        selectedMonths >= 6 ? '10%' :
                          selectedMonths >= 3 ? '5%' : '0%'}
                  </Tag>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <Text className="text-xl font-semibold">Total Amount:</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {calculateTotalPrice().toLocaleString('vi-VN')} VND
                  </Text>
                </div>
              </div>
            </div>

            {/* Package Description */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <Title level={4}>Package Description</Title>
              <Text className="text-gray-600">
                {selectedPackage.description}
              </Text>
            </div>

            {/* Payment Button */}
            <Button
              type="primary"
              size="large"
              block
              onClick={handleSubmitPayment}
              className="h-14 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Space>
                  <SyncOutlined />
                  <img src={stickman} width={38} height={30} />
                </Space>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;