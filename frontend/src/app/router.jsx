import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProductCatalogPage } from "../pages/ProductCatalogPage";
import { ProductDetailPage } from "../pages/ProductDetailPages";
import { SellerProductCreatePage } from "../pages/SellerProductCreatePage";
import { SellerProductImageUploadPage } from "../pages/SellerProductImageUploadPage";
import { SellerProductsPage } from "../pages/SellerProductsPage";
import { SellerProductEditPage } from "../pages/SellerProductEditPage";
import { CartPage } from "../pages/CartPage";
import { AddressesPage } from "../pages/AddressesPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderHistoryPage } from "../pages/OrderHistoryPage";
import { OrderDetailPage } from "../pages/OrderDetailPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'seller/products/new',
            element: <SellerProductCreatePage />,
          },
          {
            path: 'seller/products/:productId/images',
            element: <SellerProductImageUploadPage />,
          },
          {
            path: "seller/products",
            element: <SellerProductsPage />
          },
          {
            path: "seller/products/:productId/edit",
            element: <SellerProductEditPage />
          },
          {
            path: "cart",
            element: <CartPage />
          },
          {
            path: "addresses",
            element: <AddressesPage />
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "orders",
            element: <OrderHistoryPage />,
          },
          {
            path: "orders/:orderId",
            element: <OrderDetailPage />,
          },
        ],
      },
      {
        path: "products",
        element: <ProductCatalogPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />,
      },
    ],
  },
]);