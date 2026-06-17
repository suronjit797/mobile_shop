import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { APP_NAME } from '../../constants';

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link to="/admin/products">Products</Link> },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: <Link to="/admin/categories">Categories</Link> },
    { key: '/admin/orders', icon: <OrderedListOutlined />, label: <Link to="/admin/orders">Orders</Link> },
    { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">Users</Link> },
    { key: '/admin/sellers', icon: <TeamOutlined />, label: <Link to="/admin/sellers">Sellers</Link> },
    // { key: '/admin/analytics', icon: <BarChartOutlined />, label: <Link to="/admin/analytics">Analytics</Link> },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="!bg-card"
        breakpoint="lg"
      >
        <div className="h-16 flex items-center justify-center border-b border-border">
          <span className="text-primary font-bold text-lg">
            {collapsed ? 'SV' : `${APP_NAME} Admin`}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-none"
        />
      </Sider>
      <Layout>
        <Header className="bg-card px-6 flex items-center justify-between shadow-sm h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeftOutlined /> Back to Store
          </button>
          <span className="text-muted-foreground text-sm">Admin Panel</span>
        </Header>
        <Content className="p-6 bg-background">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
