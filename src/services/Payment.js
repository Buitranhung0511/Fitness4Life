import axios from "axios";

const URL_PACK = "http://localhost:8082/api";

export const paymentApi = (packageId,userId,totalAmount,startDate,endDate,description,packageName,currency,intent) => {
    const URL_BACKEND = `${URL_PACK}/paypal/pay`;
    const data = {
        packageId: packageId, // Thay bằng giá trị phù hợp nếu cần
        userId: userId, // Thay bằng giá trị phù hợp nếu cần
        buyDate: new Date().toISOString(), // Lấy ngày giờ hiện tại
        totalAmount: totalAmount, // Tùy chỉnh dựa trên gói đã chọn
        startDate:startDate,
        endDate:endDate,
        description:description,
        packageName: packageName, // Gắn giá trị từ gói
        currency:currency,
        intent:intent
    };

    try {
        const response = axios.post(URL_BACKEND, data);
        console.log("Payment API response:", response.data);
    } catch (error) {
        console.error("Error calling Payment API:", error);
    }
};

 
