import React, { useEffect } from "react";
import { Drawer, Form, Input, Button, Space, message } from "antd";
import { ICategory } from "@/interfaces/category.interface";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { IFormDrawerState } from "@/interfaces/globalInterface";


interface Props {
  formDrawer?: IFormDrawerState<ICategory>;
  setFromDrawer?: React.Dispatch<React.SetStateAction<IFormDrawerState<ICategory>>>;
}

const AdminCategoryForm: React.FC<Props> = ({ formDrawer, setFromDrawer }) => {
  const { data } = formDrawer || {};
  const [form] = Form.useForm();

  //   rkt query
  const [update, { isLoading: updateLoading }] = useUpdateCategoryMutation();
  const [create, { isLoading: createLoading }] = useCreateCategoryMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);

  // Automatically generate slug from the category name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    const generatedSlug = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    form.setFieldValue("slug", generatedSlug);
  };

  const handleFinish = async (values: Partial<ICategory>) => {
    try {
      if (formDrawer?.mode === "update" && data?._id) {
        await update({ id: data._id, body: values }).unwrap();
        message.success("Category updated successfully");
      } else {
        await create(values).unwrap();
        message.success("Category created successfully");
      }
      setFromDrawer({ open: false, mode: undefined, data: undefined });
    } catch (error) {
      console.error("Error in category form submission:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="space-y-4"
    >
      {/* Name Field */}
      <Form.Item
        name="name"
        label={<span className="text-sm font-medium text-gray-700">Category Name</span>}
        rules={[{ required: true, message: "Please enter category name" }]}
      >
        <Input
          placeholder="e.g., Electronics"
          onChange={handleNameChange}
          className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500"
        />
      </Form.Item>

      {/* Slug Field */}
      <Form.Item
        name="slug"
        label={<span className="text-sm font-medium text-gray-700">Slug URL</span>}
        rules={[{ required: true, message: "Please enter or generate a slug" }]}
      >
        <Input
          placeholder="e.g., electronics"
          className="rounded-md border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
          readOnly // Usually best to leave slug auto-generated to keep URLs clean
        />
      </Form.Item>

      {/* Image Link Field */}
      <Form.Item
        name="image"
        label={<span className="text-sm font-medium text-gray-700">Image URL</span>}
        rules={[
          { required: true, message: "Please provide an image link" },
          { type: "url", message: "Please enter a valid image URL" },
        ]}
      >
        <Input placeholder="https://example.com/image.png" className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500" />
      </Form.Item>

      <div className="flex">
        <Button type="primary" htmlType="submit" loading={updateLoading || createLoading}>
          {formDrawer?.mode === "update" ? "Update" : "Create"}
        </Button>
        <Button className="ml-2" onClick={() => setFromDrawer?.({ open: false, mode: undefined, data: undefined })}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AdminCategoryForm;
