import { setCredentials } from "@/features/auth/authSlice";
import { useLoginMutation } from "@/redux/api/usersApi";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  notification,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { APP_NAME } from "../../constants";
import { useAppDispatch } from "../../redux/store";

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values).unwrap();
      const { user, token } = res?.data as never;

      dispatch(setCredentials({ accessToken: token, user }));
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: error?.data?.message || "An error occurred during login",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container-main py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-1">
              Welcome Back
            </Title>
            <Text className="text-muted-foreground">
              Sign in to your {APP_NAME} account
            </Text>
          </div>
          <Form layout="vertical" onFinish={handleLogin} size="large">
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
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Sign Up
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Tip: Use "admin@", "seller@", or "super@" in email for different
            roles
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
