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
                console.log("Fetched comments:", response.data); // Kiểm tra dữ liệu trả về
                setComments(response.data);
            } else {
                message.error("Không tìm thấy comment!");
            }
        } catch (error) {
            console.error("API error:", error);
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
                form.resetFields();
                setActiveReplyForm(null);

                // Thêm bình luận mới trực tiếp vào danh sách
                // setComments((prevComments) => [
                //     ...prevComments,
                //     { ...commentData, id: response.data.id, createdAt: new Date() },
                // ]);
                setTimeout(() => {
                    fetchComments();
                }, 3000);
            } else {
                message.error("Có lỗi khi tạo comment!");
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            message.error("Có lỗi khi tạo comment!");
        }
    };

    // Build tree structure for comments
    const buildCommentTree = (commentsList) => {
        const commentMap = {};
        const tree = [];

        // Initialize comment map
        commentsList.forEach((comment) => {
            comment.children = [];
            commentMap[comment.id] = comment;
        });

        // Build the tree
        commentsList.forEach((comment) => {
            if (comment.parentCommentId) {
                const parent = commentMap[comment.parentCommentId];
                if (parent) {
                    parent.children.push(comment);
                }
            } else {
                tree.push(comment);
            }
        });
        console.log("Built comment tree:", tree); // Log cây bình luận để kiểm tra
        return tree;
    };

    // Render comments recursively
    const renderComments = (commentsList, parentUserName = null, level = 0) => {
        return commentsList.map((comment) => (
            <div
                key={comment.id}
                style={{
                    marginLeft: level === 1 ? 50 : 0,
                    marginBottom: 10,
                    borderBottom: level === 0 ? "1px solid #f0f0f0" : "none",
                    paddingBottom: level === 0 ? 10 : 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                        <Text strong>{comment.userName}</Text>
                        <Paragraph style={{ margin: 0 }}>
                            {parentUserName && parentUserName !== comment.userName && (
                                <Text strong style={{ backgroundColor: "#e6f7ff", padding: "2px 4px", borderRadius: "4px" }}>
                                    {parentUserName}
                                </Text>
                            )} {comment.content}
                        </Paragraph>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "12px", marginTop: "5px" }}>
                            <Text type="secondary">{moment(comment.createdAt, "YYYY-MM-DD HH:mm:ss").fromNow()}</Text>
                            <Button type="link" size="small" style={{ padding: 0 }}>Thích</Button>
                            <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setActiveReplyForm(activeReplyForm === comment.id ? null : comment.id)}>Phản hồi</Button>
                            <Button type="link" size="small" style={{ padding: 0 }}>Chia sẻ</Button>
                        </div>
                    </div>
                </div>

                {/* Form trả lời */}
                {activeReplyForm === comment.id && (
                    <div style={{ marginTop: "10px" }}>
                        <Form
                            form={form}
                            layout="inline"
                            style={{ marginTop: "5px" }}
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

                {/* Render child comments */}
                {comment.children && comment.children.length > 0 && (
                    <div style={{ marginTop: 10 }}>{renderComments(comment.children, comment.userName, level + 1)}</div>
                )}
            </div>
        ));
    };

    useEffect(() => {
        fetchComments();
    }, [questionId]);

    useEffect(() => {
        console.log("Updated comments state:", comments); // Kiểm tra state comments khi cập nhật
    }, [comments]);

    const commentTree = buildCommentTree(comments);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
            <Title level={3}>Bình luận</Title>

            {/* Form tạo comment mới */}
            <Form
                form={form}
                onFinish={handleCreateComment}
                layout="vertical"
                style={{ marginBottom: 20 }}>
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
            {commentTree.length > 0 ? renderComments(commentTree) : <Text>Chưa có bình luận nào.</Text>}
        </div>
    );
};

export default CreateComment;


