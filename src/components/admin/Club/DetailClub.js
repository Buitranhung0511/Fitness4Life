import { Drawer, Descriptions, Typography, Image } from "antd";

const { Title, Text } = Typography;

const ViewClubDetail = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

  return (
    <Drawer
      title={<Title level={4}>Club Detail</Title>}
      onClose={() => {
        setDataDetail(null);
        setIsDataDetailOpen(false);
      }}
      open={isDataDetailOpen}
      width={500}
      footer={
        <Text type="secondary">
          Thank you for using our service. For more details, please contact support.
        </Text>
      }
    >
      {dataDetail ? (
        <>
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold", width: "30%" }}
            contentStyle={{ background: "#fafafa" }}
          >
            <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{dataDetail.name}</Descriptions.Item>
            <Descriptions.Item label="Address">{dataDetail.address}</Descriptions.Item>
            <Descriptions.Item label="Contact Phone">{dataDetail.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="Description">{dataDetail.description}</Descriptions.Item>
            <Descriptions.Item label="Open Time">{dataDetail.openHour}</Descriptions.Item>
            <Descriptions.Item label="Close Time">{dataDetail.closeHour}</Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Title level={5}>Club Image</Title>
            <Image
              src="http://localhost:9998/uploads/avatarImage/a6c264a0-cf80-42b7-92a7-0aa5276b08e82.jpg"
              alt="Club"
              style={{ maxHeight: "200px", borderRadius: "10px" }}
              placeholder
            />
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>Don't have anything here!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default ViewClubDetail;
