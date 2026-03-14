import { Table, Tag, Typography, Card } from 'antd';

const { Title } = Typography;

const SellerOrders = () => {
  const orders = [
    { key: '1', id: 'ORD-101', customer: 'John Doe', product: 'Wireless Headphones', qty: 2, total: 499.98, status: 'processing' },
    { key: '2', id: 'ORD-102', customer: 'Jane Smith', product: 'Desk Lamp', qty: 1, total: 79.99, status: 'delivered' },
  ];

  const statusColors: Record<string, string> = { pending: 'orange', processing: 'blue', shipped: 'cyan', delivered: 'green' };

  return (
    <div>
      <Title level={3}>Orders Received</Title>
      <Card>
        <Table dataSource={orders} columns={[
          { title: 'Order ID', dataIndex: 'id', key: 'id' },
          { title: 'Customer', dataIndex: 'customer', key: 'customer' },
          { title: 'Product', dataIndex: 'product', key: 'product' },
          { title: 'Qty', dataIndex: 'qty', key: 'qty' },
          { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
        ]} rowKey="key" />
      </Card>
    </div>
  );
};

export default SellerOrders;
