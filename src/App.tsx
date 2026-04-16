import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminPanel from './components/admin/AdminPanel';
import { useAdminStore } from './store/adminStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const isInitialized = useAdminStore((state) => state.isInitialized);
  
  if (!isInitialized) return null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const checkSession = useAdminStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/panel" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
