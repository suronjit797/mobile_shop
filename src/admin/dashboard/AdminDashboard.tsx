import { Card, Row, Col, Statistic, Table, Typography, Tag } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: 54231, prefix: '$', icon: <DollarOutlined />, color: 'text-primary' },
    { title: 'Total Orders', value: 1423, icon: <ShoppingCartOutlined />, color: 'text-secondary' },
    { title: 'Total Products', value: 356, icon: <ShoppingOutlined />, color: 'text-accent' },
    { title: 'Total Users', value: 8932, icon: <UserOutlined />, color: 'text-destructive' },
  ];

  const recentOrders = [
    { key: '1', orderId: 'ORD-001', customer: 'John Doe', total: 249.99, status: 'delivered' },
    { key: '2', orderId: 'ORD-002', customer: 'Jane Smith', total: 89.99, status: 'shipped' },
    { key: '3', orderId: 'ORD-003', customer: 'Bob Johnson', total: 349.99, status: 'processing' },
    { key: '4', orderId: 'ORD-004', customer: 'Alice Brown', total: 129.99, status: 'pending' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'orange', processing: 'blue', shipped: 'cyan', delivered: 'green', cancelled: 'red',
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
  ];

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((s, i) => (
          <Col xs={12} md={6} key={i}>
            <Card>
              <Statistic title={s.title} value={s.value} prefix={s.prefix || s.icon} suffix={<RiseOutlined className="text-secondary text-sm" />} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Recent Orders" className="mb-6">
        <Table dataSource={recentOrders} columns={columns} pagination={false} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
