import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, FileText, Package } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import Card from "../../components/admin/Card"
import Button from "../../components/admin/Button"

interface User {
  id: number
  full_name: string
  email: string
  phone?: string
}

interface MenuItem {
  id: number
  name: string
  price: number
  image_url: string
  description?: string
}

interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: number
  subtotal: number
  special_instructions?: string
  Menu_Item?: MenuItem
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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await http({
        method: 'GET',
        url: `/orders/${id}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      console.log(response.data.order)
      setOrder(response.data.order)
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal memuat detail pesanan.',
      }).then(() => {
        navigate('/admin/orders')
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchOrderDetail()
    }
  }, [id])

  const updateOrderStatus = async (newStatus: string) => {
    try {
        await http({
          method: 'patch',
          url: `/orders/${id}/status`,
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
  
        fetchOrderDetail() 
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal memperbarui status pesanan',
        })
      }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Dikonfirmasi':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Disiapkan':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Siap':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Selesai':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Batal':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Belum Bayar':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Gagal':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'Menunggu Konfirmasi'
      case 'Dikonfirmasi': return 'Dikonfirmasi'
      case 'Disiapkan': return 'Sedang Disiapkan'
      case 'Siap': return 'Siap Diambil/Diantar'
      case 'Selesai': return 'Selesai'
      case 'Batal': return 'Dibatalkan'
      default: return status
    }
  }

  const getPaymentText = (status: string) => {
    switch (status) {
      case 'Lunas': return 'Lunas'
      case 'Belum Bayar': return 'Belum Dibayar'
      case 'Gagal': return 'Gagal'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pesanan Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-4">Pesanan yang Anda cari tidak dapat ditemukan.</p>
          <Button onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Pesanan
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/list-order')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pesanan #{order.id.toString().padStart(4, '0')}
            </h1>
            <p className="text-gray-500">Detail informasi pesanan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.order_status)}`}>
            {getStatusText(order.order_status)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
            {getPaymentText(order.payment_status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Item Pesanan</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.Order_Items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.Menu_Item?.image_url || '/placeholder-food.jpg'}
                      alt={item.Menu_Item?.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.Menu_Item?.name}</h3>
                      <p className="text-sm text-gray-500">{item.Menu_Item?.description}</p>
                      {item.special_instructions && (
                        <p className="text-sm text-blue-600 mt-1">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {item.special_instructions}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {item.quantity} x Rp {item.unit_price.toLocaleString('id-ID')}
                      </div>
                      <div className="font-medium text-gray-900">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Pesanan</span>
                  <span className="text-xl font-bold text-green-600">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {order.notes && (
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Catatan Pesanan</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
            </div>
            <div className="p-6">
              <select
                value={order.order_status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Menunggu">Menunggu Konfirmasi</option>
                <option value="Dikonfirmasi">Dikonfirmasi</option>
                <option value="Disiapkan">Sedang Disiapkan</option>
                <option value="Siap">Siap Diambil/Diantar</option>
                <option value="Selesaai">Selesai</option>
                <option value="Batal">Dibatalkan</option>
              </select>
            </div>
          </Card>

          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Pelanggan</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{order.User?.full_name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{order.User?.email || 'N/A'}</div>
                </div>
              </div>
              
              {order.User?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-900">{order.User.phone}</div>
                </div>
              )}

              {order.delivery_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Alamat Pengiriman</div>
                    <div className="text-sm text-gray-600 mt-1">{order.delivery_address}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Pesanan</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ID Pesanan</span>
                <span className="font-medium text-gray-900">#{order.id.toString().padStart(4, '0')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tipe Pesanan</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.order_type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status Pembayaran</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                  {getPaymentText(order.payment_status)}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Tanggal Pesanan</div>
                  <div className="text-sm text-gray-600 mt-1">{formatDate(order.createdAt)}</div>
                </div>
              </div>

              {order.updatedAt !== order.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Terakhir Diupdate</div>
                    <div className="text-sm text-gray-600 mt-1">{formatDate(order.updatedAt)}</div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Pembayaran</span>
                  <span className="text-lg font-bold text-green-600">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}