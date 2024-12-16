import React from "react";
import { Card, Col, Row, List, Typography, Badge, Button } from "antd";

const ForumPage = () => {
    const forumData = [
        {
            category: "Nội Quy Chung",
            forums: [
                { title: "Các Chính Sách Diễn Đàn Thể Hình Vui", threads: 1, posts: 2 },
                { title: "Nội Quy Diễn Đàn", threads: 1, posts: 1 },
            ],
        },
        {
            category: "Giáo Án Tổng Hợp",
            forums: [
                { title: "Giáo Án Tập Luyện", threads: 22, posts: 163 },
            ],
        },
        {
            category: "Thể Hình Fitness",
            forums: [
                { title: "Kiến Thức Thể Hình", threads: 207, posts: 1900 },
            ],
        },
        {
            category: "Tăng Cơ - Giảm Mỡ",
            forums: [
                { title: "Tăng Cân - Giảm Mỡ", threads: 46, posts: 291, isNew: true },
            ],
        },
        {
            category: "Góc Thể Hiện Bản Thân",
            forums: [
                { title: "Góc Thể Hiện", threads: 59, posts: 281 },
            ],
        },
        {
            category: "Khu Mua Sắm - Trao Đổi",
            forums: [
                { title: "Mua Bán Thực Phẩm Bổ Sung ", threads: 19, posts: 103 },
                { title: "Dụng Cụ - Phụ Kiện Tập Luyện ", threads: 8, posts: 17 },
                { title: "Sang Nhượng Phòng Tập", threads: 6, posts: 13 }
            ],
        },
        {
            category: "Chuyên Mục Liên Quan",
            forums: [
                { title: "Võ Thuật Tổng Hợp MMA", threads: 1, posts: 1 },
                { title: "CrossFit", threads: 2, posts: 10 },
                { title: "Street Workout", threads: 2, posts: 8 },
                { title: "PowerLifting", threads: 4, posts: 11 },
            ],
        },
    ];

    const recentPosts = [
        { title: "Cơ thể sẽ ra sao nếu thiếu vitamin B3?", time: "46 phút trước" },
        { title: "Vitamin B2 là gì? Tác dụng của vitamin B2", time: "Hôm qua 10:27 AM" },
        { title: "Coenzyme Q10 là gì? Tác dụng sức khỏe", time: "Thứ Ba, 9:41 AM" },
        { title: "Suy Nhược Thần Kinh: Nguyên Nhân và Điều Trị", time: "2 tháng trước" },
    ];

    return (
        <section id="services">
            <div className="container mt-5">
                <Row>
                    <Col xs={24} className="text-center">
                        <Typography.Title level={2} className="mb-4">
                            Chào Mừng Bạn Đến Mới Diễn Đàn Thể Hình Việt Nam
                        </Typography.Title>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col md={16}>
                        {forumData.map((category, index) => (
                            <Card key={index} title={category.category} className="mb-4">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={category.forums}
                                    renderItem={(forum) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <div>
                                                        <Typography.Text strong>{forum.title}</Typography.Text>
                                                        {forum.isNew && (
                                                            <Badge count="Mới" style={{ marginLeft: 10, backgroundColor: "#ff4d4f" }} />
                                                        )}
                                                    </div>
                                                }
                                                description={
                                                    <div>
                                                        <span>Threads: {forum.threads}</span> | <span>Bài viết: {forum.posts}</span>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        ))}
                    </Col>
                    <Col md={8}>
                        <Card title="Bài Viết Mới" className="mb-4">
                            <List
                                dataSource={recentPosts}
                                renderItem={(post, index) => (
                                    <List.Item key={index}>
                                        <Typography.Text>{post.title}</Typography.Text>
                                        <div style={{ fontSize: "12px", color: "gray" }}>{post.time}</div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default ForumPage;
