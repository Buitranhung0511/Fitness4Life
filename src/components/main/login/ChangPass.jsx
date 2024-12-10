import { Input, Modal, Button, notification } from "antd";
import { useState } from "react";
import { GetOTP, ResetPass } from "../../../services/UsersService";

function ChangePass(props) {
    const { isChangePassOpen, setChangePassOpen } = props;
    const [email, setEmail] = useState("");
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [step, setStep] = useState(1); // Bước 1: Send Email, Bước 2: Đổi mật khẩu

    const handleSendOTP = async () => {
        if (!email) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng nhập email trước khi gửi OTP.",
            });
            return;
        }

        try {
            setSendingOTP(true);
            await GetOTP(email); // Gọi API để gửi OTP
            notification.success({
                message: "Thành công",
                description: "OTP đã được gửi đến email của bạn.",
            });
            setStep(2); // Chuyển sang bước đổi mật khẩu
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể gửi OTP.",
            });
        } finally {
            setSendingOTP(false);
        }
    };

    const handleResetPass = async () => {
        if (!email || !OTP) {
            notification.error({
                message: "Lỗi",
                description: "Email và OTP không được để trống!",
            });
            return;
        }

        try {
            setLoading(true);
            await ResetPass(email, OTP); // Gọi API ResetPass
            notification.success({
                message: "Thành công",
                description: "Mật khẩu mới đã được gửi đến email của bạn.",
            });
            resetAndCloseModal();
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "This OTP code was used",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetAndCloseModal = () => {
        setEmail("");
        setOTP("");
        setChangePassOpen(false);
        setStep(1); // Reset về bước 1
    };

    return (
        <Modal
            title={step === 1 ? "Send Email" : "Đổi mật khẩu"}
            open={isChangePassOpen}
            onCancel={resetAndCloseModal}
            footer={
                step === 2 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button onClick={resetAndCloseModal}>Hủy</Button>
                        <Button
                            type="primary"
                            loading={loading}
                            onClick={handleResetPass}
                        >
                            Xác nhận
                        </Button>
                    </div>
                )
            }
            maskClosable={false}
        >
            {step === 1 ? (
                // Gửi email
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="primary"
                        loading={sendingOTP}
                        onClick={handleSendOTP}
                    >
                        Gửi OTP
                    </Button>
                </div>
            ) : (
                // Đổi mật khẩu
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <Input
                        placeholder="Email"
                        value={email}
                        disabled
                    />
                    <Input
                        placeholder="OTP"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                </div>
            )}
        </Modal>
    );
}

export default ChangePass;

