import { IOrder } from "@/interfaces/order.interface";
import { useGetAllOrderQuery } from "@/redux/api/orderApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useGetAllUserQuery } from "@/redux/api/usersApi";
import {
  DollarOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Table, TableProps, Tag, Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const statusColors: Record<string, string> = {
  pending: "orange",
  processing: "blue",
  shipped: "cyan",
  delivered: "green",
  cancelled: "red",
};

const calculateOrderTotal = (order: IOrder): number => {
  if (!Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => {
    const product = typeof item.product === "object" ? item.product : null;
    const price = product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
};

const AdminDashboard = () => {
  // rtk query
  const { data: ordersData, isFetching: isOrdersLoading } = useGetAllOrderQuery({
    populate: "customer items.product",
    limit: 100,
  });
  const { data: productsData, isFetching: isProductsLoading } = useGetAllProductQuery({ limit: 1 });
  const { data: usersData, isFetching: isUsersLoading } = useGetAllUserQuery({ limit: 1 });

  const orders: IOrder[] = Array.isArray(ordersData?.data) ? ordersData.data : [];

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + calculateOrderTotal(order), 0);

  const totalOrders = ordersData?.meta?.total || orders.length;
  const totalProducts = productsData?.meta?.total || 0;
  const totalUsers = usersData?.meta?.total || 0;

  const stats = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <DollarOutlined /> },
    { title: "Total Orders", value: totalOrders, icon: <ShoppingCartOutlined /> },
    { title: "Total Products", value: totalProducts, icon: <ShoppingOutlined /> },
    { title: "Total Users", value: totalUsers, icon: <UserOutlined /> },
  ];

  const columns: TableProps<IOrder>["columns"] = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (v: number) => <span className="font-semibold text-primary">{`ODR-${String(v)?.padStart(6, "0")}`}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (c) => (typeof c === "object" && c ? c.name || c.email : "Guest"),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `$${calculateOrderTotal(record).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color={statusColors[s]}>{s?.toUpperCase()}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => dayjs(v).format("DD/MM/YYYY : hh:mm A"),
    },
  ];

  const isLoading = isOrdersLoading || isProductsLoading || isUsersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((s, i) => (
          <Col xs={12} md={6} key={i}>
            <Card>
              <Statistic title={s.title} value={s.value} prefix={s.icon} suffix={<RiseOutlined className="text-secondary text-sm" />} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Recent Orders" className="mb-6">
        <Table
          dataSource={orders.slice(0, 5).map((o) => ({ ...o, key: o._id }))}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;

