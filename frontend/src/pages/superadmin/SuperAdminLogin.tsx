import { useState } from "react"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"

export default function SuperAdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await http({
                method: 'post',
                url: '/login',
                data: { email, password }
            })

            const { access_token, user } = response.data

            if (user.role !== 'superadmin') {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have super admin privileges'
                })
                return
            }

            localStorage.setItem('access_token', access_token)
            localStorage.setItem('user', JSON.stringify(user))

            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'Successfully logged in as Super Admin',
                timer: 1500,
                showConfirmButton: false
            })

            navigate('/superadmin/dashboard')
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } }
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: axiosError.response?.data?.message || 'Invalid credentials'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
                    <p className="text-gray-600 mt-2">Raso Minang Restaurant System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="admin@rasominang.id"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/admin/login" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                        Regular Admin Login →
                    </a>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                        © 2026 Raso Minang. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
