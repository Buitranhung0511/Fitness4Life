import React, { useContext, useEffect, useState } from "react";
import { Typography, Button, Input, Form, message } from "antd";
import { GetCommentByQuestionId, createComment } from "../../../services/forumService";
import { DataContext } from "../../helpers/DataContext";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const CreateComment = ({ questionId }) => {
    const { user } = useContext(DataContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeReplyForm, setActiveReplyForm] = useState(null);
    const [form] = Form.useForm();

    // Fetch comments by question ID
    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await GetCommentByQuestionId(questionId);
            if (response && response.data) {
                setComments(response.data);
            } else {
                message.error("Không tìm thấy comment!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải comment!");
        } finally {
            setLoading(false);
        }
    };

    // Create new comment
    const handleCreateComment = async (values) => {
        const commentData = {
            userId: user.id,
            userName: user.fullName,
            questionId,
            parentCommentId: values.parentCommentId || null,
            content: values.content,
        };

        try {
            const response = await createComment(commentData);
            if (response && response.status === 200) {
                message.success("Tạo comment thành công!");
                form.resetFields();
                setActiveReplyForm(null);
                await fetchComments(); // Reload comments after adding a new one
            } else {
                message.error("Có lỗi khi tạo comment!");
            }
        } catch (error) {
            message.error("Có lỗi khi tạo comment!");
        }
    };

    // Render comments by levels (2 levels max)
    const renderComments = (commentsList) => {
        return commentsList.map((comment) => (
            <div key={comment.id} style={{ marginLeft: comment.parentCommentId ? 20 : 0, marginBottom: 10 }}>
                <Text strong>{comment.userName}</Text>
                <Paragraph>{comment.content}</Paragraph>
                <Text type="secondary">
                    {moment(comment.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                </Text>

                {/* Button to toggle reply form */}
                <Button
                    type="link"
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveReplyForm(activeReplyForm === comment.id ? null : comment.id);
                    }}
                >
                    Reply
                </Button>

                {/* Form trả lời */}
                {activeReplyForm === comment.id && (
                    <div style={{ marginTop: 10 }}>
                        <Form
                            form={form}
                            layout="inline"
                            onFinish={(values) =>
                                handleCreateComment({ ...values, parentCommentId: comment.id })
                            }
                        >
                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: "Hãy nhập nội dung bình luận" }]}
                            >
                                <Input placeholder="Trả lời bình luận này" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="small">
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                {/* Render child comments only 1 level deep */}
                {comment.replies && comment.replies.length > 0 && comment.parentCommentId === null && (
                    <div>{renderComments(comment.replies)}</div>
                )}
            </div>
        ));
    };

    useEffect(() => {
        fetchComments();

        // Close reply form on outside click
        const handleClickOutside = (event) => {
            if (!event.target.closest(".ant-form")) {
                setActiveReplyForm(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [questionId]);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
            <Title level={3}>Bình luận</Title>

            {/* Form tạo comment mới */}
            <Form onFinish={handleCreateComment} layout="vertical" style={{ marginBottom: 20 }}>
                <Form.Item
                    name="content"
                    label="Nội dung bình luận"
                    rules={[{ required: true, message: "Hãy nhập nội dung bình luận" }]}
                >
                    <Input.TextArea rows={3} placeholder="Nhập bình luận của bạn" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Gửi bình luận
                </Button>
            </Form>

            {/* Hiển thị danh sách comment */}
            {comments.length > 0 ? renderComments(comments) : <Text>Chưa có bình luận nào.</Text>}
        </div>
    );
};

export default CreateComment;
