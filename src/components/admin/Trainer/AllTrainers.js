import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, notification, Popconfirm, Table } from 'antd';
import '../../../assets/css/club.css';
import moment from 'moment';
import { deleteTrainer } from '../../../services/TrainerService';
function AllTrainers(props) {
    const { dataTrainer, loadTrainers, setFilteredData, filteredData, setIsModelOpen } = props;
    console.log(">>>Check DATA", dataTrainer);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');

    const [branchFilters, setBranchFilters] = useState([]);
    // useEffect(() => {
    //     const uniqueBranches = [...new Set(dataTrainer.map((trainer) => trainer.branch.name))];
    //     const filters = uniqueBranches.map((branch) => ({
    //         text: branch,
    //         value: branch,
    //     }));
    //     setBranchFilters(filters);
    // }, [dataTrainer]);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (_, record) => (
                <a
                    href="#"
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Specialization',
            dataIndex: 'specialization',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Experience (Years)',
            dataIndex: 'experienceYear',
        },
        // {
        //     title: 'Branch',
        //     dataIndex: 'branch',
        //     filters: branchFilters, // Use dynamically generated filters
        //     onFilter: (value, record) => record.branch.name.startsWith(value),
        //     filterSearch: true,
        //     width: '40%',
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            key="edit"
                            icon={<EditOutlined style={{ color: 'orange' }} />}
                            onClick={() => {
                                setDataUpdate(record);
                                setIsModalUpdateOpen(true);
                            }}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            key="delete"
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                        >
                            <Popconfirm
                                title="Delete Trainer"
                                description="Are you sure delete it?"
                                onConfirm={() => handleDeleteTrainer(record.id)}
                                okText="Yes"
                                cancelText="No"
                                placement="left"
                            >
                                Delete
                            </Popconfirm>
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                        <MoreOutlined
                            style={{
                                fontSize: '18px',
                                cursor: 'pointer',
                                color: '#1890ff',
                            }}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const handleSearch = (value) => {
        const filtered = dataTrainer.filter((item) =>
            item.fullName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        console.log(">>>>CHeck", filtered);
    };

    const handleDeleteTrainer = async (id) => {
        const res = await deleteTrainer(id);
        if (res.data.data) {
            notification.success({
                message: 'Delete Trainer',
                description: 'Delete Trainer successfully....!',
            });
            await loadTrainers();
        } else {
            notification.error({
                message: 'Error delete trainer',
                description: JSON.stringify(res.message),
            });
        }
    };

    return (
        <>
            <div>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Trainers</h2>
                    </div>
                    <div className="user-form">
                        <PlusOutlined
                            name="plus-circle"
                            onClick={() => {
                                setIsModelOpen(true);
                            }}
                            style={{ marginRight: 15, color: '#FF6600' }}
                        />
                        <Input
                            placeholder="Search by name"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            onPressEnter={() => handleSearch(searchText)}
                            style={{ width: 450, marginBottom: 50, marginRight: 100, height: 35 }}
                        />
                    </div>
                </div>

                <Table
                    className="row-highlight-table"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={'id'}
                />
            </div>

            {/* <UpdateTrainer
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadTrainers={loadTrainers}
            />

            <ViewTrainerDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            /> */}
        </>
    );
}

export default AllTrainers;
