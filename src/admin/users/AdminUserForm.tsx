import { IFormDrawerState } from "@/interfaces/globalInterface";
import { IUser } from "@/interfaces/userInterface";
import { useCreateUserMutation, useUpdateUserMutation } from "@/redux/api/usersApi";
import { Button, Form, Input, message, Select, Switch } from "antd";
import React, { useEffect } from "react";

interface Props {
  formDrawer?: IFormDrawerState<IUser>;
  setFromDrawer?: React.Dispatch<React.SetStateAction<IFormDrawerState<IUser>>>;
}

const AdminUserForm: React.FC<Props> = ({ formDrawer, setFromDrawer }) => {
  const { data } = formDrawer || {};
  const [form] = Form.useForm();

  //   rkt query
  const [update, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [create, { isLoading: createLoading }] = useCreateUserMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleFinish = async (values: Partial<IUser>) => {
    try {
      if (formDrawer?.mode === "update" && data?._id) {
        await update({ id: data._id, body: values }).unwrap();
        message.success("User updated successfully");
      } else {
        await create(values).unwrap();
        message.success("User created successfully");
      }
      setFromDrawer({ open: false, mode: undefined, data: { role: data?.role } });
    } catch (error) {
      console.error("Error in user form submission:", error);
      message.error("Something went wrong. Please try again.");
    }
  };
  const isUpdateMode = formDrawer?.mode === "update";
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="space-y-4"
      initialValues={{
        isActive: true,
      }}
    >
      {/* Name Field */}
      <Form.Item
        name="name"
        label={<span className="text-sm font-medium text-gray-700">User Name</span>}
        rules={[{ required: true, message: "Please enter user name" }]}
      >
        <Input placeholder="e.g., John Doe" className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500" />
      </Form.Item>

      {/* Email Field */}
      <Form.Item
        name="email"
        label={<span className="text-sm font-medium text-gray-700">Email Address</span>}
        rules={[
          { required: true, message: "Please enter email address" },
          { type: "email", message: "Please enter a valid email address" },
        ]}
      >
        <Input
          placeholder="e.g., john@example.com"
          disabled={isUpdateMode}
          className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
      </Form.Item>

      {!isUpdateMode && (
        <Form.Item
          name="password"
          label={<span className="text-sm font-medium text-gray-700">Password</span>}
          rules={[
            { required: true, message: "Please enter a password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Minimum 6 characters" className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500" />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label={<span className="text-sm font-medium text-gray-700">User Role</span>}
        rules={[{ required: true, message: "Please select a user role" }]}
      >
        <Select
          placeholder="Select a role"
          options={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
            { value: "seller", label: "Seller" },
          ]}
          className="w-full h-9"
        />
      </Form.Item>

      <Form.Item
        name="isActive"
        label={<span className="text-sm font-medium text-gray-700">Account Status</span>}
        valuePropName="checked"
        extra="Toggle whether this user can log into the system"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      {/* Form Actions */}
      <div className="flex pt-4 border-t border-gray-100">
        <Button
          type="primary"
          htmlType="submit"
          loading={updateLoading || createLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          {isUpdateMode ? "Update" : "Create"}
        </Button>
        <Button className="ml-2 hover:border-gray-400" onClick={() => setFromDrawer?.({ open: false, mode: undefined, data: { role: data?.role } })}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AdminUserForm;
