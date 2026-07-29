import { IOrder } from "@/interfaces/order.interface";
import { IProduct } from "@/interfaces/product.interface";
import { useGetAllOrderQuery } from "@/redux/api/orderApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useAppSelector } from "@/redux/store";
import {
  DollarOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
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

const SellerDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  // rtk query
  const { data: productsData, isFetching: isProductsLoading } = useGetAllProductQuery(
    { seller: user?._id, limit: 100 },
    { skip: !user?._id },
  );
  const { data: ordersData, isFetching: isOrdersLoading } = useGetAllOrderQuery({
    populate: "customer items.product",
    limit: 100,
  });

  const sellerProducts: IProduct[] = Array.isArray(productsData?.data) ? productsData.data : [];
  const allOrders: IOrder[] = Array.isArray(ordersData?.data) ? ordersData.data : [];

  const isSellerProduct = (product: string | IProduct): boolean => {
    if (typeof product === "object" && product !== null) {
      const sellerId = typeof product.seller === "object" ? product.seller?._id : product.seller;
      return sellerId === user?._id;
    }
    return false;
  };

  const sellerOrders = allOrders.filter((order) =>
    Array.isArray(order.items) && order.items.some((item) => isSellerProduct(item.product)),
  );

  const calculateSellerOrderTotal = (order: IOrder): number => {
    if (!Array.isArray(order.items)) return 0;
    return order.items.reduce((sum, item) => {
      if (isSellerProduct(item.product)) {
        const product = typeof item.product === "object" ? item.product : null;
        const price = product?.price || 0;
        return sum + price * (item.quantity || 1);
      }
      return sum;
    }, 0);
  };

  const sellerRevenue = sellerOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + calculateSellerOrderTotal(order), 0);

  const lowStockCount = sellerProducts.filter((product) => product.stock <= 5).length;

  const stats = [
    { title: "Revenue", value: `$${sellerRevenue.toFixed(2)}`, icon: <DollarOutlined /> },
    { title: "Products", value: sellerProducts.length, icon: <ShoppingOutlined /> },
    { title: "Orders", value: sellerOrders.length, icon: <ShoppingCartOutlined /> },
    { title: "Low Stock", value: lowStockCount, icon: <InboxOutlined /> },
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
      render: (_, record) => `$${calculateSellerOrderTotal(record).toFixed(2)}`,
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

  const isLoading = isProductsLoading || isOrdersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Seller Dashboard</Title>
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((s, i) => (
          <Col xs={12} md={6} key={i}>
            <Card>
              <Statistic title={s.title} value={s.value} prefix={s.icon} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Recent Orders">
        <Table
          dataSource={sellerOrders.slice(0, 5).map((o) => ({ ...o, key: o._id }))}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default SellerDashboard;

