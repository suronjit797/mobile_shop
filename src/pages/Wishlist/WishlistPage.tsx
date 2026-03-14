import { useNavigate } from 'react-router-dom';
import { Button, Empty, Table, message } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { Typography } from 'antd';

const { Title } = Typography;

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container-main py-16 text-center">
          <Empty description="Your wishlist is empty">
            <Button type="primary" onClick={() => navigate('/products')}>Browse Products</Button>
          </Empty>
        </div>
      </MainLayout>
    );
  }

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <img src={record.product.images[0]} alt={record.product.name} className="w-16 h-16 object-cover rounded-lg" />
          <div>
            <p className="font-medium cursor-pointer hover:text-primary" onClick={() => navigate(`/products/${record.product.id}`)}>{record.product.name}</p>
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
      title: 'Stock',
      key: 'stock',
      render: (_: any, record: any) => (
        <span className={record.product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
          {record.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button type="primary" size="small" icon={<ShoppingCartOutlined />}
            onClick={() => { dispatch(addToCart(record.product)); dispatch(removeFromWishlist(record.product.id)); message.success('Moved to cart'); }}
            disabled={record.product.stock === 0}>
            Move to Cart
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />}
            onClick={() => { dispatch(removeFromWishlist(record.product.id)); message.success('Removed from wishlist'); }} />
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Title level={2}>My Wishlist ({items.length} items)</Title>
        <Table dataSource={items} columns={columns} rowKey={(r) => r.product.id} pagination={false} />
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
