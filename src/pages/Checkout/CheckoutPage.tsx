import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Radio, Steps, Typography, Card, message, Result, Image } from "antd";
import MainLayout from "../../components/layout/MainLayout";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { clearCart } from "../../features/cart/cartSlice";
import { PAYMENT_METHODS } from "../../constants";
import { _ } from "vitest/dist/chunks/reporters.d.BuRON0I0.js";
import { ICustomerOrderInfo, IOrder } from "@/interfaces/order.interface";
import { useCreateOrderMutation } from "@/redux/api/orderApi";

const { Title } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState<ICustomerOrderInfo>();

  // rkt query
  const [create, { isLoading: createLoading }] = useCreateOrderMutation();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = total > 50 ? 0 : 5.99;

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  if (orderPlaced) {
    return (
      <MainLayout>
        <div className="container-main py-16">
          <Result
            status="success"
            title="Order Placed Successfully!"
            subTitle="Your order has been placed. You'll receive a confirmation email shortly."
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>,
              <Button key="orders" onClick={() => navigate("/orders")}>
                View Orders
              </Button>,
            ]}
          />
        </div>
      </MainLayout>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      await form.validateFields();

      console.log({ formData, items });
      if (!Array.isArray(items) || items.length === 0) return message.error("Your cart is empty");
      const bodyItems = items.map((i) => ({ product: typeof i.product === "string" ? i.product : i.product._id, quantity: i.quantity }));

      const body = {
        items: bodyItems,
        customer: user?._id,
        customerOrderInfo: formData,
        status: "pending",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await create(body as any).unwrap();

      message.success(`Order placed successfully!`);
      dispatch(clearCart());
      navigate("/");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleNextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(["name", "street", "city", "state", "zipCode", "country", "phone"]);
      }
      if (currentStep === 1) {
        await form.validateFields(["paymentMethod"]);
      }
      setCurrentStep((s) => s + 1);
    } catch (error) {
      console.log("Please complete the required fields");
    }
  };

  const steps = [
    {
      title: "Shipping",
      content: (
        <div className="max-w-lg">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="street" label="Street Address" rules={[{ required: true, message: "Please enter your street address" }]}>
            <Input size="large" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="city" label="City" rules={[{ required: true, message: "Required" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true, message: "Required" }]}>
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="zipCode" label="Zip Code" rules={[{ required: true, message: "Required" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true, message: "Required" }]}>
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
            <Input size="large" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Payment",
      content: (
        <div className="max-w-lg">
          <Form.Item name="paymentMethod" label="Select Payment Method" rules={[{ required: true }]}>
            <Radio.Group className="flex flex-col gap-3 w-full">
              {PAYMENT_METHODS.map((m) => (
                <Radio.Button key={m.value} value={m.value} className="h-12 flex items-center px-4">
                  {m.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div>
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 object-cover rounded">
                  <Image src={item.product.images[0]} alt={item.product.name} />
                </div>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
              <span>Total</span>
              <span>${(total + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="container-main py-8 max-w-3xl mx-auto">
        <Title level={2}>Checkout</Title>
        <Steps current={currentStep} items={steps.map((s) => ({ title: s.title }))} className="mb-8" />

        <Form
          form={form}
          layout="vertical"
          name="checkoutForm"
          preserve={true}
          onFinish={handlePlaceOrder}
          onValuesChange={(_, values) => setFormData((pre) => ({ ...pre, ...values }))}
        >
          <Card className="mb-6">{steps[currentStep].content}</Card>

          <div className="flex justify-between">
            <Button disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Place Order
              </Button>
            )}
          </div>
        </Form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
