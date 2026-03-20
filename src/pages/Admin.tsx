import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import AdminLogin from '../components/admin/AdminLogin';

export default function Admin() {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin/panel" replace />;
  }

  return <AdminLogin />;
}
