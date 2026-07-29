import { IProduct } from "@/interfaces/product.interface";
import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Rate, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.product._id === product._id);

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card
      hoverable
      className="overflow-hidden rounded-lg border border-border"
      cover={
        <div className="relative overflow-hidden bg-muted aspect-square">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${isOutOfStock ? "opacity-60" : ""}`}
            onClick={() => navigate(`/products/${product._id}`)}
          />
          {discount > 0 && (
            <Tag color="#f50" className="absolute top-2 left-2">
              -{discount}%
            </Tag>
          )}

          {/* Stock Badge Overlay */}
          {isOutOfStock ? (
            <Tag color="red" className="absolute bottom-2 left-2 m-0 font-medium">
              Out of Stock
            </Tag>
          ) : isLowStock ? (
            <Tag color="warning" className="absolute bottom-2 left-2 m-0 font-medium">
              Only {product.stock} left
            </Tag>
          ) : (
            <Tag color="green" className="absolute bottom-2 left-2 m-0 font-medium">
              In Stock: {product.stock}
            </Tag>
          )}

          <Button
            type="text"
            shape="circle"
            className="absolute top-2 right-2 bg-card shadow-md hover:!bg-gray-300"
            icon={isWishlisted ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
            onClick={() => (isWishlisted ? dispatch(removeFromWishlist(product._id)) : dispatch(addToWishlist(product)))}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
          {isOutOfStock ? (
            <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-xs text-amber-600 font-semibold">{product.stock} remaining</span>
          ) : (
            <span className="text-xs text-emerald-600 font-medium">Stock: {product.stock}</span>
          )}
        </div>
        <h3
          className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/products/${product._id}`)}
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
            {product.originalPrice && <span className="text-muted-foreground line-through text-sm">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => dispatch(addToCart(product))}
            disabled={isOutOfStock}
            danger={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

