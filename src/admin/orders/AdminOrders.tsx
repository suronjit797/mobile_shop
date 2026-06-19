import CustomTable from "@/components/CustomTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { IOrder } from "@/interfaces/order.interface";
import { IUser } from "@/interfaces/userInterface";
import { useGetAllOrderQuery } from "@/redux/api/orderApi";
import { Table, Tag, Typography, Card, TableProps, Image } from "antd";

const { Title } = Typography;

const AdminOrders = () => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });

  // rtk query
  const { data, isFetching } = useGetAllOrderQuery({ ...getNonEmptyQueryParams, populate: "customer items.product" });
  const statusColors: Record<string, string> = { pending: "orange", processing: "blue", shipped: "cyan", delivered: "green", cancelled: "red" };

  const columns: TableProps<IOrder>["columns"] = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId", render: (v) => `ODR-${String(v)?.padStart(6, "0")}`, width: 200 },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (v) => (
        <div>
          {v?.map((item) => (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 object-cover rounded">
                <Image src={item?.product?.images[0]} alt={item?.product?.name} />
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

    // { title: "Total", dataIndex: "total", key: "total", render: (v: number) => `$${v.toFixed(2)}` },
    // { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    // { title: "Date", dataIndex: "date", key: "date" },
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
