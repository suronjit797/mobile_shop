import { Table, Button, Tag, Typography, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { mockProducts } from '../../utils/mockData';

const { Title } = Typography;

const AdminProducts = () => {
  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <img src={record.images[0]} alt={record.name} className="w-12 h-12 object-cover rounded" />
          <div>
            <p className="font-medium">{record.name}</p>
            <p className="text-xs text-muted-foreground">{record.brand}</p>
          </div>
        </div>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (v: number) => <Tag color={v > 0 ? 'green' : 'red'}>{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3} className="!mb-0">Product Management</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
      </div>
      <Card>
        <Table dataSource={mockProducts} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default AdminProducts;
