import { useEffect, useState } from "react"
import { Eye, Filter, Search, Truck, Clock, CheckCircle, XCircle } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { useNavigate } from "react-router"
import Card from "../../components/admin/Card"
import Button from "../../components/admin/Button"
import Input from "../../components/admin/Input"

// Types
interface User {
  id: number
  full_name: string
  email: string
}

interface MenuItem {
  id: number
  name: string
  price: number
  image_url: string
}

interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: number
  subtotal: number
  special_instructions?: string
  MenuItem?: MenuItem
}

interface Order {
  id: number
  user_id: number
  order_status: string
  order_type: string
  total_amount: number
  delivery_address?: string
  payment_status: string
  notes?: string
  createdAt: string
  updatedAt: string
  User?: User
  Order_Items?: OrderItem[]
}

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await http({
        method: 'GET',
        url: '/orders/all',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      console.log(response.data.orders)
      setOrders(response.data.orders)
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal memuat data pesanan. Silakan coba lagi.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.User?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.User?.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || order.order_status === filterStatus
    const matchesType = filterType === "all" || order.order_type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggi':
        return 'bg-yellow-100 text-yellow-800'
      case 'Dikonfirmasi':
        return 'bg-blue-100 text-blue-800'
      case 'Disiapkan':
        return 'bg-orange-100 text-orange-800'
      case 'Siap':
        return 'bg-purple-100 text-purple-800'
      case 'Selesai':
        return 'bg-green-100 text-green-800'
      case 'Batal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas':
        return 'bg-green-100 text-green-800'
      case 'Belum Bayar':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return <Clock className="h-4 w-4" />
      case 'Dikonfirmasi':
      case 'Disiapkan':
      case 'Siap':
        return <Truck className="h-4 w-4" />
      case 'Selesai':
        return <CheckCircle className="h-4 w-4" />
      case 'Batal':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await http({
        method: 'patch',
        url: `/orders/${orderId}/status`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        data: { order_status: newStatus }
      })

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Status pesanan berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      })

      fetchOrders() 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui status pesanan',
      })
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Pesanan</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchOrders}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan ID, nama, atau email..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dikonfirmasi">Dikonfirmasi</option>
              <option value="Disiapkan">Sedang Disiapkan</option>
              <option value="Siap">Siap</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Dibatalkan</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="dine_in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.toString().padStart(4, '0')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.Order_Items?.length || 0} item
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.User?.full_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.User?.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                      {getStatusIcon(order.order_status)}
                      <span className="ml-1 capitalize">{order.order_status}</span>
                    </span>
                  </div>
                  {/* <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status === 'paid' ? 'Lunas' : order.payment_status === 'pending' ? 'Belum Bayar' : 'Gagal'}
                    </span>
                  </div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                    {order.order_type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Rp {order.total_amount.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Dikonfirmasi">Dikonfirmasi</option>
                      <option value="Disiapkan">Disiapkan</option>
                      <option value="Siap">Siap</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {filteredOrders.map((order) => (
          <div key={order.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  #{order.id.toString().padStart(4, '0')}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                  {getStatusIcon(order.order_status)}
                  <span className="ml-1 capitalize">{order.order_status}</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Pelanggan:</span>
                <div className="font-medium text-gray-900">{order.User?.full_name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Total:</span>
                <div className="font-medium text-gray-900">Rp {order.total_amount.toLocaleString('id-ID')}</div>
              </div>
              <div>
                <span className="text-gray-500">Tipe:</span>
                <div className="capitalize">{order.order_type.replace('_', ' ')}</div>
              </div>
              <div>
                <span className="text-gray-500">Pembayaran:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status === 'Lunas' ? 'Lunas' : order.payment_status === 'pending' ? 'Belum Bayar' : 'Gagal'}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
              <select
                value={order.order_status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Dikonfirmasi">Dikonfirmasi</option>
                <option value="Disiapkan">Disiapkan</option>
                <option value="Siap">Siap</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Tidak ada pesanan yang ditemukan</p>
        </div>
      )}
    </Card>
  )
}