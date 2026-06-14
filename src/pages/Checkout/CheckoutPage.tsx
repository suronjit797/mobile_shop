import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  Steps,
  Typography,
  Card,
  message,
  Result,
} from "antd";
import MainLayout from "../../components/layout/MainLayout";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { clearCart } from "../../features/cart/cartSlice";
import { PAYMENT_METHODS } from "../../constants";

const { Title } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const handlePlaceOrder = () => {
    form.validateFields().then(() => {
      dispatch(clearCart());
      setOrderPlaced(true);
      message.success("Order placed successfully!");
    });
  };

  const steps = [
    {
      title: "Shipping",
      content: (
        <Form form={form} layout="vertical" className="max-w-lg">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="street"
            label="Street Address"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Payment",
      content: (
        <div className="max-w-lg">
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="flex flex-col gap-3"
          >
            {PAYMENT_METHODS.map((m) => (
              <Radio.Button
                key={m.value}
                value={m.value}
                className="h-12 flex items-center px-4"
              >
                {m.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div>
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between py-3 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
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
        <Steps
          current={currentStep}
          items={steps.map((s) => ({ title: s.title }))}
          className="mb-8"
        />
        <Card className="mb-6">{steps[currentStep].content}</Card>
        <div className="flex justify-between">
          <Button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={() => setCurrentStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
