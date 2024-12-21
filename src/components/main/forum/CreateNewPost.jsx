import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Upload, Button, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateQuestion } from "../../../services/forumService";
import { DataContext } from "../../helpers/DataContext";

const { Option } = Select;

const categoryOptions = [
    { value: "FORUM_POLICY", label: "Các Chính Sách Diễn Đàn Thể Hình Vui" },
    { value: "FORUM_RULES", label: "Nội Quy Diễn Đàn" },
    { value: "MALE_FITNESS_PROGRAM", label: "Giáo Án Fitness Nam" },
    { value: "FEMALE_FITNESS_PROGRAM", label: "Giáo Án Fitness Nữ" },
    { value: "GENERAL_FITNESS_PROGRAM", label: "Giáo án Thể Hình" },
    { value: "FITNESS_QA", label: "Hỏi Đáp Thể Hình" },
    { value: "POSTURE_CORRECTION", label: "Sửa Tư Thế Kỹ Thuật Tập Luyện" },
    { value: "NUTRITION_EXPERIENCE", label: "Kinh Nghiệm Dinh Dưỡng" },
    { value: "SUPPLEMENT_REVIEW", label: "Review Thực Phẩm Bổ Sung" },
    { value: "WEIGHT_LOSS_QA", label: "Hỏi Đáp Giảm Cân - Giảm Mỡ" },
    { value: "MUSCLE_GAIN_QA", label: "Hỏi Đáp Tăng Cơ - Tăng Cân" },
    { value: "TRANSFORMATION_JOURNAL", label: "Nhật Ký Thay Đổi" },
    { value: "FITNESS_CHATS", label: "Tán Gẫu Liên Quan Fitness" },
    { value: "TRAINER_DISCUSSION", label: "HLV Thể Hình - Trao Đổi Công Việc" },
    { value: "NATIONAL_GYM_CLUBS", label: "CLB Phòng Gym Toàn Quốc" },
    { value: "FIND_WORKOUT_BUDDY", label: "Tìm Bạn Tập Cùng - Team Workout" },
    { value: "SUPPLEMENT_MARKET", label: "Mua Bán Thực Phẩm Bổ Sung" },
    { value: "EQUIPMENT_ACCESSORIES", label: "Dụng Cụ - Phụ Kiện Tập Luyện" },
    { value: "GYM_TRANSFER", label: "Sang Nhượng Phòng Tập" },
    { value: "MMA_DISCUSSION", label: "Võ Thuật Tổng Hợp MMA" },
    { value: "CROSSFIT_DISCUSSION", label: "Cross Fit" },
    { value: "POWERLIFTING_DISCUSSION", label: "Powerlifting" },
];

const CreateNewPost = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(DataContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryLabel = queryParams.get("category");

        if (categoryLabel) {
            // Tìm `value` dựa trên `label`
            const categoryValue = categoryOptions.find(
                (option) => option.label === categoryLabel
            )?.value;

            if (categoryValue) {
                form.setFieldsValue({ category: [categoryValue] }); // Điền `value` vào form
            }
        }
    }, [location, form]);

    const initialValues = {
        authorId: user?.id || "Không xác định",
        author: user?.fullName || "Không xác định",
    };

    const handleSubmit = async (values) => {
        const { title, content, topic, tag, category, imageQuestionUrl, authorId, author } = values;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("topic", topic);
        formData.append("tag", tag);
        formData.append("rolePost", "PUBLICED");
        formData.append("authorId", authorId);
        formData.append("author", author);

        if (category && category.length > 0) {
            category.forEach((cat) => formData.append("category", cat));
        }

        if (imageQuestionUrl && imageQuestionUrl.length > 0) {
            imageQuestionUrl.forEach((file) => {
                formData.append("imageQuestionUrl", file.originFileObj || file);
            });
        }

        // Log chi tiết FormData
        // console.log("data post new: ");
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        try {
            setLoading(true);
            const response = await CreateQuestion(formData);
            if (response.status === 201) {
                message.success("Tạo bài viết thành công!");
                navigate(`/forum/post-new`);
            } else {
                message.error(response.message || "Tạo bài viết thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo bài viết!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <h1>Tạo Bài Viết Mới</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input placeholder="Nhập tiêu đề bài viết" />
                    </Form.Item>
                    <Form.Item
                        label="Chủ đề"
                        name="topic"
                        rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
                    >
                        <Input placeholder="Nhập chủ đề" />
                    </Form.Item>
                    <Form.Item
                        label="Từ khóa"
                        name="tag"
                        rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
                    >
                        <Input placeholder="Nhập từ khóa" />
                    </Form.Item>
                    <Form.Item
                        label="AuthorId"
                        name="authorId"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Author"
                        name="author"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập nội dung bài viết" />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                    >
                        <Select
                            mode="multiple" // Cho phép chọn nhiều mục
                            placeholder="Chọn danh mục"
                            options={categoryOptions} // Danh sách các danh mục
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="imageQuestionUrl"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Tạo bài viết
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
};

export default CreateNewPost;
