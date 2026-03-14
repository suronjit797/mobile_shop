import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Button, Card, Row, Col, Tag, Input, Typography } from 'antd';
import {
  RightOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { mockProducts, mockCategories } from '../../utils/mockData';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.slice(0, 4);
  const dealProducts = mockProducts.filter((p) => p.originalPrice);

  const features = [
    { icon: <TruckOutlined className="text-3xl text-primary" />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <SafetyCertificateOutlined className="text-3xl text-secondary" />, title: 'Secure Payments', desc: '100% protected' },
    { icon: <CustomerServiceOutlined className="text-3xl text-accent" />, title: '24/7 Support', desc: 'Dedicated support' },
    { icon: <ThunderboltOutlined className="text-3xl text-destructive" />, title: 'Fast Delivery', desc: 'Within 2-3 days' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-16 lg:py-24">
        <div className="container-main">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <Tag color="blue" className="mb-4">New Collection 2026</Tag>
              <Title level={1} className="!text-4xl lg:!text-6xl !font-extrabold !mb-4 !leading-tight">
                Discover Your <span className="text-primary">Perfect Style</span>
              </Title>
              <Paragraph className="text-lg text-muted-foreground mb-8 max-w-lg">
                Shop the latest trends with exclusive deals. Quality products, unbeatable prices, and fast delivery.
              </Paragraph>
              <div className="flex gap-3">
                <Button type="primary" size="large" onClick={() => navigate('/products')}>
                  Shop Now <RightOutlined />
                </Button>
                <Button size="large" onClick={() => navigate('/products?category=Electronics')}>
                  Explore Deals
                </Button>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-xl overflow-hidden shadow-lg">
                    <img src={p.images[0]} alt={p.name} className="w-full h-48 object-cover" />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container-main">
          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col xs={12} md={6} key={i}>
                <div className="text-center p-4">
                  {f.icon}
                  <h4 className="font-semibold mt-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <Title level={2} className="!mb-0">Shop by Category</Title>
            <Link to="/products" className="text-primary hover:underline">View All <RightOutlined /></Link>
          </div>
          <Row gutter={[16, 16]}>
            {mockCategories.map((cat) => (
              <Col xs={12} sm={8} md={4} key={cat.id}>
                <Card
                  hoverable
                  className="text-center"
                  onClick={() => navigate(`/products?category=${cat.slug}`)}
                >
                  <p className="font-medium">{cat.name}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <Title level={2} className="!mb-0">Featured Products</Title>
            <Link to="/products" className="text-primary hover:underline">View All <RightOutlined /></Link>
          </div>
          <Row gutter={[16, 16]}>
            {featuredProducts.map((product) => (
              <Col xs={12} sm={8} md={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Deals */}
      {dealProducts.length > 0 && (
        <section className="py-16">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8">
              <Title level={2} className="!mb-0">
                <ThunderboltOutlined className="text-accent mr-2" />
                Today's Deals
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              {dealProducts.map((product) => (
                <Col xs={12} sm={8} md={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-primary/5">
        <div className="container-main text-center max-w-2xl mx-auto">
          <Title level={2}>Stay in the Loop</Title>
          <Paragraph className="text-muted-foreground mb-6">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </Paragraph>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input placeholder="Enter your email" size="large" className="flex-1" />
            <Button type="primary" size="large">Subscribe</Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
