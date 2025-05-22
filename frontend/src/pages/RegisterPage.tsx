import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import '../App.css'
import { http } from "../helpers/axios"
import FormInput from "../components/FormInput"
import SocialLoginButton from "../components/SocialLoginButton"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Password dan konfirmasi password tidak cocok')
            return
        }

        setIsLoading(true)
        try {
            const response = await http({
                method: 'POST',
                url: '/register',
                data: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }
            })

            console.log(response.data)
            localStorage.setItem('access_token', response.data.access_token)
            navigate('/login')
        } catch (error) {
            console.log(error)
            if ((error as Error).name === 'BadRequest') {
                setErrorMessage((error as Error).message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">Raso Minang</h1>
                    <p className="text-gray-600">Masakan Padang Asli</p>
                </div>
                
                <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Daftar Akun Baru</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Buat akun untuk menikmati kelezatan Raso Minang
                        </p>
                    </div>
                    
                    {errorMessage && (
                        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <FormInput
                            id="username"
                            name="username"
                            type="text"
                            label="Username"
                            placeholder="Masukkan username"
                            icon={<User className="h-5 w-5 text-gray-400" />}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            id="fullName"
                            name="fullName"
                            type="text"
                            label="Nama Lengkap"
                            placeholder="Masukkan nama lengkap"
                            icon={<User className="h-5 w-5 text-gray-400" />}
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        
                        <FormInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="Masukkan email anda"
                            icon={<Mail className="h-5 w-5 text-gray-400" />}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        
                        <FormInput
                            id="phone"
                            name="phone"
                            type="tel"
                            label="Nomor Telepon"
                            placeholder="Masukkan nomor telepon"
                            icon={<Phone className="h-5 w-5 text-gray-400" />}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Buat password"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Saya setuju dengan <a href="/terms" className="text-green-600 hover:text-green-500">Syarat dan Ketentuan</a> serta <a href="/privacy" className="text-green-600 hover:text-green-500">Kebijakan Privasi</a>
                            </label>
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                                    isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mendaftar...
                                    </>
                                ) : (
                                    <>
                                        Daftar Sekarang
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">atau daftar dengan</span>
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <SocialLoginButton provider="google" />
                            <SocialLoginButton provider="facebook" />
                        </div>
                    </div>
                
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                Masuk sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500">
                <p>© 2025 Raso Minang. Seluruh hak cipta dilindungi.</p>
            </div>
        </div>
    )
}