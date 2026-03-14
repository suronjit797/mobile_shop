import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Select, Input, Slider, Typography, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { mockProducts, mockCategories } from '../../utils/mockData';

const { Title } = Typography;

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [search, category, sortBy, priceRange]);

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Title level={2}>All Products</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <div className="sticky top-24 flex flex-col gap-4">
              <Input placeholder="Search..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} allowClear />
              <div>
                <p className="font-medium mb-2">Category</p>
                <Select className="w-full" value={category} onChange={setCategory} allowClear placeholder="All Categories"
                  options={mockCategories.map((c) => ({ value: c.slug, label: c.name }))}
                />
              </div>
              <div>
                <p className="font-medium mb-2">Price Range</p>
                <Slider range min={0} max={500} value={priceRange} onChange={(v) => setPriceRange(v as [number, number])} />
                <p className="text-sm text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Sort By</p>
                <Select className="w-full" value={sortBy} onChange={setSortBy}
                  options={[
                    { value: 'newest', label: 'Newest' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' },
                  ]}
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={18}>
            <p className="text-muted-foreground mb-4">{filteredProducts.length} products found</p>
            {filteredProducts.length === 0 ? (
              <Empty description="No products found" />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={12} sm={8} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
