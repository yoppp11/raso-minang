import { Users, ShoppingBag, DollarSign, ChefHat, MessageSquare, TrendingUp, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { http } from "../../helpers/axios"
import { DashboardStats, Order } from "../../types"
import { Link } from "react-router"

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

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
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                            <p className="text-xs text-gray-400 mt-1">{stats?.totalAdmins || 0} admins</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                            <p className="text-xs text-green-600 mt-1">+{stats?.ordersToday || 0} hari ini</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                            <p className="text-xs text-green-600 mt-1">{formatCurrency(stats?.revenueThisMonth || 0)} bulan ini</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Menu Items</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalMenuItems || 0}</p>
                            <p className="text-xs text-gray-400 mt-1">{stats?.totalCategories || 0} categories</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <ChefHat className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-100 mb-1">Pending Orders</p>
                            <p className="text-3xl font-bold">{stats?.pendingOrders || 0}</p>
                        </div>
                        <Clock className="h-10 w-10 text-orange-200" />
                    </div>
                    <Link to="/superadmin/orders" className="mt-4 inline-block text-sm text-orange-100 hover:text-white">
                        View all orders →
                    </Link>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-100 mb-1">Unread Messages</p>
                            <p className="text-3xl font-bold">{stats?.unreadMessages || 0}</p>
                        </div>
                        <MessageSquare className="h-10 w-10 text-blue-200" />
                    </div>
                    <Link to="/superadmin/chat" className="mt-4 inline-block text-sm text-blue-100 hover:text-white">
                        View all chats →
                    </Link>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-100 mb-1">This Month</p>
                            <p className="text-3xl font-bold">{stats?.ordersThisMonth || 0}</p>
                            <p className="text-sm text-green-100">orders</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-200" />
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <Link to="/superadmin/orders" className="text-sm text-orange-600 hover:text-orange-700">
                            View all
                        </Link>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order: Order) => (
                            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        order.order_status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                        order.order_status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.order_status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No recent orders
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
