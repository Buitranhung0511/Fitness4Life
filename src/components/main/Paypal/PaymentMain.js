import { useLocation } from "react-router-dom";

const PaymentMain = () => {
    const location = useLocation();
    const packageData = location.state?.package;
  return (
    <section id="services">
        <h3>PAYMENT</h3>
            {packageData && (
                <div>
                    <p><strong>Package:</strong> {packageData.packageName}</p>
                    <p><strong>Description:</strong> {packageData.description}</p>
                    <p><strong>Price:</strong> {packageData.price.toLocaleString('vi-VN')} VND</p>
                </div>
            )}
    </section>
  );
};

export default PaymentMain;
