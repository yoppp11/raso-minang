import { ChefHat, DollarSign, Menu, Search, ShoppingBag, Users } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Input from "../../components/admin/Input"
import MenuItemsTable from "../../components/admin/MenuItemsTable"
import Sidebar from "../../components/admin/Sidebar"
import StatsCard from "../../components/admin/StatsCard"
import { http } from "../../helpers/axios"
import { Order } from "../../types"
import OrdersTable from "./Orders"


export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([]) 

  const fetchOrder = async () => {
    try {
      const response  = await http({
        method: 'get',
        url: '/orders',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      })

      const data: Order[] = response.data.orders
      console.log(data);
      setOrders(data)
      
    } catch (error) {
      console.log(error);
      Swal.fire({

      })
      
    }
  }

  useEffect(()=> {
    fetchOrder()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Selamat datang di panel admin Raso Minang</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <Input placeholder="Cari..." icon={Search} className="w-64" />
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Menu"
              value="24"
              change="+2 item baru"
              icon={ChefHat}
              color="green"
            />
            <StatsCard
              title="Pesanan Hari Ini"
              value="45"
              change="+12% dari kemarin"
              icon={ShoppingBag}
              color="blue"
            />
            <StatsCard
              title="Pendapatan"
              value="Rp 2.4M"
              change="+8% dari bulan lalu"
              icon={DollarSign}
              color="yellow"
            />
            <StatsCard
              title="Pelanggan Aktif"
              value="156"
              change="+5 pelanggan baru"
              icon={Users}
              color="red"
            />
          </div>
          
          <MenuItemsTable />
          
          <div className="mt-8">
            <OrdersTable />
          </div>
        </main>
      </div>
    </div>
  )
}