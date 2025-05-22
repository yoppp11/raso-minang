import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.tsx'
import DetailPage from './pages/DetailPage.tsx'
import CartPage from './pages/CartPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/:id" element={<DetailPage />} />
    </Routes>
  </BrowserRouter>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
