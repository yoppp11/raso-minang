import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { CartItem, PaymentResponse } from "../../types";
import Swal from "sweetalert2";
import { http } from "../../helpers/axios";
import { useState } from "react";

export default function OrderSummary({ 
    items,
    subtotal
 }: { 
    items: CartItem[],
    subtotal: number
  }) {
    const deliveryFee = 10000;
    const total = subtotal + deliveryFee;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        deliveryAddress: '',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.deliveryAddress.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Form Belum Lengkap',
                text: 'Alamat pengiriman harus diisi.',
                confirmButtonText: 'OK'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await http({
                method: 'post',
                url: `/orders/token`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log(response.data);

            const transaction: PaymentResponse = response.data;

            window.snap.pay(transaction.token, {
                onSuccess: async function(result){
                    await http({
                        method: 'post',
                        url: `/orders/create`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        },
                        data: {
                            deliveryAddress: formData.deliveryAddress,
                            notes: formData.notes,
                            totalAmount: total,
                            paymentId: transaction.paymentId
                        }
                    })

                  Swal.fire({
                    icon: 'success',
                    title: 'Pembayaran Berhasil',
                    text: 'Terima kasih telah melakukan pembayaran.',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    navigate('/');
                  });
                },
                onClose: function(){
                    Swal.fire({
                        icon: 'info',
                        title: 'Pembayaran Dibatalkan',
                        text: 'Anda telah membatalkan pembayaran.',
                        confirmButtonText: 'OK'
                    });
                }
            });
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal memproses pembayaran. Silakan coba lagi.',
                confirmButtonText: 'OK'
            });
        }
    };
    
    return (
        <div className="bg-white border rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
            
            <div className="border-b pb-4 mb-4">
                <div className="space-y-2">
                {items?.map(item => (
                    <div key={item?.id} className="flex justify-between text-sm">
                    <span>{item?.quantity}x {item?.Menu_Item.name}</span>
                    <span>Rp {(item.Menu_Item.price * item?.quantity).toLocaleString('id-ID')}</span>
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

            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6 border-t pt-6">
                    <h4 className="font-semibold text-md">Informasi Pengiriman</h4>

                    <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            Alamat Pengiriman <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="deliveryAddress"
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange}
                            placeholder="Masukkan alamat lengkap pengiriman"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan (Opsional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                    Lanjutkan ke Pembayaran
                </button>
            </form>

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