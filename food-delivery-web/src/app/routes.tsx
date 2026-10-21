import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth'
import { authService } from '../features/auth/services/authService'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { CreateOrderPage } from '../features/orders/pages/CreateOrderPage'
import { OrderDetailsPage } from '../features/orders/pages/OrderDetailsPage'
import { OrdersPage } from '../features/orders/pages/OrdersPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth()
  return authenticated ? children : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Navigate to={authService.isAuthenticated() ? '/orders' : '/login'} replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/orders/new" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/orders" replace />} />
  </Routes>
}
