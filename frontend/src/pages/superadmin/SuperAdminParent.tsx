import { Menu, Search, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Outlet, useNavigate } from "react-router"
import { http } from "../../helpers/axios"
import { DashboardStats } from "../../types"
import SuperAdminSidebar from "../../components/superadmin/SuperAdminSidebar"

export default function SuperAdminParent() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [unreadMessages, setUnreadMessages] = useState(0)
    const navigate = useNavigate()

    const fetchStats = async () => {
        try {
            const response = await http({
                method: 'get',
                url: '/superadmin/stats',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            setStats(response.data.data)
            setUnreadMessages(response.data.data.unreadMessages || 0)
        } catch (error: unknown) {
            console.log(error);
            const axiosError = error as { response?: { status?: number } }
            if (axiosError.response?.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have permission to access this page'
                })
                navigate('/admin/login')
            }
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            navigate('/superadmin/login')
            return
        }
        fetchStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SuperAdminSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                unreadMessages={unreadMessages}
            />
            
            <div className="flex-1 lg:ml-0">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-2xl font-semibold text-gray-900">Super Admin</h1>
                                <p className="text-sm text-gray-600">Kelola restoran Rasa Minang</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block relative">
                                <input 
                                    type="text" 
                                    placeholder="Cari..." 
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            
                            <button className="relative p-2 rounded-lg hover:bg-gray-100">
                                <Bell className="h-6 w-6 text-gray-600" />
                                {unreadMessages > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {unreadMessages > 9 ? '9+' : unreadMessages}
                                    </span>
                                )}
                            </button>
                            
                            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">SA</span>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="p-6">
                    <Outlet context={{ stats, fetchStats }} />
                </main>
            </div>
        </div>
    )
}
