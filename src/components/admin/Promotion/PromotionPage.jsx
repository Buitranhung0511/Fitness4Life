import React, { useEffect, useRef, useState } from 'react';
import { Table, notification, Button, Switch } from 'antd';
import { changestatus, getAllPromotions } from '../../../services/PromotioService';
import PromotionDetailsModal from './PromotionDetailsModal';
import CreatePromotionModal from './CreatePromotionModal';
import moment from 'moment';

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]); // Quản lý danh sách khuyến mãi
    const [loading, setLoading] = useState(false); // Quản lý trạng thái tải dữ liệu
    const [selectedPromotion, setSelectedPromotion] = useState(null); // Lưu dữ liệu khuyến mãi được chọn
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Trạng thái hiển thị modal tạo mới
    const pollingInterval = useRef(null); // Dùng để lưu interval polling

    // Hàm gọi API lấy danh sách khuyến mãi
    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await getAllPromotions();
            if (response && response.data) {
                setPromotions(response.data);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch promotions.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
        pollingInterval.current = setInterval(fetchPromotions, 10000); // Tự động gọi lại API mỗi 30 giây
        return () => clearInterval(pollingInterval.current); // Dọn dẹp interval khi unmount
    }, []);

    // Hàm xử lý khi nhấn vào Title hoặc Description
    const handleRowClick = (record) => {
        setSelectedPromotion(record); // Lưu dữ liệu khuyến mãi được chọn
        setIsModalVisible(true); // Hiển thị modal
    };

    // Hàm xử lý khi tạo mới thành công
    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false); // Đóng modal tạo mới
        fetchPromotions(); // Tải lại danh sách khuyến mãi
    };
    // Hàm xử lý thay đổi trạng thái
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await changestatus(id, newStatus);
            if (response.status === 201 || response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: `Status changed to ${newStatus ? 'Active' : 'Inactive'} successfully!`,
                });
                fetchPromotions(); // Làm mới danh sách sau khi cập nhật thành công
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to change status.',
            });
        }
    };


    // Định nghĩa các cột trong bảng
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <span style={{ cursor: 'pointer' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <span style={{ cursor: 'pointer' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Discount Value',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value) => `₫ ${value}`,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },



        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatusChange(record.id, !isActive)}
                />
            ),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Promotion List</h2>
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: '20px' }}>
                Create Promotion
            </Button>
            <Table
                dataSource={Array.isArray(promotions) ? promotions : []} // Đảm bảo là mảng
                columns={columns}
                rowKey="id"
                loading={loading}
                bordered
            />

            {/* Modal hiển thị chi tiết khuyến mãi */}
            <PromotionDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                promotion={selectedPromotion}
            />
            {/* Modal tạo mới khuyến mãi */}
            <CreatePromotionModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default PromotionPage;
