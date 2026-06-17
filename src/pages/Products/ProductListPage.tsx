import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Row, Col, Select, Input, Slider, Typography, Empty, App } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import MainLayout from "../../components/layout/MainLayout";
import ProductCard from "../../components/product/ProductCard";
import { mockProducts, mockCategories } from "../../utils/mockData";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDeleteProductMutation, useGetAllProductQuery } from "@/redux/api/productApi";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApi";

const { Title } = Typography;

const ProductListPage = () => {
  const { queryParams, setQueryParams, getNonEmptyQueryParams } = useQueryParams({ page: 1, limit: 10, price_lte: 10000, price_gte: 0 });
  const { modal, notification } = App.useApp();

  const { category, price_lte, price_gte, sortBy, sortOrder } = queryParams;

  // rkt query
  const { data: product, isFetching: productFetching } = useGetAllProductQuery({ ...getNonEmptyQueryParams });
  const { data: categories, isFetching: categoryFetching } = useGetAllCategoryQuery({ page: 1, limit: 100 });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsValue = searchParams.get("search");
  const searchParamsCategory = searchParams.get("category");

  const [search, setSearch] = useState("");
  // const [category, setCategory] = useState<undefined | string>();
  // const [sortBy, setSortBy] = useState("newest");
  // const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value) {
      navigate(`/products?search=${encodeURIComponent(e.target.value)}`);
    } else {
      navigate(`/products`);
    }
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
                <Slider
                  range
                  min={0}
                  max={10000}
                  value={[Number(price_gte), Number(price_lte)]}
                  onChange={(v) => setQueryParams({ price_gte: v[0], price_lte: v[1] })}
                />
                <p className="text-sm text-muted-foreground">
                  ${price_gte} - ${price_lte}
                </p>
              </div>
              <div>
                <p className="font-medium mb-2">Sort By</p>
                <Select
                  className="w-full"
                  value={sortBy && sortOrder ? `${sortBy}_${sortOrder}` : ""}
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
