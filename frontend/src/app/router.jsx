import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProductCatalogPage } from "../pages/ProductCatalogPage";

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
        ],
      },
      {
       path: "products",
       element: <ProductCatalogPage />,
      },
    ],
  },
]);