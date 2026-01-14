import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
// Customer pages
import AboutUsPage from './pages/customer/AboutUs'
import CartPage from './pages/customer/CartPage'
import DetailPage from './pages/customer/DetailPage'
import OrderHistory from './pages/customer/HistoryOrder'
import HomePage from './pages/customer/HomePage'
import ListMenu from './pages/customer/ListMenu'
import LoginPage from './pages/customer/LoginPage'
import RegisterPage from './pages/customer/RegisterPage'
import CustomerChat from './pages/customer/CustomerChat'
// Super Admin imports (consolidated admin)
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin'
import SuperAdminParent from './pages/superadmin/SuperAdminParent'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import SuperAdminUsers from './pages/superadmin/SuperAdminUsers'
import SuperAdminOrders from './pages/superadmin/SuperAdminOrders'
import SuperAdminChat from './pages/superadmin/SuperAdminChat'
import SuperAdminMenuItems from './pages/superadmin/SuperAdminMenuItems'
import SuperAdminCategories from './pages/superadmin/SuperAdminCategories'
import SuperAdminAddMenu from './pages/superadmin/SuperAdminAddMenu'
import SuperAdminEditMenu from './pages/superadmin/SuperAdminEditMenu'
import SuperAdminAddCategory from './pages/superadmin/SuperAdminAddCategory'
import SuperAdminEditCategory from './pages/superadmin/SuperAdminEditCategory'
import SuperAdminOrderDetail from './pages/superadmin/SuperAdminOrderDetail'
import SuperAdminMenuDetail from './pages/superadmin/SuperAdminMenuDetail'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/my-order" element={<OrderHistory />} />
      <Route path="/menu" element={<ListMenu />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/:id" element={<DetailPage />} />

      {/* Redirect old admin routes to superadmin */}
      <Route path="/admin/*" element={<Navigate to="/superadmin/dashboard" replace />} />

      {/* Super Admin Routes (consolidated admin) */}
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route path="/superadmin" element={<SuperAdminParent />}>
        <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="menu" element={<SuperAdminMenuItems />} />
        <Route path="menu/add" element={<SuperAdminAddMenu />} />
        <Route path="menu/edit/:id" element={<SuperAdminEditMenu />} />
        <Route path="menu/:id" element={<SuperAdminMenuDetail />} />
        <Route path="categories" element={<SuperAdminCategories />} />
        <Route path="categories/add" element={<SuperAdminAddCategory />} />
        <Route path="categories/edit/:id" element={<SuperAdminEditCategory />} />
        <Route path="orders" element={<SuperAdminOrders />} />
        <Route path="orders/:id" element={<SuperAdminOrderDetail />} />
        <Route path="chat" element={<SuperAdminChat />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
