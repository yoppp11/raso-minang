import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import AdminDashboard from './pages/admin/DashboardAdmin.tsx'
import CartPage from './pages/customer/CartPage.tsx'
import DetailPage from './pages/customer/DetailPage.tsx'
import HomePage from './pages/customer/HomePage.tsx'
import LoginPage from './pages/customer/LoginPage.tsx'
import RegisterPage from './pages/customer/RegisterPage.tsx'
import AdminLogin from './pages/admin/LoginAdmin.tsx'
import AboutUsPage from './pages/customer/AboutUs.tsx'
import AddMenuPage from './pages/admin/AddMenuItem.tsx'
import MenuItemsTable from './pages/admin/MenuItems.tsx'
import OrderHistory from './pages/customer/HistoryOrder.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/my-order" element={<OrderHistory />} />
      <Route path="/:id" element={<DetailPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-menu" element={<AddMenuPage />} />
      <Route path="/admin/list-menu" element={<MenuItemsTable />} />
    </Routes>
  </BrowserRouter>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
