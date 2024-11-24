import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, notification, Pagination, Popconfirm, Table, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import UpdateClub from './UpdateClub';
import { deleteClubApi } from '../../../services/ClubService';
import ViewUserDetail from './DetailClub';

function AllClubs(props) {
    const { dataClubs, loadClubs } = props

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(dataClubs);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (_, record) => {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataDetail(record);
                            setIsDataDetailOpen(true);
                        }}
                    >{record.id}</a>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            filters: [
                {
                    text: 'Lad',
                    value: 'Joe',
                }

            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value),
            width: '30%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            filters: [
                {
                    text: '477 Elm St',
                    value: '477 Elm St',
                },
                {
                    text: '223 HongHa st',
                    value: '223 HongHa st',
                },
            ],
            onFilter: (value, record) => record.address.startsWith(value),
            filterSearch: true,
            width: '40%',
        },
        {
            title: 'Contact Phone',
            dataIndex: 'contactPhone',
        },
        {
            title: 'Close Hour',
            dataIndex: 'closeHour',
       
        },
        {
            title: 'Open Hour',
            dataIndex: 'openHour',
            
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <EditOutlined
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => {
                            setDataUpdate(record)
                            setIsModalUpdateOpen(true)
                        }}
                    />
                    <Popconfirm
                        title="Delete Club"
                        description="Are you sure delete it ?? ....."
                        onConfirm={() => { handleDeleteUser(record.id) }}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                </div>
            ),
        }
    ];

    const handleSearch = (value) => {
        const filtered = dataClubs.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered);
    };

    const handleDeleteUser = async (id) => {
        const res = await deleteClubApi(id);
        console.log("id: ", id);
        if (res.data.data) {
            notification.success({
                message: "Delete Club",
                description: "Delete Club successfully....!"
            })
            await loadClubs();
        } else {
            notification.error({
                message: "Error delete user",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };



    return (
        <>
            <div>
                {/* Tạo ô tìm kiếm */}
                <Input
                    placeholder="Search by name"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    onPressEnter={() => handleSearch(searchText)}
                    style={{ width: 200, marginBottom: 20 }}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => handleSearch(searchText)}
                >

                </Button>

                {/* Bảng với dữ liệu đã lọc */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={"id"}
                    onChange={onChange}

                />
            </div>

            <UpdateClub
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadClubs={loadClubs}
            />

            <ViewUserDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            />
            <Pagination
                total={100}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                defaultPageSize={20}
                defaultCurrent={1}
            />
        </>
    )
}

export default AllClubs;
