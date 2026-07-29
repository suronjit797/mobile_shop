import CustomTable from "@/components/CustomTable";
import MainLayout from "@/components/layout/MainLayout";
import { useQueryParams } from "@/hooks/useQueryParams";
import { IOrder } from "@/interfaces/order.interface";
import { IProduct } from "@/interfaces/product.interface";
import { globalModalProps } from "@/lib/utils";
import { useGetAllOrderQuery, useUpdateOrderMutation } from "@/redux/api/orderApi";
import { useAppSelector } from "@/redux/store";
import { App, Button, Card, Empty, Image, Spin, TableProps, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });
  const { modal, notification } = App.useApp();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // rtk query
  const { data, isFetching } = useGetAllOrderQuery(
    { ...getNonEmptyQueryParams, customer: user?._id, populate: "items.product" },
    { skip: !user?._id },
  );
  const [updateOrder] = useUpdateOrderMutation();

  const statusColors: Record<string, string> = {
    pending: "orange",
    processing: "blue",
    shipped: "cyan",
    delivered: "green",
    cancelled: "red",
  };

  const handleCancelOrder = async (id: string) => {
    await modal.confirm({
      ...globalModalProps,
      content: "Are you sure you want to cancel this order?",
      onOk: async () => {
        setCancellingId(id);
        try {
          const res = await updateOrder({ id, body: { status: "cancelled" } }).unwrap();
          if (res?.success) {
            notification.success({ message: "Order cancelled successfully.", duration: 2, showProgress: true });
          }
        } catch (error) {
          notification.error({ message: error?.data?.message || "Failed to cancel order.", duration: 2, showProgress: true });
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  const orders = Array.isArray(data?.data) ? data.data : [];

  const columns: TableProps<IOrder>["columns"] = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (v) => <span className="font-semibold text-primary">{`ODR-${String(v)?.padStart(6, "0")}`}</span>,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (v) => (
        <div className="flex flex-col gap-2">
          {v?.map((item, idx: number) => {
            const product = item?.product;
            return (
              <div key={idx} className="flex items-center gap-3">
                {product?.images?.[0] && (
                  <div className="w-10 h-10 object-cover rounded border overflow-hidden">
                    <Image src={product.images[0]} alt={product?.name || "Product"} width={40} height={40} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{product?.name || "Product"}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item?.quantity} {product?.price ? `× $${product.price.toFixed(2)}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const totalAmount = Array.isArray(record.items)
          ? record.items.reduce((sum: number, item) => {
              const price = (item?.product as IProduct)?.price || 0;
              return sum + price * (item?.quantity || 1);
            }, 0)
          : 0;
        return <span className="font-semibold">${totalAmount?.toFixed(2)}</span>;
      },
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
      render: (v) => dayjs(v).format("DD/MM/YYYY : hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const canCancel = record.status !== "delivered" && record.status !== "cancelled";
        if (!canCancel) return <Text type="secondary">-</Text>;

        return (
          <Button size="small" danger loading={cancellingId === record._id} onClick={() => handleCancelOrder(record._id)}>
            Cancel
          </Button>
        );
      },
    },
  ];

  if (isFetching) {
    return (
      <MainLayout>
        <div className="container-main py-16 flex items-center justify-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="container-main py-16 text-center">
          <Empty description="No orders yet">
            <Button type="primary" onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
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
          <CustomTable
            data={orders.map((d) => ({ ...d, key: d?._id }))}
            columns={columns}
            total={data?.meta?.total || orders.length}
            query={queryParams}
            setQuery={setQueryParams}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
