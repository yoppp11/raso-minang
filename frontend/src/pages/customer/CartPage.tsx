import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import CartItemCard from "../../components/customer/CartItemCard";
import OrderSummary from "../../components/customer/OrderSummary";
import { CartItem } from "../../types";
import Swal from "sweetalert2";
import { http } from "../../helpers/axios";

export default function CartPage(){
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const response = await http({
          method: 'get',
          url: '/carts',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        console.log(response.data);
        

        setCartItems(response.data)

      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Gagal memuat keranjang belanja. Silakan coba lagi.',
          confirmButtonText: 'OK'
        })
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(()=> {
        fetchCartItems();
    }, [])

    const subtotal = cartItems?.reduce((acc, item) => acc + (item.Menu_Item.price * item.quantity), 0)
    
    const handleIncrease = async (id: number) => {
      try {
        setCartItems(prevItems =>
            prevItems.map(item => 
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        )

        const response = await http({
          method: 'patch',
          url: `/carts/${id}/inc`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      
      } catch (error) {
        console.log(error);
           
      }
    }

    const handleDecrease = async (id: number) => {
      try {
        setCartItems(prevItems =>
            prevItems.map(item => 
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        )

        const response = await http({
          method: 'patch',
          url: `/carts/${id}/dec`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      } catch (error) {
        console.log(error);
        
      }
    }

    const handleRemove = async (id: number) => {
      try {
        const confirmed = await Swal.fire({
          title: 'Konfirmasi Hapus',
          text: 'Apakah Anda yakin ingin menghapus item ini dari keranjang?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Hapus',
          cancelButtonText: 'Batal'
        })

        if (!confirmed.isConfirmed) return;

        setCartItems(prevItems => prevItems.filter(item => item.id !== id))

        const response = await http({
          method: 'delete',
          url: `/carts/${id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        Swal.fire({
          icon: 'success',
          title: 'Item Dihapus',
          text: 'Item berhasil dihapus dari keranjang.',
          confirmButtonText: 'OK'
        })

        fetchCartItems()
        
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Gagal menghapus item dari keranjang. Silakan coba lagi.',
          confirmButtonText: 'OK'
        })
        
      }
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

    if (cartItems?.length === 0) {
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

    if(!localStorage.getItem('access_token')) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Anda harus login untuk mengakses keranjang belanja.',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Batal'
      }).then(result => {
          if (result.isConfirmed) {
            navigate('/login')
          }
      })
    }

    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {cartItems?.map(item => (
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
            
            <div className="w-full lg:w-1/3">
              <OrderSummary items={cartItems} subtotal={subtotal} />
            </div>
          </div>
        </div>
      );
}