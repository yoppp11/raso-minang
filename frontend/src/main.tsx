import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import AddMenuPage from './pages/admin/AddMenuItem.tsx'
import AdminDashboard from './pages/admin/DashboardAdmin.tsx'
import EditMenuPage from './pages/admin/EditMenuItem.tsx'
import AdminLogin from './pages/admin/LoginAdmin.tsx'
import MenuItemsTable from './components/admin/MenuItemsTable.tsx'
import AboutUsPage from './pages/customer/AboutUs.tsx'
import CartPage from './pages/customer/CartPage.tsx'
import DetailPage from './pages/customer/DetailPage.tsx'
import OrderHistory from './pages/customer/HistoryOrder.tsx'
import HomePage from './pages/customer/HomePage.tsx'
import ListMenu from './pages/customer/ListMenu.tsx'
import LoginPage from './pages/customer/LoginPage.tsx'
import RegisterPage from './pages/customer/RegisterPage.tsx'
import AddCategoryPage from './pages/admin/AddCategory.tsx'
import EditCategoryPage from './pages/admin/EditCategory.tsx'
import AdminParent from './pages/admin/AdminParent.tsx'
import OrdersTable from './pages/admin/Orders.tsx'
import CategoriesTable from './components/admin/CategoryTable.tsx'
import OrderDetail from './pages/admin/OrderDetail.tsx'
import MenuDetailPage from './pages/admin/MenuDetail.tsx'
// Super Admin imports
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin.tsx'
import SuperAdminParent from './pages/superadmin/SuperAdminParent.tsx'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard.tsx'
import SuperAdminUsers from './pages/superadmin/SuperAdminUsers.tsx'
import SuperAdminOrders from './pages/superadmin/SuperAdminOrders.tsx'
import SuperAdminChat from './pages/superadmin/SuperAdminChat.tsx'

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
      <Route path='/admin' element={<AdminParent />}>
        <Route path="list-menu" element={<MenuItemsTable />} />
        <Route path="list-order" element={<OrdersTable />} />
        <Route path="category" element={<CategoriesTable />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-menu" element={<AddMenuPage />} />
      <Route path="/admin/add-category" element={<AddCategoryPage />} />
      <Route path="/admin/edit-menu/:id" element={<EditMenuPage />} />
      <Route path="/admin/edit-category/:id" element={<EditCategoryPage />} />
      <Route path="/admin/orders/:id" element={<OrderDetail />} />
      <Route path="/admin/menus/:id" element={<MenuDetailPage />} />

      {/* Super Admin Routes */}
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route path="/superadmin" element={<SuperAdminParent />}>
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="menu" element={<MenuItemsTable />} />
        <Route path="categories" element={<CategoriesTable />} />
        <Route path="orders" element={<SuperAdminOrders />} />
        <Route path="chat" element={<SuperAdminChat />} />
        <Route path="stats" element={<SuperAdminDashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
