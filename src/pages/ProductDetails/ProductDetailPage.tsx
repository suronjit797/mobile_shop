import { useParams, useNavigate } from 'react-router-dom';
import { Button, Rate, Tag, InputNumber, Tabs, Typography, Breadcrumb, Row, Col, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { mockProducts } from '../../utils/mockData';

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.id === id);
  if (!product) return <MainLayout><div className="container-main py-16 text-center"><Title level={3}>Product not found</Title></div></MainLayout>;

  const isWishlisted = wishlistItems.some((i) => i.product.id === product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
    message.success(`Added ${quantity} item(s) to cart`);
  };

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Breadcrumb className="mb-6" items={[
          { title: <a onClick={() => navigate('/')}>Home</a> },
          { title: <a onClick={() => navigate('/products')}>Products</a> },
          { title: product.name },
        ]} />
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div className="rounded-xl overflow-hidden bg-muted">
              <img src={product.images[0]} alt={product.name} className="w-full h-[500px] object-cover" />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</span>
              <Title level={2} className="!mb-0">{product.name}</Title>
              <div className="flex items-center gap-2">
                <Rate disabled defaultValue={product.rating} allowHalf />
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                    <Tag color="red">-{discount}%</Tag>
                  </>
                )}
              </div>
              <Tag color={product.stock > 0 ? 'green' : 'red'}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </Tag>
              <Paragraph className="text-muted-foreground">{product.description}</Paragraph>
              <div className="flex items-center gap-4">
                <InputNumber min={1} max={product.stock} value={quantity} onChange={(v) => setQuantity(v || 1)} size="large" />
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} disabled={product.stock === 0}>
                  Add to Cart
                </Button>
                <Button size="large" icon={isWishlisted ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={() => isWishlisted ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product))}>
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm text-muted-foreground">Category: <span className="text-foreground">{product.category}</span></p>
              </div>
            </div>
          </Col>
        </Row>
        <Tabs className="mt-12" items={[
          { key: 'desc', label: 'Description', children: <Paragraph>{product.description}</Paragraph> },
          { key: 'reviews', label: 'Reviews', children: <Paragraph className="text-muted-foreground">Reviews will be loaded from the API.</Paragraph> },
        ]} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
