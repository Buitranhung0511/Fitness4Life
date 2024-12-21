import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, message } from "antd";
import moment from "moment";
import { GetAllQuestion } from "../../../services/forumService";

const { Title, Paragraph, Text } = Typography;

const DetailPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchQuestionDetails = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion(); // Giả lập API trả về tất cả câu hỏi
            const foundQuestion = response.data.data.find((q) => q.id.toString() === id);

            if (foundQuestion) {
                setQuestion(foundQuestion);
            } else {
                message.error("Không tìm thấy bài viết!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi lấy thông tin bài viết!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestionDetails();
    }, [id]);

    if (loading || !question) {
        return (
            <div className="spinner-container">
                <Spin tip="Đang tải thông tin bài viết..." size="large">
                    <div style={{ padding: "50px" }} /> {/* Nội dung tạm thời */}
                </Spin>
            </div>

        );
    }

    return (
        <section id="services">
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginTop: '90px' }}>
                <Title level={2}>{question.title}</Title>
                <Text type="secondary">
                    Tác giả: {question.author} -{" "}
                    {moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                </Text>
                <div style={{ margin: "20px 0" }}>
                    {question.questionImage && question.questionImage.length > 0 && (
                        <img
                            src={question.questionImage[0].imageUrl}
                            alt={question.title}
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    )}
                </div>
                <Paragraph style={{ lineHeight: "1.8" }}>{question.content}</Paragraph>
            </div>
        </section>
    );
};

export default DetailPage;
