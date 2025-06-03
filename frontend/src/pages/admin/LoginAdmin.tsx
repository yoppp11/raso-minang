import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ChefHat } from 'lucide-react'
import InputLogin from '../../components/admin/InputLogin'
import Button from '../../components/admin/Button'
import { http } from '../../helpers/axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'

// const Button = ({ 
//   children, 
//   onClick, 
//   type = 'button', 
//   variant = 'primary', 
//   size = 'md',
//   disabled = false,
//   loading = false,
//   className = ''
// }: ButtonProps) => {
//   const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
  
//   const variantClasses = {
//     primary: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg",
//     secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
//   }
  
//   const sizeClasses = {
//     sm: "px-4 py-2 text-sm",
//     md: "px-6 py-3 text-base",
//     lg: "px-8 py-4 text-lg"
//   }
  
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled || loading}
//       className={`
//         ${baseClasses} 
//         ${variantClasses[variant]} 
//         ${sizeClasses[size]}
//         ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
//         ${className}
//       `}
//     >
//       {loading ? (
//         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//       ) : null}
//       {children}
//     </button>
//   )
// }

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await http({
        method: 'post',
        url: '/login',
        data: {
          email: formData.email,
          password: formData.password
        }
      })

      if(response.data.user.role !== 'admin'){
        Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: 'Hanya admin yang dapat mengakses halaman ini.',
        }).then(() => {
            navigate('/admin/login')
        })
      }
      console.log(response.data);
      localStorage.setItem('access_token', response.data.access_token)
      navigate('/admin/dashboard')
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Login gagal. Silakan coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Selamat datang kembali di Raso Minang</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputLogin
              type="email"
              placeholder="Email admin"
              value={formData.email}
              onChange={handleInputChange('email')}
              icon={Mail}
              error={errors.email}
              required
            />

            <div className="relative">
              <InputLogin
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                icon={Lock}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-gray-600">Ingat saya</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Raso Minang. Admin Dashboard
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <p className="text-xs text-blue-600">
            Email: admin@rasominang.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  )
}