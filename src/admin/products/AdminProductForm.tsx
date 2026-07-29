import { IFormDrawerState } from "@/interfaces/globalInterface";
import { IProduct } from "@/interfaces/product.interface";
import { UserRole } from "@/interfaces/userInterface";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApi";
import { useCreateProductMutation, useGetAllProductQuery, useUpdateProductMutation } from "@/redux/api/productApi";
import { useGetAllUserQuery } from "@/redux/api/usersApi";
import { useAppSelector } from "@/redux/store";
import { Button, Form, Input, InputNumber, message, Select, Switch } from "antd";
import React, { useEffect } from "react";

interface Props {
  formDrawer?: IFormDrawerState<IProduct>;
  setFromDrawer?: React.Dispatch<React.SetStateAction<IFormDrawerState<IProduct>>>;
}

const AdminProductForm: React.FC<Props> = ({ formDrawer, setFromDrawer }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data } = formDrawer || {};
  const [form] = Form.useForm();

  //   rkt query
  const [update, { isLoading: updateLoading }] = useUpdateProductMutation();
  const [create, { isLoading: createLoading }] = useCreateProductMutation();
  const { data: categories, isFetching: categoryFetching } = useGetAllCategoryQuery({ page: 1, limit: 500 });
  const { data: sellers, isFetching: sellersFetching } = useGetAllUserQuery({ role: "seller", page: 1, limit: 1000 });

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleFinish = async (values: Partial<IProduct>) => {
    const body = { ...values };
    if (!body.seller) body.seller = user?._id;
    try {
      if (formDrawer?.mode === "update" && data?._id) {
        await update({ id: data._id, body }).unwrap();
        message.success("Product updated successfully");
      } else {
        await create(body).unwrap();
        message.success("Product created successfully");
      }
      setFromDrawer({ open: false, mode: undefined, data: undefined });
    } catch (error) {
      console.error("Error in product form submission:", error);
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
        price: 0,
        stock: 0,
        rating: 0,
        reviewCount: 0,
        tags: [],
        images: [],
      }}
    >
      {/* Product Name Field */}
      <Form.Item
        name="name"
        label={<span className="text-sm font-medium text-gray-700">Product Name</span>}
        rules={[{ required: true, message: "Please enter the product name" }]}
      >
        <Input placeholder="e.g., Wireless Headphones" className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500" />
      </Form.Item>

      {/* Description Field */}
      <Form.Item
        name="description"
        label={<span className="text-sm font-medium text-gray-700">Description</span>}
        rules={[{ required: true, message: "Please enter a product description" }]}
      >
        <Input.TextArea
          placeholder="Enter detailed product description..."
          rows={4}
          className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500"
        />
      </Form.Item>

      <Form.Item
        name="price"
        label={<span className="text-sm font-medium text-gray-700">Sale Price</span>}
        rules={[{ required: true, message: "Please enter the price" }]}
      >
        <InputNumber min={0} precision={2} placeholder="0.00" className="w-full rounded-md border-gray-300" />
      </Form.Item>

      <Form.Item name="originalPrice" label={<span className="text-sm font-medium text-gray-700">Original Price (Optional)</span>}>
        <InputNumber min={0} precision={2} placeholder="0.00" className="w-full rounded-md border-gray-300" />
      </Form.Item>

      {/* Stock & Brand Row */}
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="stock"
          label={<span className="text-sm font-medium text-gray-700">Stock Quantity</span>}
          rules={[{ required: true, message: "Please enter stock quantity" }]}
        >
          <InputNumber min={0} precision={0} placeholder="e.g., 50" className="w-full rounded-md border-gray-300" />
        </Form.Item>

        <Form.Item
          name="brand"
          label={<span className="text-sm font-medium text-gray-700">Brand</span>}
          rules={[{ required: true, message: "Please enter the brand name" }]}
        >
          <Input placeholder="e.g., Sony" className="rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500" />
        </Form.Item>
      </div>

      {/* Category Selection */}
      <Form.Item
        name="category"
        label={<span className="text-sm font-medium text-gray-700">Category</span>}
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          placeholder="Select product category"
          className="w-full h-9"
          loading={categoryFetching}
          options={Array.isArray(categories?.data) ? categories?.data?.map((cat) => ({ value: cat._id, label: cat.name })) : []}
        />
      </Form.Item>

      {/* Tags Field (Allows typing custom tags) */}
      <Form.Item name="tags" label={<span className="text-sm font-medium text-gray-700">Tags</span>}>
        <Select mode="tags" placeholder="Type a tag and press Enter" className="w-full" tokenSeparators={[","]} />
      </Form.Item>

      {[UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user?.role) ? (
        <Form.Item
          name="seller"
          label={<span className="text-sm font-medium text-gray-700">Seller / Vendor</span>}
          rules={[{ required: true, message: "Please select a seller" }]}
        >
          <Select
            placeholder="Select seller"
            className="w-full h-9"
            // disabled={isUpdateMode}
            loading={sellersFetching}
            options={Array.isArray(sellers?.data) ? sellers?.data?.map((sel) => ({ value: sel._id, label: sel.name })) : []}
          />
        </Form.Item>
      ) : (
        ""
      )}

      <Form.Item
        name="images"
        label={<span className="text-sm font-medium text-gray-700">Product Images</span>}
        rules={[{ required: true, message: "Please provide at least one image" }]}
      >
        <Select mode="tags" placeholder="Paste image URLs and press Enter" className="w-full" />
      </Form.Item>

      {isUpdateMode && (
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
          <Form.Item name="rating" label={<span className="text-xs font-medium text-gray-500">Rating</span>}>
            {/* <InputNumber disabled className="w-full bg-gray-100" /> */}
            <InputNumber className="w-full bg-gray-100" />
          </Form.Item>
          <Form.Item name="reviewCount" label={<span className="text-xs font-medium text-gray-500">Review Count</span>}>
            {/* <InputNumber disabled className="w-full bg-gray-100" /> */}
            <InputNumber className="w-full bg-gray-100" />
          </Form.Item>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex pt-4 border-t border-gray-100">
        <Button
          type="primary"
          htmlType="submit"
          loading={updateLoading || createLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          {isUpdateMode ? "Update Product" : "Create Product"}
        </Button>
        <Button className="ml-2 hover:border-gray-400" onClick={() => setFromDrawer?.({ open: false, mode: undefined, data: undefined })}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AdminProductForm;
