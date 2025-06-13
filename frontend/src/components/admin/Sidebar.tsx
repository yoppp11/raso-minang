import { BarChart3, ChefHat, Home, LogOut, Settings, ShoppingBag, Users, X } from "lucide-react"
import { Link } from "react-router"

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }){
    const menuItems = [
      { icon: Home, label: "Dashboard", active: true, ref: '/admin/dashboard' },
      { icon: ChefHat, label: "Menu Items", ref: '/admin/list-menu' },
      { icon: ShoppingBag, label: "Orders", ref: '/admin/list-order' },
      { icon: Users, label: "Customers", ref: '/admin/customers' }
    ]
    
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-green-700">Raso Minang</h1>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="mt-6 px-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.ref || '#'}
                className={`flex items-center px-3 py-3 rounded-lg mb-1 transition-colors ${
                  item.active 
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-6 left-0 right-0 px-3">
            <button className="flex items-center w-full px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </>
    )
  }