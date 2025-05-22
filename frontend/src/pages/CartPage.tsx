import { useEffect, useState } from "react";
import { CartItem } from "../types";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";

export default function CartPage(){
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=> {
        const sampleData: CartItem[] = [
            {
                id: 1,
                cart_id: 1,
                menu_item_id: 1,
                quantity: 2,
                special_instructions: "Tanpa cabai",
                menuItem: {
                  id: 1,
                  name: "Rendang Daging",
                  description: "Daging sapi yang dimasak dengan rempah-rempah khas Padang",
                  price: 35000,
                  image_url: "/api/placeholder/200/150",
                  is_avaible: true,
                  category_id: 1,
                  is_spicy: true
                }
              },
              {
                id: 2,
                cart_id: 1,
                menu_item_id: 2,
                quantity: 1,
                special_instructions: "",
                menuItem: {
                  id: 2,
                  name: "Ayam Pop",
                  description: "Ayam yang direbus dalam air dengan rempah kemudian digoreng",
                  price: 25000,
                  image_url: "/api/placeholder/200/150",
                  is_avaible: true,
                  category_id: 1,
                  is_spicy: false
                }
              },
              {
                id: 3,
                cart_id: 1,
                menu_item_id: 3,
                quantity: 2,
                special_instructions: "Level pedas rendah",
                menuItem: {
                  id: 3,
                  name: "Gulai Ikan",
                  description: "Ikan segar masak dalam kuah bumbu kuning khas Minang",
                  price: 30000,
                  image_url: "/api/placeholder/200/150",
                  is_avaible: true,
                  category_id: 2,
                  is_spicy: true
                }
              }
        ]

        setTimeout(() => {
            setCartItems(sampleData);
            setIsLoading(false);
          }, 500);
    }, [])

    const subtotal = cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)
    
    const handleIncrease = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item => 
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }

    const handleDecrease = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item => 
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        )
    }

    const handleRemove = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id))
    }

    const handleInstructionChange = (id: number, instruction: string) => {
        setCartItems(prevItems =>
            prevItems.map(item => 
                item.id === id ? { ...item, special_instructions: instruction } : item
            )
        )
    }

    if(isLoading) {
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </div>
        );
    }

    if (cartItems.length === 0) {
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Keranjang Belanja Kosong</h2>
              <p className="text-gray-600 mb-8">Anda belum menambahkan menu apapun ke keranjang.</p>
              <Link 
                to="/" 
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                <ArrowLeft size={16} className="mr-2" />
                Jelajahi Menu
              </Link>
            </div>
          </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Kolom Kiri: Daftar Item */}
            <div className="w-full lg:w-2/3">
              {cartItems.map(item => (
                <CartItemCard 
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  onInstructionChange={handleInstructionChange}
                />
              ))}
            </div>
            
            {/* Kolom Kanan: Ringkasan Order */}
            <div className="w-full lg:w-1/3">
              <OrderSummary items={cartItems} subtotal={subtotal} />
            </div>
          </div>
        </div>
      );
}