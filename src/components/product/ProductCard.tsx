import { Card, Rate, Button, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.product.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      className="overflow-hidden rounded-lg border border-border"
      cover={
        <div className="relative overflow-hidden bg-muted aspect-square">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/products/${product.id}`)}
          />
          {discount > 0 && (
            <Tag color="#f50" className="absolute top-2 left-2">
              -{discount}%
            </Tag>
          )}
          <Button
            type="text"
            shape="circle"
            className="absolute top-2 right-2 bg-card shadow-md"
            icon={isWishlisted ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
            onClick={() =>
              isWishlisted
                ? dispatch(removeFromWishlist(product.id))
                : dispatch(addToWishlist(product))
            }
          />
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
        <h3
          className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Rate disabled defaultValue={product.rating} allowHalf className="text-xs" />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => dispatch(addToCart(product))}
            disabled={product.stock === 0}
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
