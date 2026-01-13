import { ChefHat, Home, LogOut, ShoppingBag, X, Layers, Users, MessageSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router"; 

interface SuperAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unreadMessages?: number;
}

export default function SuperAdminSidebar({
  isOpen,
  onClose,
  unreadMessages = 0
}: SuperAdminSidebarProps) {
  const location = useLocation(); 
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", ref: "/superadmin/dashboard" },
    { icon: Users, label: "Users", ref: "/superadmin/users" },
    { icon: ChefHat, label: "Menu Items", ref: "/superadmin/menu" },
    { icon: Layers, label: "Categories", ref: "/superadmin/categories" },
    { icon: ShoppingBag, label: "Orders", ref: "/superadmin/orders" },
    { icon: MessageSquare, label: "Chat", ref: "/superadmin/chat", badge: unreadMessages },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-green-700">Rasa Minang</h1>
            <p className="text-sm text-orange-600 font-medium">Super Admin</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.ref;

            return (
              <Link
                key={index}
                to={item.ref}
                className={`flex items-center justify-between px-3 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-3">
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={()=> {
                localStorage.removeItem("access_token");
                navigate('/superadmin/login');
              }} 
              className="flex items-center w-full px-3 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

