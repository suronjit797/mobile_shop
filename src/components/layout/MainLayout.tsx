import {
  DashboardOutlined,
  HeartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Layout,
  Space
} from "antd";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { APP_NAME } from "../../constants";
import { logout } from "../../features/auth/authSlice";
import { UserRole } from "@/interfaces/userInterface";


const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const searchParamsValue = searchParams.get("search");

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParamsValue || "");
  }, [searchParamsValue]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenuItems = isAuthenticated
    ? [
        {
          key: "profile",
          label: <Link to="/profile">My Profile</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "orders",
          label: <Link to="/orders">My Orders</Link>,
          icon: <ShoppingCartOutlined />,
        },
        ...(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN
          ? [
              {
                key: "admin",
                label: <Link to="/admin">Admin Panel</Link>,
                icon: <DashboardOutlined />,
              },
            ]
          : []),
        ...(user?.role === UserRole.SELLER
          ? [
              {
                key: "seller",
                label: <Link to="/seller">Seller Panel</Link>,
                icon: <DashboardOutlined />,
              },
            ]
          : []),
        { type: "divider" as const },
        {
          key: "logout",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        },
      ]
    : [];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-4 lg:px-8 bg-card shadow-sm sticky top-0 z-50 h-16">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xl font-bold text-primary no-underline flex items-center gap-2"
          >
            <ShoppingCartOutlined />
            {APP_NAME}
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <Input.Search
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={() =>
              navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
            }
            onClear={() => navigate("/products")}
            size="large"
            enterButton={<SearchOutlined />}
            allowClear
          />
        </div>

        <Space size="middle">
          <Link to="/wishlist">
            <Badge count={wishlistItems.length} size="small">
              <Button
                type="text"
                icon={<HeartOutlined className="text-lg" />}
              />
            </Badge>
          </Link>
          <Link to="/cart">
            <Badge count={cartItems.length} size="small">
              <Button
                type="text"
                icon={<ShoppingCartOutlined className="text-lg" />}
              />
            </Badge>
          </Link>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                icon={<UserOutlined />}
                className="cursor-pointer bg-primary"
              />
            </Dropdown>
          ) : (
            <Space>
              <Button type="primary" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="hidden sm:inline-flex"
              >
                Register
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      <Content className="flex-1">{children}</Content>

      <Footer className="text-center bg-card border-t border-border py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">{APP_NAME}</h3>
              <p className="text-muted-foreground text-sm">
                Your one-stop shop for everything you need.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/products" className="hover:text-primary">
                  Products
                </Link>
                <Link to="/cart" className="hover:text-primary">
                  Cart
                </Link>
                <Link to="/wishlist" className="hover:text-primary">
                  Wishlist
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary">
                  Help Center
                </a>
                <a href="#" className="hover:text-primary">
                  Returns
                </a>
                <a href="#" className="hover:text-primary">
                  Contact Us
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
