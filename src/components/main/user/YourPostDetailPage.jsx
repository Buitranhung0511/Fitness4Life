import React, { useEffect, useState } from "react";
import { Typography, Divider, Spin, notification } from "antd";
import { useParams } from "react-router-dom";
import { GetAllQuestion } from "../../../services/forumService";

const { Title, Text, Paragraph } = Typography;

const YourPostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await GetAllQuestion(); // Giả sử API trả về danh sách
                if (response.status === 200) {
                    const allPosts = response.data.data;
                    const foundPost = allPosts.find((p) => p.id === Number(postId));
                    setPost(foundPost || null);
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: response.message || "Không thể tải chi tiết bài viết.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể kết nối với máy chủ.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [postId]);

    if (loading) return <Spin size="large" />;
    if (!post) return <Text>Không tìm thấy bài viết.</Text>;

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <Title level={3}>{post.title}</Title>
                <Text type="secondary">Tác giả: {post.author}</Text>
                <Divider />
                <Paragraph>{post.content}</Paragraph>
                <Divider />
                <Text type="secondary">Chủ đề: {post.topic}</Text>
                <br />
                <Text type="secondary">Từ khóa: {post.tag}</Text>
                <br />
                <Text type="secondary">Danh mục: {post.category?.join(", ")}</Text>
                <Divider />
                {post.imageQuestionUrl?.length > 0 && (
                    <div>
                        <Title level={5}>Hình ảnh:</Title>
                        {post.imageQuestionUrl.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Hình ảnh ${index + 1}`}
                                style={{ maxWidth: "100%", marginBottom: "16px" }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default YourPostDetailPage;
