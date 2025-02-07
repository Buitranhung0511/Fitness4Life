import React, { useContext } from 'react';
import { Card, Button, notification, Row, Col, Typography, Tag, Divider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../helpers/DataContext';
import axios from 'axios';

const { Title, Text } = Typography;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { package: selectedPackage, months: selectedMonths } = location.state || {};
  const { user } = useContext(DataContext);

  console.log("location.state>>>",location.state);
  
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
    console.log(">>>totalPrice",totalPrice);

    return Math.round(totalPrice * (1 - discount));
  };
console.log(">>TotalPrice",calculateTotalPrice);

  const handleSubmitPayment = async () => {
    try {
      const totalAmount = calculateTotalPrice();
      console.log(">>Total Amount",totalAmount)
      const payload = {
        packageId: selectedPackage.id,
        userId: user.id,
        totalAmount: totalAmount,
        description: selectedPackage.description,
        cancelUrl: "http://localhost:5173/cancel",
        successUrl: "http://localhost:3000/order",
        currency: "USD",
        intent: "Sale",
      };


      const response = await axios.post('http://localhost:8082/api/paypal/pay', payload);

      if (response.data && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        window.location.href = response.data;
      }
    } catch (error) {
      notification.error({
        message: 'Payment Error',
        description: 'An error occurred while processing your payment. Please try again later.',
      });
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
                  {selectedPackage.price.toLocaleString('vi-VN')} VND
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
            >
              Proceed to Payment
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;
