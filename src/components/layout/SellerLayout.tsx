import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { APP_NAME } from '../../constants';

const { Sider, Content, Header } = Layout;

const SellerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/seller', icon: <DashboardOutlined />, label: <Link to="/seller">Dashboard</Link> },
    { key: '/seller/products', icon: <ShoppingOutlined />, label: <Link to="/seller/products">Products</Link> },
    { key: '/seller/orders', icon: <OrderedListOutlined />, label: <Link to="/seller/orders">Orders</Link> },
    { key: '/seller/inventory', icon: <InboxOutlined />, label: <Link to="/seller/inventory">Inventory</Link> },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="!bg-card" breakpoint="lg">
        <div className="h-16 flex items-center justify-center border-b border-border">
          <span className="text-primary font-bold text-lg">
            {collapsed ? 'SV' : `${APP_NAME} Seller`}
          </span>
        </div>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} className="border-none" />
      </Sider>
      <Layout>
        <Header className="bg-card px-6 flex items-center justify-between shadow-sm h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeftOutlined /> Back to Store
          </button>
          <span className="text-muted-foreground text-sm">Seller Panel</span>
        </Header>
        <Content className="p-6 bg-background">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerLayout;
