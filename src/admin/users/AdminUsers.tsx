import { Table, Tag, Typography, Card, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminUsers = () => {
  const users = [
    { key: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'active' },
    { key: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'SELLER', status: 'active' },
    { key: '3', name: 'Bob Admin', email: 'bob@example.com', role: 'ADMIN', status: 'active' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color={r === 'ADMIN' ? 'red' : r === 'SELLER' ? 'blue' : 'green'}>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Actions', key: 'actions', render: () => <Space><Button size="small" icon={<EditOutlined />}>Edit</Button><Button size="small" danger icon={<DeleteOutlined />}>Delete</Button></Space> },
  ];

  return (
    <div>
      <Title level={3}>User Management</Title>
      <Card><Table dataSource={users} columns={columns} rowKey="key" /></Card>
    </div>
  );
};

export default AdminUsers;
