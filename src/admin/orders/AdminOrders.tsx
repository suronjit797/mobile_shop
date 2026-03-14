import { Table, Tag, Typography, Card } from 'antd';

const { Title } = Typography;

const AdminOrders = () => {
  const orders = [
    { key: '1', id: 'ORD-001', customer: 'John Doe', items: 3, total: 249.99, status: 'delivered', date: '2026-03-10' },
    { key: '2', id: 'ORD-002', customer: 'Jane Smith', items: 1, total: 89.99, status: 'shipped', date: '2026-03-12' },
    { key: '3', id: 'ORD-003', customer: 'Bob Johnson', items: 5, total: 549.99, status: 'processing', date: '2026-03-13' },
  ];

  const statusColors: Record<string, string> = { pending: 'orange', processing: 'blue', shipped: 'cyan', delivered: 'green', cancelled: 'red' };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div>
      <Title level={3}>Order Management</Title>
      <Card><Table dataSource={orders} columns={columns} rowKey="id" /></Card>
    </div>
  );
};

export default AdminOrders;
