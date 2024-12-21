import "../../../assets/css/postAdmin.css";
import React, { useEffect, useState } from "react";
import { Spin, Typography, message, Card, Button, Pagination } from "antd";
import { GetAllQuestion } from "../../../services/forumService";
import moment from "moment";
import QuestionDetailModal from "./QuestionDetailModal";
import CreateQuestionModal from "./CreateQuestionModal";

const { Title, Paragraph, Text } = Typography;

const PostPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6); // Số bài viết trên mỗi trang
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null); // Lưu bài viết được chọn
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion();
            if (response.status === 200) {
                // Lọc các bài viết có rolePost là PRIVATES
                const filteredQuestions = response.data.data.filter(
                    (question) => question.rolePost === "PRIVATES"
                );
                setQuestions(filteredQuestions); // Cập nhật state với dữ liệu đã lọc
                message.success("Lấy danh sách bài viết thành công!");
            } else {
                message.error(response.message || "Lấy danh sách thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gọi API!");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (id) => {
        message.info(`Cập nhật bài viết ID: ${id}`);
    };

    const handleDelete = (id) => {
        message.warn(`Xóa bài viết ID: ${id}`);
    };

    const onChangePage = (page) => {
        setCurrentPage(page);
    };
    const openModal = (question) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };
    const onCreateQuestion = () => {
        setIsCreateModalOpen(true);
    };

    const onCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentQuestions = questions.slice(startIndex, endIndex);

    return (
        <div className="post-page-container">
            <div>
                <Title level={2} className="post-page-title">
                    Danh Sách Bài Viết
                </Title>
                <Button type="primary" onClick={onCreateQuestion}>
                    Tạo Bài Viết
                </Button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <Spin tip="Đang tải dữ liệu..." size="large" />
                </div>
            ) : (
                <div>
                    <div className="post-grid">
                        {currentQuestions.map((question) => (
                            <Card
                                key={question.id}
                                className="post-card"
                                hoverable
                                onClick={() => openModal(question)}
                            >
                                <div className="post-card-content">
                                    <div>
                                        <Title level={4} className="post-card-title">
                                            {question.title}
                                        </Title>
                                        <Text type="secondary" className="forum-author">
                                            {question.author} -{" "}
                                            {question.createdAt
                                                ? moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")
                                                : "Chưa có ngày tạo"}
                                        </Text>
                                        <Paragraph
                                            ellipsis={{ rows: 2, expandable: false }}
                                            className="post-card-paragraph"
                                        >
                                            {question.content}
                                        </Paragraph>
                                    </div>
                                    <div className="post-card-actions">
                                        <Button
                                            type="primary"
                                            onClick={() => handleUpdate(question.id)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => handleDelete(question.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={questions.length}
                        onChange={onChangePage}
                        style={{ marginTop: "20px", textAlign: "center" }}
                    />
                </div>
            )}
            {/* Gọi QuestionDetailModal */}
            <QuestionDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                question={selectedQuestion}
            />
            <CreateQuestionModal
                isOpen={isCreateModalOpen}
                onClose={onCloseCreateModal}
                onQuestionCreated={fetchQuestions} // Làm mới danh sách bài viết sau khi tạo
            />
        </div>
    );
};

export default PostPage;
