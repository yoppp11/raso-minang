import { ArrowLeft, Minus, Plus, Star, Heart, Clock, Users, ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import PriceFormatter from "../../components/customer/PriceFormatter";
import SpicyBadge from "../../components/customer/SpicyBadge";
import { http } from "../../helpers/axios";
import { MenuItem } from "../../types";
import MenuCard from "../../components/customer/MenuCard";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem>({} as MenuItem);
  const [recommendedDishes, setRecommendedDishes] = useState<MenuItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);

      const response = await http({
        method: 'post',
        url: '/carts',
        data: {
          menu_item_id: id,
          quantity: quantity,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Menu berhasil ditambahkan ke keranjang',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await http({
        method: 'get',
        url: '/menus/' + id,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      console.log(response.data);
      setMenuItem(response.data.data);

    } catch (error) {
      console.log(error);
    } finally { 
      setIsLoading(false);
    }
  };

  const fetchReccomendation = async () => {
    setIsLoading(true);

    try {
      const response = await http({
        method: 'get',
        url: '/ref/menus/',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      console.log(response.data);
      setRecommendedDishes(response.data.data);

    } catch (error) {
      console.log(error);
    } finally { 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchReccomendation();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" size={24} />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Memuat menu istimewa...</p>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem('access_token')) {
    Swal.fire({
      icon: 'warning',
      title: 'Akses Ditolak',
      text: 'Anda harus login untuk mengakses halaman ini.',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/login');
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="group flex items-center text-gray-700 hover:text-green-600 transition-all duration-300"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors duration-300 mr-3">
                <ArrowLeft size={20} />
              </div>
              <span className="font-semibold">Kembali ke Menu</span>
            </Link>
            
            {/* <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-full transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-100 text-red-600 scale-110' 
                  : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
              }`}
            >
              <Heart 
                size={24} 
                className={isFavorite ? 'fill-current' : ''} 
              />
            </button> */}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="h-72 md:h-96 lg:h-[500px] w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          <img 
            src={menuItem.image_url} 
            alt={menuItem.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <Clock size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">15-20 min</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">1-2 porsi</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="text-sm font-medium text-gray-700">4.8 (120)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-r from-white to-green-50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                    {menuItem.name}
                  </h1>
                  <SpicyBadge isSpicy={menuItem.is_spicy} />
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  {menuItem.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ChefHat size={16} />
                    <span>Chef Special</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>Fresh Made</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  <PriceFormatter price={menuItem.price} />
                </div>
                <div className="text-sm text-gray-500">per porsi</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Jumlah:</span>
                <div className="flex items-center bg-white rounded-2xl shadow-md p-1">
                  <button 
                    onClick={handleDecreaseQuantity}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      quantity > 1 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  
                  <div className="px-6 py-3">
                    <span className="font-bold text-xl text-gray-800 min-w-8 text-center block">
                      {quantity}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleIncreaseQuantity}
                    className="p-3 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 active:scale-95 transition-all duration-200"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={!menuItem.is_avaible || isLoading}
                className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                  menuItem?.is_avaible 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Loading...</span>
                  </div>
                ) : menuItem?.is_avaible ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Plus size={20} />
                    <span>
                      Tambah ke Keranjang - {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR' 
                      }).format(menuItem.price * quantity)}
                    </span>
                  </div>
                ) : (
                  "Tidak Tersedia"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Menu Rekomendasi Lainnya
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Jelajahi pilihan menu istimewa lainnya yang mungkin Anda sukai
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendedDishes.map((dish) => (
            <div 
              key={dish.id}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <MenuCard item={dish} />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed top-1/4 -left-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="fixed bottom-1/4 -right-20 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
    </div>
  );
}