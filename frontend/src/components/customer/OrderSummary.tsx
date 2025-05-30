import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { CartItem } from "../../types";

export default function OrderSummary({ 
    items,
    subtotal
 }: { 
    items: CartItem[],
    subtotal: number
  }) {
    const deliveryFee = 10000;
    const total = subtotal + deliveryFee;
    
    return (
        <div className="bg-white border rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
            
            <div className="border-b pb-4 mb-4">
                <div className="space-y-2">
                {items?.map(item => (
                    <div key={item?.id} className="flex justify-between text-sm">
                    <span>{item?.quantity}x {item?.Menu_Item.name}</span>
                    <span>Rp {(item?.Menu_Item.price * item?.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rp {subtotal?.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Biaya pengiriman</span>
                    <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Total</span>
                    <span className="text-green-700">Rp {total.toLocaleString('id-ID')}</span>
                </div>
            </div>
            
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition">
                Lanjutkan ke Pembayaran
            </button>
            
            <Link 
                to="/" 
                className="flex items-center justify-center mt-4 text-green-600 hover:text-green-800"
            >
                <ArrowLeft size={16} className="mr-1" />
                <span>Lanjutkan Belanja</span>
            </Link>
        </div>
    );
  }