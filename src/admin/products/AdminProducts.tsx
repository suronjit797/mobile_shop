import { Table, Button, Tag, Typography, Space, Card, TableProps, Drawer, App, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { mockProducts } from "../../utils/mockData";
import { IProduct } from "@/interfaces/product.interface";
import CustomTable from "@/components/CustomTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDeleteProductMutation, useGetAllProductQuery } from "@/redux/api/productApi";
import { IFormDrawerState } from "@/interfaces/globalInterface";
import { useState } from "react";
import { globalModalProps } from "@/lib/utils";
import AdminProductForm from "./AdminProductForm";

const { Title } = Typography;

const AdminProducts = () => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });
  const { modal, notification } = App.useApp();

  // rkt query
  const { data, isFetching } = useGetAllProductQuery({ ...getNonEmptyQueryParams, populate: "category seller" });
  const [remove, { isLoading: removeLoading }] = useDeleteProductMutation();

  // state
  const [formDrawer, setFromDrawer] = useState<IFormDrawerState<IProduct>>({
    open: false,
    mode: undefined,
    data: undefined,
  });

  const deleteHandler = async (id: string) => {
    await modal.confirm({
      ...globalModalProps,
      content: "This will delete the product from system.",
      onOk: async () => {
        try {
          const res = await remove(id).unwrap();
          if (res?.success) {
            notification.success({ message: "Product Deleted Successfully .", duration: 2, showProgress: true });
          }
        } catch (error) {
          notification.error({ message: error?.data?.message || "Product Deletion Failed.", duration: 2, showProgress: true });
        }
      },
    });
  };
  const columns: TableProps<IProduct>["columns"] = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 object-cover rounded">
            <Image src={record.images[0]} alt={record.name} />
          </div>
          <div>
            <p className="font-medium">{record.name}</p>
            <p className="text-xs text-muted-foreground">{record.brand}</p>
          </div>
        </div>
      ),
    },
    { title: "Seller", dataIndex: "seller", key: "seller", render: (v) => v?.name },
    { title: "Category", dataIndex: "category", key: "category", align: "center", render: (v) => v?.name },
    { title: "Price", dataIndex: "price", key: "price", align: "center", render: (v: number) => `$${v.toFixed(2)}` },
    { title: "Stock", dataIndex: "stock", key: "stock", align: "center", render: (v: number) => <Tag color={v > 0 ? "green" : "red"}>{v}</Tag> },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              setFromDrawer({
                open: true,
                mode: "update",
                data: {
                  ...record,
                  category: typeof record?.category === "string" ? record?.category : record?.category?._id,
                  seller: typeof record?.seller === "string" ? record?.seller : record?.seller?._id,
                },
              })
            }
          >
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteHandler(record?._id)} loading={removeLoading}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3} className="!mb-0">
          Product Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFromDrawer((pre) => ({ ...pre, open: true, mode: "create" }))}>
          Add Product
        </Button>
      </div>
      <Card>
        <CustomTable
          data={Array.isArray(data?.data) ? data?.data?.map((d) => ({ ...d, key: d?._id })) : []}
          columns={columns}
          total={data?.meta?.total || 0}
          query={queryParams}
          setQuery={setQueryParams}
        />
      </Card>

      {/* form */}
      <Drawer
        title={formDrawer.mode === "create" ? "Add Product" : "Update Product"}
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setFromDrawer({ open: false, mode: undefined, data: undefined })}
        open={formDrawer.open}
      >
        <AdminProductForm {...{ formDrawer, setFromDrawer }} />
      </Drawer>
    </div>
  );
};

export default AdminProducts;
