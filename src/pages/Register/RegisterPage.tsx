import { IUser } from "@/interfaces/userInterface";
import { useCreateUserMutation } from "@/redux/api/usersApi";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  notification,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { APP_NAME } from "../../constants";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleRegister = async (values: Partial<IUser>) => {
    try {
      const user = await createUser(values).unwrap();
      navigate("/login");
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description:
          error?.data?.message || "An error occurred during registration",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container-main py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-1">
              Create Account
            </Title>
            <Text className="text-muted-foreground">Join {APP_NAME} today</Text>
          </div>
          <Form layout="vertical" onFinish={handleRegister} size="large">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email address" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
