import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { http } from "../../helpers/axios"
import '../../App.css'
import Swal from "sweetalert2"

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        console.log(email, password);
        setIsLoading(true)
        try {
            
            const response = await http({
                method: 'POST',
                url: '/login',
                data: {
                    email, password
                }
            })

            if(response.data.user.role !== 'user'){
                Swal.fire({
                    icon: 'error',
                    title: 'Akses Ditolak',
                    text: 'Hanya user yang dapat mengakses halaman ini.',
                }).then(() => {
                    navigate('/login')
                })
            }

            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil',
                text: 'Selamat datang di Raso Minang!',
            })

            console.log(response.data);
            localStorage.setItem('access_token', response.data.access_token)
            navigate('/')

            
            

            // if(response.status === 200){
            //     const { data } = response.data
            //     localStorage.setItem('token', data.token)
            //     navigate('/home')
            // }
        } catch (error) {
            console.log(error);
            if((error as Error).name === 'BadRequest'){
                setErrorMessage((error as Error).message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">Raso Minang</h1>
                    <p className="text-gray-600">Masakan Padang Asli</p>
                </div>
                
                <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Masuk ke Akun Anda</h2>
                        <p className="mt-2 text-sm text-gray-600">
                        Nikmati kelezatan masakan Padang dari Raso Minang
                        </p>
                    </div>
                    
                    {errorMessage && (
                        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                        </div>
                    )}
                
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    console.log(email);
                                    
                                    setEmail(e.target.value)
                                }}
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Masukkan email anda"
                                />
                            </div>
                        </div>
                        
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
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Masukkan password"
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
                            <div className="mt-2 flex items-center justify-end">
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                                        Lupa password?
                                    </Link>
                                </div>
                            </div>
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
                                        Masuk...
                                    </>
                                    ) : (
                                    <>
                                        Masuk
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                            Daftar sekarang
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