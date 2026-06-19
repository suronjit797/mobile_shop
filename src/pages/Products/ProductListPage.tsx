import { useQueryParams } from "@/hooks/useQueryParams";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Empty, Input, Row, Select, Slider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProductCard from "../../components/product/ProductCard";

const { Title } = Typography;

const ProductListPage = () => {
  const navigate = useNavigate();
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({
    page: 1,
    limit: 10,
    price_lte: 10000,
    price_gte: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { category, price_lte, price_gte, sortBy, sortOrder } = queryParams;

  // rkt query
  const { data: product, isFetching: productFetching } = useGetAllProductQuery({ ...getNonEmptyQueryParams });
  const { data: categories, isFetching: categoryFetching } = useGetAllCategoryQuery({ page: 1, limit: 100 });

  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setQueryParams({ search });
      } else {
        navigate("/products");
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams({
        price_gte: priceRange[0],
        price_lte: priceRange[1],
      });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchClearHandler = () => {
    setSearch("");
    navigate("/products");
  };

  return (
    <MainLayout>
      <div className="container-main py-8">
        <Title level={2}>All Products</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <div className="sticky top-24 flex flex-col gap-4">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={searchChangeHandler}
                onClear={searchClearHandler}
                allowClear
              />
              <div>
                <p className="font-medium mb-2">Category</p>
                <Select
                  className="w-full"
                  value={category}
                  onChange={(value) => setQueryParams({ category: value })}
                  allowClear
                  placeholder="All Categories"
                  options={
                    Array.isArray(categories?.data)
                      ? categories?.data?.map((c) => ({
                          value: c._id,
                          label: c.name,
                        }))
                      : []
                  }
                />
              </div>
              <div>
                <p className="font-medium mb-2">Price Range</p>
                <Slider range min={0} max={5000} value={priceRange} onChange={setPriceRange} />
                <p className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </p>
              </div>
              <div>
                <p className="font-medium mb-2">Sort By</p>
                <Select
                  className="w-full"
                  value={sortBy && sortOrder ? `${sortBy}_${sortOrder}` : undefined}
                  onChange={(value) => {
                    const [sortBy, sortOrder] = value.split("_");
                    setQueryParams({ sortBy, sortOrder });
                  }}
                  options={[
                    { value: "createdAt_desc", label: "Newest" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "rating_desc", label: "Top Rated" },
                  ]}
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={18}>
            <p className="text-muted-foreground mb-4">{product?.data?.length} products found</p>
            {product?.data?.length === 0 ? (
              <Empty description="No products found" />
            ) : (
              <Row gutter={[16, 16]}>
                {Array.isArray(product?.data)
                  ? product?.data?.map((product) => (
                      <Col xs={12} sm={8} key={product._id}>
                        <ProductCard product={product} />
                      </Col>
                    ))
                  : []}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default ProductListPage;
