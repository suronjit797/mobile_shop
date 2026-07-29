import CustomTable from "@/components/CustomTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { IOrder } from "@/interfaces/order.interface";
import { globalModalProps } from "@/lib/utils";
import { useGetAllOrderQuery, useUpdateOrderMutation } from "@/redux/api/orderApi";
import { useAppSelector } from "@/redux/store";
import { App, Card, Image, Select, TableProps, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Title } = Typography;

// Helper to determine allowed status transitions (forward-only + cancellation)
const getAvailableStatusOptions = (currentStatus: IOrder["status"]) => {
  switch (currentStatus) {
    case "pending":
      return [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Cancelled", value: "cancelled" },
      ];
    case "processing":
      return [
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Cancelled", value: "cancelled" },
      ];
    case "shipped":
      return [
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ];
    case "delivered":
      return [{ label: "Delivered", value: "delivered" }];
    case "cancelled":
      return [{ label: "Cancelled", value: "cancelled" }];
    default:
      return [];
  }
};

const AdminOrders = () => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });
  const { user } = useAppSelector((state) => state.auth) || {};
  const { modal, notification } = App.useApp();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // rtk query
  const { data, isFetching } = useGetAllOrderQuery({ ...getNonEmptyQueryParams, populate: "customer items.product" });
  const [updateOrder] = useUpdateOrderMutation();

  const statusColors: Record<string, string> = { pending: "orange", processing: "blue", shipped: "cyan", delivered: "green", cancelled: "red" };

  const handleStatusChange = async (id: string, currentStatus: IOrder["status"], newStatus: IOrder["status"]) => {
    if (currentStatus === newStatus) return;

    const performUpdate = async () => {
      setUpdatingId(id);
      try {
        const res = await updateOrder({ id, body: { status: newStatus } }).unwrap();
        if (res?.success) {
          notification.success({ message: "Order Status Updated Successfully.", duration: 2, showProgress: true });
        }
      } catch (error) {
        notification.error({ message: error?.data?.message || "Order Status Update Failed.", duration: 2, showProgress: true });
      } finally {
        setUpdatingId(null);
      }
    };

    if (newStatus === "cancelled") {
      await modal.confirm({
        ...globalModalProps,
        content: "Are you sure you want to cancel this order?",
        onOk: performUpdate,
      });
      return;
    }

    await performUpdate();
  };

  const columns: TableProps<IOrder>["columns"] = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId", render: (v) => `ODR-${String(v)?.padStart(6, "0")}`, width: 140 },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (v) => (
        <div>
          {v?.map((item, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 h-12 object-cover rounded">
                <Image src={item?.product?.images?.[0]} alt={item?.product?.name} />
              </div>
              <div>
                <p className="font-medium">{item?.product?.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item?.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    { title: "Customer", dataIndex: "customer", key: "customer", render: (v) => v?.name },
    { title: "Customer Email", dataIndex: "customer", key: "customer", render: (v) => v?.email },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (v) => dayjs(v).format("DD/MM/YYYY : hh:mm A") },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      align: "center",
      render: (_, record) => {
        const isFinalState = record.status === "delivered" || record.status === "cancelled";
        const availableOptions = getAvailableStatusOptions(record.status);

        return (
          <Select
            size="small"
            value={record.status}
            disabled={isFinalState || updatingId === record._id}
            loading={updatingId === record._id}
            onChange={(newStatus) => handleStatusChange(record._id, record.status, newStatus)}
            className="w-32"
            options={availableOptions}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Title level={3}>Order Management</Title>
      <Card>
        <CustomTable
          data={Array.isArray(data?.data) ? data?.data?.map((d) => ({ ...d, key: d?._id })) : []}
          columns={columns}
          total={data?.meta?.total || 0}
          query={queryParams}
          setQuery={setQueryParams}
        />
      </Card>
    </div>
  );
};

export default AdminOrders;
