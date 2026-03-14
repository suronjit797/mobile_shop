import { Card, Row, Col, Statistic, Table, Typography, Tag } from 'antd';
import { DollarOutlined, ShoppingOutlined, ShoppingCartOutlined, InboxOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SellerDashboard = () => {
  const stats = [
    { title: 'Revenue', value: 12450, prefix: '$', icon: <DollarOutlined /> },
    { title: 'Products', value: 45, icon: <ShoppingOutlined /> },
    { title: 'Orders', value: 234, icon: <ShoppingCartOutlined /> },
    { title: 'Low Stock', value: 5, icon: <InboxOutlined /> },
  ];

  const recentOrders = [
    { key: '1', id: 'ORD-101', product: 'Wireless Headphones', qty: 2, total: 499.98, status: 'processing' },
    { key: '2', id: 'ORD-102', product: 'Desk Lamp', qty: 1, total: 79.99, status: 'shipped' },
  ];

  const statusColors: Record<string, string> = { pending: 'orange', processing: 'blue', shipped: 'cyan', delivered: 'green' };

  return (
    <div>
      <Title level={3}>Seller Dashboard</Title>
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((s, i) => (
          <Col xs={12} md={6} key={i}>
            <Card><Statistic title={s.title} value={s.value} prefix={s.prefix || s.icon} /></Card>
          </Col>
        ))}
      </Row>
      <Card title="Recent Orders">
        <Table dataSource={recentOrders} columns={[
          { title: 'Order ID', dataIndex: 'id', key: 'id' },
          { title: 'Product', dataIndex: 'product', key: 'product' },
          { title: 'Qty', dataIndex: 'qty', key: 'qty' },
          { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
        ]} pagination={false} rowKey="key" />
      </Card>
    </div>
  );
};

export default SellerDashboard;
