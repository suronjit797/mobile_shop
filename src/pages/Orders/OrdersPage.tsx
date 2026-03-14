import { Typography, Table, Tag, Card, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const { Title } = Typography;

const OrdersPage = () => {
  const navigate = useNavigate();
  // Mock orders - replace with RTK Query
  const orders = [
    { key: '1', id: 'ORD-001', items: 3, total: 249.99, status: 'delivered', date: '2026-03-10' },
    { key: '2', id: 'ORD-002', items: 1, total: 89.99, status: 'shipped', date: '2026-03-12' },
  ];

  const statusColors: Record<string, string> = { pending: 'orange', processing: 'blue', shipped: 'cyan', delivered: 'green', cancelled: 'red' };

  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="container-main py-16 text-center">
          <Empty description="No orders yet">
            <Button type="primary" onClick={() => navigate('/products')}>Start Shopping</Button>
          </Empty>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Title level={2}>My Orders</Title>
        <Card>
          <Table dataSource={orders} columns={[
            { title: 'Order ID', dataIndex: 'id', key: 'id' },
            { title: 'Items', dataIndex: 'items', key: 'items' },
            { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
            { title: 'Date', dataIndex: 'date', key: 'date' },
          ]} rowKey="key" />
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
