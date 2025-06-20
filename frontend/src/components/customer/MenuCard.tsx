import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MenuItem } from "../../types";
import PriceFormatter from "./PriceFormatter";
import SpicyBadge from "./SpicyBadge";
import { http } from "../../helpers/axios";
import Swal from "sweetalert2";

export default function MenuCard({ item }: { item: MenuItem }){
    const [isLoading, setIsLoading] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const navigate = useNavigate()

    const handleClickAddCart = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            setIsLoading(true)

            const response = await http({
                method: 'post',
                url: '/carts',
                data: {
                    menu_item_id: item.id,
                    quantity: 1,
                },
                headers: {
                    Authorization : `Bearer ${localStorage.getItem('access_token')}`
                }
            })
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Menu berhasil ditambahkan ke keranjang',
                    confirmButtonText: 'OK'
                })
        } catch (error) {
            console.log(error);
            
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg" onClick={()=>{ navigate('/'+ item.id) }}>
            <div className="relative">
                <img 
                    src={item.image_url}
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                />
                {/* <button
                    onClick={() => setIsFavorite(!isFavorite)} 
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}/>
                </button> */}
                {!item.is_avaible && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-black text-lg">Tidak Tersedia</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <SpicyBadge isSpicy={item.is_spicy} />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center">
                    <PriceFormatter price={item.price} />
                    
                    {item.is_avaible ? (
                            <button 
                                onClick={handleClickAddCart}
                                className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:bg-green-700"
                            >
                                <Plus size={16} />
                                <span>Keranjang</span>
                            </button>
                    ): (
                        <button
                            disabled 
                            className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-sm font-medium cursor-not-allowed"
                            >
                              Tidak Tersedia  
                            </button>
                    )}
                </div>
            </div>
        </div>
    )
}