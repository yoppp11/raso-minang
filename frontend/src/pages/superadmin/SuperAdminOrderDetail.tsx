import { useState, useEffect } from "react"
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, CreditCard, Package } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { Order } from "../../types"

export default function SuperAdminOrderDetail() {
    const { id } = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const response = await http({
                method: 'get',
                url: `/orders/${id}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            setOrder(response.data.order)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load order details'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [id])

    const handleUpdateStatus = async (newStatus: string, type: 'order' | 'payment') => {
        try {
            const data = type === 'order' 
                ? { order_status: newStatus }
                : { payment_status: newStatus }

            await http({
                method: 'patch',
                url: `/superadmin/orders/${id}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                data
            })
            Swal.fire('Success!', 'Order updated successfully', 'success')
            fetchOrder()
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
            month: 'long',
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Order not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/superadmin/orders')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.Order_Items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.Menu_Item?.image_url}
                                        alt={item.Menu_Item?.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.Menu_Item?.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(item.price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-orange-600">
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Status
                                </label>
                                <select
                                    value={order.order_status}
                                    onChange={(e) => handleUpdateStatus(e.target.value, 'order')}
                                    className={`w-full px-4 py-3 rounded-lg ${getStatusColor(order.order_status)} border-0 cursor-pointer font-medium`}
                                >
                                    {orderStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Status
                                </label>
                                <select
                                    value={order.payment_status}
                                    onChange={(e) => handleUpdateStatus(e.target.value, 'payment')}
                                    className={`w-full px-4 py-3 rounded-lg ${getPaymentColor(order.payment_status)} border-0 cursor-pointer font-medium`}
                                >
                                    {paymentStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Customer Info
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-bold text-lg">
                                        {order.User?.full_name?.charAt(0) || order.User?.username?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {order.User?.full_name || order.User?.username}
                                    </p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                {order.User?.email && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">{order.User.email}</span>
                                    </div>
                                )}
                                {order.User?.phone_number && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">{order.User.phone_number}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Delivery Address
                        </h2>
                        <p className="text-gray-600">
                            {order.delivery_address || order.User?.address || 'No address provided'}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Method</span>
                                <span className="font-medium">{order.payment_method || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Timeline
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Created</span>
                                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Updated</span>
                                <span className="text-gray-900">{formatDate(order.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
