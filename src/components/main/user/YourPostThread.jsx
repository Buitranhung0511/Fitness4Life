import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Typography, List, notification } from "antd";
import { DataContext } from "../../helpers/DataContext";
import { useNavigate } from "react-router-dom";
import { GetAllQuestion } from "../../../services/forumService";

const { Title, Text } = Typography;

const YourPostThread = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await GetAllQuestion();

                if (response.status === 200) {
                    const allPosts = response.data.data;

                    if (!Array.isArray(allPosts)) {
                        throw new Error("Invalid API data format. Expected an array.");
                    }

                    if (!user?.id || !user?.fullName) {
                        throw new Error("User data is missing or invalid.");
                    }

                    const userPosts = allPosts.filter(
                        (post) =>
                            post.author?.trim().toLowerCase() === user?.fullName.trim().toLowerCase()
                    );

                    setPosts(userPosts);
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: response.message || "Không thể tải bài viết.",
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

        fetchUserPosts();
    }, [user]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // Điều hướng đến trang chi tiết bài viết
    };

    const truncateContent = (content, length = 40) => {
        if (content.length > length) {
            return `${content.substring(0, length)}...`;
        }
        return content;
    };

    return (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <Title level={2}>Bài Viết Của Bạn</Title>
            {loading ? (
                <div>Loading...</div>
            ) : posts.length > 0 ? (
                <List
                    dataSource={posts}
                    renderItem={(post) => (
                        <List.Item>
                            <Card
                                title={post.title}
                                extra={
                                    <Button type="link" onClick={() => handlePostClick(post.id)}>
                                        Xem chi tiết
                                    </Button>
                                }
                                style={{ width: "100%" }}
                            >
                                <Text ellipsis style={{ display: "block", marginBottom: "8px" }}>
                                    {truncateContent(post.content)}{" "}
                                    {post.content.length > 40 && (
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={() => handlePostClick(post.id)}
                                        >
                                            Xem thêm
                                        </Button>
                                    )}
                                </Text>
                                <Text type="secondary">
                                    <strong>Danh mục:</strong>{" "}
                                    {Array.isArray(post.category)
                                        ? post.category.join(", ")
                                        : post.category || "Không có danh mục"}
                                </Text>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Text>Không có bài viết nào.</Text>
            )}
        </div>
    );
};

export default YourPostThread;
