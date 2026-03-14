import { Table, Button, Tag, Typography, Card, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { mockProducts } from '../../utils/mockData';

const { Title } = Typography;

const SellerProducts = () => {
  const sellerProducts = mockProducts.slice(0, 4); // Mock: show first 4 as seller's products

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <img src={r.images[0]} alt={r.name} className="w-12 h-12 object-cover rounded" />
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (v: number) => <Tag color={v > 10 ? 'green' : v > 0 ? 'orange' : 'red'}>{v}</Tag> },
    { title: 'Actions', key: 'actions', render: () => <Space><Button size="small" icon={<EditOutlined />}>Edit</Button><Button size="small" danger icon={<DeleteOutlined />}>Delete</Button></Space> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3} className="!mb-0">My Products</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
      </div>
      <Card><Table dataSource={sellerProducts} columns={columns} rowKey="id" /></Card>
    </div>
  );
};

export default SellerProducts;
