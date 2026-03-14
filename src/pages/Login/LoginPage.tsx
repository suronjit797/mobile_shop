import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { UserRole } from '../../types';
import { APP_NAME } from '../../constants';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    // Mock login - replace with RTK Query mutation
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: values.email,
        role: values.email.includes('admin') ? UserRole.ADMIN
          : values.email.includes('seller') ? UserRole.SELLER
          : values.email.includes('super') ? UserRole.SUPER_ADMIN
          : UserRole.USER,
      };
      dispatch(setCredentials({ accessToken: 'mock-token-123', user: mockUser }));
      message.success('Login successful!');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container-main py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-1">Welcome Back</Title>
            <Text className="text-muted-foreground">Sign in to your {APP_NAME} account</Text>
          </div>
          <Form layout="vertical" onFinish={handleLogin} size="large">
            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email address" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>Sign In</Button>
            </Form.Item>
          </Form>
          <Divider />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-medium">Sign Up</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Tip: Use "admin@", "seller@", or "super@" in email for different roles
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
