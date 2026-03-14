import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, Table, Typography, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';

const { Title } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container-main py-16 text-center">
          <Empty description="Your cart is empty" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" onClick={() => navigate('/products')}>Continue Shopping</Button>
          </Empty>
        </div>
      </MainLayout>
    );
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <img src={record.product.images[0]} alt={record.product.name} className="w-16 h-16 object-cover rounded-lg" />
          <div>
            <p className="font-medium cursor-pointer hover:text-primary" onClick={() => navigate(`/products/${record.product.id}`)}>
              {record.product.name}
            </p>
            <p className="text-sm text-muted-foreground">{record.product.brand}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: any, record: any) => <span className="font-semibold">${record.product.price.toFixed(2)}</span>,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_: any, record: any) => (
        <InputNumber min={1} max={record.product.stock} value={record.quantity}
          onChange={(v) => dispatch(updateQuantity({ productId: record.product.id, quantity: v || 1 }))} />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: any) => <span className="font-bold">${(record.product.price * record.quantity).toFixed(2)}</span>,
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => { dispatch(removeFromCart(record.product.id)); message.success('Removed from cart'); }} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Title level={2}>Shopping Cart ({itemCount} items)</Title>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Table dataSource={items} columns={columns} rowKey={(r) => r.product.id} pagination={false} />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
              <Button danger onClick={() => { dispatch(clearCart()); message.success('Cart cleared'); }}>Clear Cart</Button>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
            <Title level={4}>Order Summary</Title>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{total > 50 ? 'Free' : '$5.99'}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span>${(total > 50 ? total : total + 5.99).toFixed(2)}</span>
              </div>
            </div>
            <Button type="primary" block size="large" icon={<ShoppingOutlined />} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
