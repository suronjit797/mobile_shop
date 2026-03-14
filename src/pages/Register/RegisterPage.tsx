import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { UserRole } from '../../types';
import { APP_NAME } from '../../constants';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      dispatch(setCredentials({
        accessToken: 'mock-token-456',
        user: { id: '2', name: values.name, email: values.email, role: UserRole.USER },
      }));
      message.success('Account created successfully!');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container-main py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-1">Create Account</Title>
            <Text className="text-muted-foreground">Join {APP_NAME} today</Text>
          </div>
          <Form layout="vertical" onFinish={handleRegister} size="large">
            <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email address" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item name="confirmPassword" dependencies={['password']}
              rules={[{ required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>Create Account</Button>
            </Form.Item>
          </Form>
          <Divider />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium">Sign In</Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
