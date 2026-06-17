import CustomTable from "@/components/CustomTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { IFormDrawerState } from "@/interfaces/globalInterface";
import { IUser, UserRole, UserRoleFormat } from "@/interfaces/userInterface";
import { globalModalProps } from "@/lib/utils";
import { useDeleteUserMutation, useGetAllUserQuery } from "@/redux/api/usersApi";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Drawer, Space, TableProps, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import AdminUserForm from "./AdminUserForm";

const { Title } = Typography;

interface Props {
  role: UserRole;
}

const AdminUsers: React.FC<Props> = ({ role }) => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10 });
  const { modal, notification } = App.useApp();

  // rkt query
  const { data, isFetching } = useGetAllUserQuery({ ...getNonEmptyQueryParams, role });
  const [remove, { isLoading: removeLoading }] = useDeleteUserMutation();

  // state
  const [formDrawer, setFromDrawer] = useState<IFormDrawerState<IUser>>({
    open: false,
    mode: undefined,
    data: { role },
  });

  useEffect(() => {
    if (role) {
      setFromDrawer((pre) => ({ ...pre, data: { role } }));
    }
  }, [role]);

  const deleteHandler = async (id: string) => {
    await modal.confirm({
      ...globalModalProps,
      content: "This will delete the user from system.",
      onOk: async () => {
        try {
          const res = await remove(id).unwrap();
          if (res?.success) {
            notification.success({ message: "User Deleted Successfully .", duration: 2, showProgress: true });
          }
        } catch (error) {
          notification.error({ message: error?.data?.message || "User Deletion Failed.", duration: 2, showProgress: true });
        }
      },
    });
  };

  const columns: TableProps<IUser>["columns"] = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (r: string) => <Tag color={r === UserRole.ADMIN ? "red" : r === UserRole.SELLER ? "blue" : "green"}>{UserRoleFormat[r]}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (s: boolean) => <Tag color={s ? "green" : "red"}>{s ? "Active" : "Inactive"}</Tag>,
    },
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
        <Title level={3} className="!mb-0 capitalize">
          {UserRoleFormat[role]} Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFromDrawer((pre) => ({ ...pre, open: true, mode: "create" }))}>
          Add {UserRoleFormat[role]}
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
        title={formDrawer.mode === "create" ? "Add User" : "Update User"}
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setFromDrawer({ open: false, mode: undefined, data: { role } })}
        open={formDrawer.open}
      >
        <AdminUserForm {...{ formDrawer, setFromDrawer }} />
      </Drawer>
    </div>
  );
};

export default AdminUsers;
