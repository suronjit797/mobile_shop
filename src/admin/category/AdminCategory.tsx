import CustomTable from "@/components/CustomTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { ICategory } from "@/interfaces/category.interface";
import { IFormDrawerState } from "@/interfaces/globalInterface";
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from "@/redux/api/categoryApi";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Drawer, Image, Space, TableProps, Typography } from "antd";
import { useState } from "react";
import AdminCategoryForm from "./AdminCategoryForm";
import { globalModalProps } from "@/lib/utils";

const { Title } = Typography;

const AdminCategory = () => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });
  const { modal, notification } = App.useApp();

  // rkt query
  const { data, isFetching } = useGetAllCategoryQuery({ ...getNonEmptyQueryParams });
  const [remove, { isLoading: removeLoading }] = useDeleteCategoryMutation();

  // state
  const [formDrawer, setFromDrawer] = useState<IFormDrawerState<ICategory>>({
    open: false,
    mode: undefined,
    data: undefined,
  });

  const deleteHandler = async (id: string) => {
    await modal.confirm({
      ...globalModalProps,
      content: "This will delete the category from system.",
      onOk: async () => {
        try {
          const res = await remove(id).unwrap();
          if (res?.success) {
            notification.success({ message: "Category Deleted Successfully .", duration: 2, showProgress: true });
          }
        } catch (error) {
          notification.error({ message: error?.data?.message || "Category Deletion Failed.", duration: 2, showProgress: true });
        }
      },
    });
  };

  const columns: TableProps<ICategory>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (v: string) => (
        <div className="max-w-14 max-h-14 object-cover rounded">
          <Image src={v} alt="Category" />
        </div>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setFromDrawer({ open: true, mode: "update", data: record })}>
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteHandler(record._id)} loading={removeLoading}>
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
          {" "}
          Categories Management{" "}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFromDrawer({ open: true, mode: "create" })}>
          Add Category
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
        title={formDrawer.mode === "create" ? "Add Category" : "Update Category"}
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setFromDrawer({ open: false, mode: undefined, data: undefined })}
        open={formDrawer.open}
      >
        <AdminCategoryForm {...{ formDrawer, setFromDrawer }} />
      </Drawer>
    </div>
  );
};

export default AdminCategory;
