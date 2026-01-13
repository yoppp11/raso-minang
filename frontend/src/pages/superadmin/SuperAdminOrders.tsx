import { useState, useEffect } from "react"
import { Eye, Filter } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { Order, PaginationData } from "../../types"
import { Link } from "react-router"

export default function SuperAdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("")
    const [paymentFilter, setPaymentFilter] = useState("")
    const [page, setPage] = useState(1)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            if (paymentFilter) params.append('payment_status', paymentFilter)
            params.append('page', page.toString())
            params.append('limit', '10')

            const response = await http({
                method: 'get',
                url: `/superadmin/orders?${params.toString()}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            setOrders(response.data.data.orders)
            setPagination(response.data.data.pagination)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, paymentFilter, page])

    const handleUpdateStatus = async (orderId: number, newStatus: string, type: 'order' | 'payment') => {
        try {
            const data = type === 'order' 
                ? { order_status: newStatus }
                : { payment_status: newStatus }

            await http({
                method: 'patch',
                url: `/superadmin/orders/${orderId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                data
            })
            Swal.fire('Success!', 'Order updated successfully', 'success')
            fetchOrders()
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } }
            Swal.fire('Error!', axiosError.response?.data?.message || 'Failed to update order', 'error')
        }
    }

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Selesai': return 'bg-green-100 text-green-700'
            case 'Dibatalkan': return 'bg-red-100 text-red-700'
            case 'Diproses': return 'bg-blue-100 text-blue-700'
            case 'Dimasak': return 'bg-yellow-100 text-yellow-700'
            case 'Dalam Perjalanan': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPaymentColor = (status: string) => {
        switch (status) {
            case 'Lunas': return 'bg-green-100 text-green-700'
            case 'Gagal': return 'bg-red-100 text-red-700'
            case 'Dibatalkan': return 'bg-red-100 text-red-700'
            default: return 'bg-yellow-100 text-yellow-700'
        }
    }

    const orderStatuses = ['Menunggu', 'Diproses', 'Dimasak', 'Siap', 'Dalam Perjalanan', 'Selesai', 'Dibatalkan']
    const paymentStatuses = ['Menunggu', 'Lunas', 'Gagal', 'Dibatalkan']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Filter:</span>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">All Order Status</option>
                        {orderStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">All Payment Status</option>
                        {paymentStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.User?.full_name || order.User?.username}</p>
                                                <p className="text-sm text-gray-500">{order.User?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value, 'order')}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)} border-0 cursor-pointer`}
                                            >
                                                {orderStatuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.payment_status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value, 'payment')}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(order.payment_status)} border-0 cursor-pointer`}
                                            >
                                                {paymentStatuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
