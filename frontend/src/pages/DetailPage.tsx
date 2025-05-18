import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ChevronDown, Heart, Minus, Plus, Star } from "lucide-react";
import { MenuItem } from "../types";
import SpicyBadge from "../components/SpicyBadge";
import PriceFormatter from "../components/PriceFormatter";

// Mock data to simulate fetching a menu item by ID
const mockMenu: MenuItem = {
  id: 1,
  name: "Rendang Daging",
  description: "Hidangan daging sapi yang dimasak dengan rempah-rempah khas Minang dan santan hingga kering. Dikenal dengan rasanya yang kaya dan teksturnya yang empuk.",
  price: 45000,
  image_url: "/api/placeholder/800/500",
  is_avaible: true,
  category_id: 1,
  is_spicy: true,
  createdAt: "2023-08-15T12:00:00Z",
  updatedAt: "2023-08-15T12:00:00Z"
};

// Additional mock data for recommended dishes
const recommendedDishes = [
  {
    id: 2,
    name: "Gulai Ayam",
    price: 35000,
    image_url: "/api/placeholder/400/300",
    is_spicy: true
  },
  {
    id: 3,
    name: "Gulai Ikan",
    price: 40000,
    image_url: "/api/placeholder/400/300",
    is_spicy: false
  },
  {
    id: 4,
    name: "Dendeng Balado",
    price: 50000,
    image_url: "/api/placeholder/400/300",
    is_spicy: true
  }
];

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem>(mockMenu);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // In a real app, you would fetch the menu item by id
  // useEffect(() => {
  //   async function fetchMenuItem() {
  //     try {
  //       const response = await fetch(`/api/menu/${id}`);
  //       const data = await response.json();
  //       setMenuItem(data);
  //     } catch (error) {
  //       console.error("Error fetching menu item:", error);
  //     }
  //   }
  //   fetchMenuItem();
  // }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Implement cart functionality here
    console.log(`Added ${quantity} ${menuItem.name} to cart`);
    // Reset quantity or show confirmation
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-700 hover:text-green-600">
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Kembali ke Menu</span>
            </Link>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
            >
              <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : ''}`} size={20} />
              <span className="font-medium">{isFavorite ? 'Favorit' : 'Tambah ke Favorit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero image and basic info */}
      <div className="relative">
        <div className="h-64 md:h-96 w-full bg-gray-200 overflow-hidden">
          <img 
            src={menuItem.image_url} 
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-t-3xl -mt-10 relative z-10 p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{menuItem.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <SpicyBadge isSpicy={menuItem.is_spicy} />
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                    <span className="text-gray-700 font-medium">4.8</span>
                    <span className="text-gray-500 ml-1">(120 ulasan)</span>
                  </div>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-700">
                <PriceFormatter price={menuItem.price} />
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{menuItem.description}</p>
            
            {/* Quantity selector and add to cart */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full">
                <button 
                  onClick={handleDecreaseQuantity}
                  className={`p-1 rounded-full ${quantity > 1 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}
                  disabled={quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="font-medium text-lg min-w-8 text-center">{quantity}</span>
                <button 
                  onClick={handleIncreaseQuantity}
                  className="p-1 rounded-full bg-green-100 text-green-600"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
                disabled={!menuItem.is_avaible}
              >
                {menuItem.is_avaible 
                  ? `Tambah ke Keranjang - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(menuItem.price * quantity)}`
                  : "Tidak Tersedia"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="container mx-auto px-4 mt-6 mb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Nutrition Facts */}
          <div className="border-b border-gray-200">
            <button 
              onClick={() => setShowNutrition(!showNutrition)}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-medium text-lg">Informasi Nutrisi</span>
              <ChevronDown className={`transition-transform ${showNutrition ? 'transform rotate-180' : ''}`} />
            </button>
            
            {showNutrition && (
              <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Kalori</p>
                  <p className="font-medium">320 kkal</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Protein</p>
                  <p className="font-medium">28g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Karbohidrat</p>
                  <p className="font-medium">12g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Lemak</p>
                  <p className="font-medium">18g</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Reviews */}
          <div>
            <button 
              onClick={() => setShowReviews(!showReviews)}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-medium text-lg">Ulasan Pelanggan</span>
              <ChevronDown className={`transition-transform ${showReviews ? 'transform rotate-180' : ''}`} />
            </button>
            
            {showReviews && (
              <div className="p-4 pt-0 space-y-4">
                {/* Review item */}
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="font-medium text-green-600">B</span>
                    </div>
                    <div>
                      <p className="font-medium">Budi Santoso</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-gray-500 text-xs ml-2">2 minggu yang lalu</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Rendangnya luar biasa enak! Dagingnya empuk dan bumbunya meresap. Tidak terlalu pedas jadi cocok untuk semua orang.</p>
                </div>
                
                {/* Review item */}
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <span className="font-medium text-purple-600">A</span>
                    </div>
                    <div>
                      <p className="font-medium">Ani Wijaya</p>
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        {[...Array(1)].map((_, i) => (
                          <Star key={i} size={14} className="text-gray-300" />
                        ))}
                        <span className="text-gray-500 text-xs ml-2">1 bulan yang lalu</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Rendangnya enak, tapi porsinya menurut saya kurang banyak untuk harganya. Rasa bumbunya authentic khas Padang.</p>
                </div>
                
                <button className="text-green-600 font-medium hover:text-green-700 text-sm">
                  Lihat semua ulasan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended dishes */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rekomendasi Menu Lainnya</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedDishes.map((dish) => (
            <Link to={`/menu/${dish.id}`} key={dish.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gray-200">
                <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{dish.name}</h3>
                  {dish.is_spicy && <SpicyBadge isSpicy={dish.is_spicy} />}
                </div>
                <p className="text-green-600 font-medium mt-1">
                  <PriceFormatter price={dish.price} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}