import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import AuthCallback from '../pages/public/AuthCallback';
import BookDetailPage from '../pages/public/BookDetailPage';
import Dashboard from '../pages/admin/Dashboard';
import BooksManagement from '../pages/admin/BooksManagement';
import UsersManagement from '../pages/admin/UsersManagement';
import CatalogManagement from '../pages/admin/CatalogManagement';
import { ROLES } from '../utils/constants';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/libros/:id" element={<BookDetailPage />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={[ROLES.ADMIN, ROLES.BIBLIOTECARIO]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="libros" element={<BooksManagement />} />
      <Route path="autores" element={<CatalogManagement type="authors" />} />
      <Route path="categorias" element={<CatalogManagement type="categories" />} />
      <Route path="usuarios" element={<UsersManagement />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
