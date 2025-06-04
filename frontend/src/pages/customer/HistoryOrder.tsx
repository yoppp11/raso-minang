import { useState, useEffect } from "react";
import { Clock, MapPin, CreditCard, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Order, OrderItem } from "../../types";
import Navbar from "../../components/customer/Navbar";

const mockOrderData: Order[] = [
  {
    id: 1,
    user_id: 1,
    order_status: "Selesai",
    order_type: "Delivery",
    total_amount: 85000,
    delivery_address: "Jl. Sudirman No. 123, Jakarta Pusat",
    payment_status: "Lunas",
    notes: "Pedas sedang, tanpa cabe rawit",
    createdAt: "2024-06-01T10:30:00Z",
    updatedAt: "2024-06-01T12:30:00Z",
    order_items: [
      {
        id: 1,
        order_id: 1,
        menu_item_id: 1,
        quantity: 2,
        unit_price: 25000,
        subtotal: 50000,
        special_instructions: "Pedas sedang",
        createdAt: "2024-06-01T10:30:00Z",
        updatedAt: "2024-06-01T10:30:00Z",
        menu_item: {
          id: 1,
          name: "Rendang Daging",
          image_url: "/api/placeholder/80/80"
        }
      },
      {
        id: 2,
        order_id: 1,
        menu_item_id: 2,
        quantity: 1,
        unit_price: 35000,
        subtotal: 35000,
        special_instructions: "",
        createdAt: "2024-06-01T10:30:00Z",
        updatedAt: "2024-06-01T10:30:00Z",
        menu_item: {
          id: 2,
          name: "Gulai Ayam",
          image_url: "/api/placeholder/80/80"
        }
      }
    ]
  },
  {
    id: 2,
    user_id: 1,
    order_status: "Dalam Perjalanan",
    order_type: "Delivery",
    total_amount: 120000,
    delivery_address: "Jl. Thamrin No. 45, Jakarta Pusat",
    payment_status: "Lunas",
    notes: "",
    createdAt: "2024-06-04T14:15:00Z",
    updatedAt: "2024-06-04T15:00:00Z",
    order_items: [
      {
        id: 3,
        order_id: 2,
        menu_item_id: 3,
        quantity: 1,
        unit_price: 45000,
        subtotal: 45000,
        special_instructions: "",
        createdAt: "2024-06-04T14:15:00Z",
        updatedAt: "2024-06-04T14:15:00Z",
        menu_item: {
          id: 3,
          name: "Ayam Pop",
          image_url: "/api/placeholder/80/80"
        }
      },
      {
        id: 4,
        order_id: 2,
        menu_item_id: 4,
        quantity: 3,
        unit_price: 25000,
        subtotal: 75000,
        special_instructions: "Extra sambal",
        createdAt: "2024-06-04T14:15:00Z",
        updatedAt: "2024-06-04T14:15:00Z",
        menu_item: {
          id: 4,
          name: "Dendeng Balado",
          image_url: "/api/placeholder/80/80"
        }
      }
    ]
  }
];

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        
        // Ganti dengan API call sebenarnya
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   throw new Error('Token tidak ditemukan');
        // }
        
        // const response = await fetch('/api/orders/user', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        
        // const result: ApiResponse = await response.json();
        
        // if (!result.success) {
        //   throw new Error(result.message || 'Gagal mengambil data pesanan');
        // }
        
        // Simulasi delay API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // setOrders(result.data);
        setOrders(mockOrderData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
        setError(errorMessage);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['order_status']): string => {
    const statusColors: Record<Order['order_status'], string> = {
      "Selesai": "bg-green-100 text-green-800",
      "Dalam Perjalanan": "bg-blue-100 text-blue-800",
      "Diproses": "bg-yellow-100 text-yellow-800",
      "Dimasak": "bg-orange-100 text-orange-800",
      "Siap": "bg-purple-100 text-purple-800",
      "Menunggu": "bg-gray-100 text-gray-800",
      "Dibatalkan": "bg-red-100 text-red-800"
    };
    
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: Order['payment_status']): string => {
    const paymentColors: Record<Order['payment_status'], string> = {
      "Lunas": "bg-green-100 text-green-800",
      "Menunggu": "bg-yellow-100 text-yellow-800",
      "Gagal": "bg-red-100 text-red-800",
      "Dibatalkan": "bg-gray-100 text-gray-800"
    };
    
    return paymentColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpansion = (orderId: number): void => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleRetryFetch = (): void => {
    const fetchOrders = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrderData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-red-500 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={handleRetryFetch}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pesanan</h1>
          <p className="text-gray-600">Lihat semua pesanan Anda di Raso Minang</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-600 mb-6">Anda belum melakukan pesanan apapun. Mulai pesan makanan lezat kami!</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Mulai Pesan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pesanan #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock size={16} className="mr-1" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {order.order_type}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {order.delivery_address && (
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Alamat Pengiriman</p>
                          <p className="text-sm text-gray-600">{order.delivery_address}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-2">
                      <CreditCard size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Pembayaran</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Catatan: </span>
                        {order.notes}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-green-600 transition-colors"
                    >
                      <span>Detail Pesanan ({order.order_items.length} item)</span>
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    {expandedOrders.has(order.id) && (
                      <div className="mt-4 space-y-3">
                        {order.order_items.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.menu_item.image_url}
                              alt={item.menu_item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.menu_item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.quantity}x {formatCurrency(item.unit_price)}
                              </p>
                              {item.special_instructions && (
                                <p className="text-sm text-gray-500 italic">
                                  Catatan: {item.special_instructions}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;