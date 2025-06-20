import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import AddMenuPage from './pages/admin/AddMenuItem.tsx'
import AdminDashboard from './pages/admin/DashboardAdmin.tsx'
import EditMenuPage from './pages/admin/EditMenuItem.tsx'
import AdminLogin from './pages/admin/LoginAdmin.tsx'
import MenuItemsTable from './pages/admin/MenuItems.tsx'
import OrdersPage from './pages/admin/OrdersPage.tsx'
import AboutUsPage from './pages/customer/AboutUs.tsx'
import CartPage from './pages/customer/CartPage.tsx'
import DetailPage from './pages/customer/DetailPage.tsx'
import OrderHistory from './pages/customer/HistoryOrder.tsx'
import HomePage from './pages/customer/HomePage.tsx'
import ListMenu from './pages/customer/ListMenu.tsx'
import LoginPage from './pages/customer/LoginPage.tsx'
import RegisterPage from './pages/customer/RegisterPage.tsx'
import CategoryPage from './pages/admin/Category.tsx'
import AddCategoryPage from './pages/admin/AddCategory.tsx'
import EditCategoryPage from './pages/admin/EditCategory.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/my-order" element={<OrderHistory />} />
      <Route path="/menu" element={<ListMenu />} />
      <Route path="/:id" element={<DetailPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-menu" element={<AddMenuPage />} />
      <Route path="/admin/add-category" element={<AddCategoryPage />} />
      <Route path="/admin/list-menu" element={<MenuItemsTable />} />
      <Route path="/admin/list-order" element={<OrdersPage />} />
      <Route path="/admin/category" element={<CategoryPage />} />
      <Route path="/admin/edit-menu/:id" element={<EditMenuPage />} />
      <Route path="/admin/edit-category/:id" element={<EditCategoryPage />} />
    </Routes>
  </BrowserRouter>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
