import { Typography, Card, Avatar, Descriptions, Button } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import MainLayout from "../../components/layout/MainLayout";
import { useAppSelector } from "../../redux/store";

const { Title } = Typography;

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <MainLayout>
      <div className="container-main py-8 max-w-3xl mx-auto">
        <Title level={2}>My Profile</Title>
        <Card>
          <div className="flex items-center gap-6 mb-6">
            <Avatar size={80} icon={<UserOutlined />} className="bg-primary" />
            <div>
              <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">
                Role: {user?.role}
              </p>
            </div>
          </div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {user?.phone || "Not set"}
            </Descriptions.Item>
          </Descriptions>
          <Button type="primary" icon={<EditOutlined />} className="mt-4">
            Edit Profile
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
