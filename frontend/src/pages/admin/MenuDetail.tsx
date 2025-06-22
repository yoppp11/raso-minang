import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, Edit, Calendar, Tag, DollarSign, Image as ImageIcon } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { MenuItem } from "../../types"
import Button from "../../components/admin/Button"
import Card from "../../components/admin/Card"

export default function MenuDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchMenuDetail = async () => {
        try {
            setLoading(true)
            const response = await http({
                method: 'GET',
                url: `/menus/${id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            setMenuItem(response.data.data)
        } catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal memuat detail menu. Silakan coba lagi.',
            }).then(() => {
                navigate('/admin/menu-items')
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchMenuDetail()
        }
    }, [id])

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat detail menu...</p>
                </div>
            </div>
        )
    }

    if (!menuItem) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Menu tidak ditemukan</p>
                    <Button 
                        onClick={() => navigate('/admin/list-menu')} 
                        className="mt-4"
                    >
                        Kembali ke Daftar Menu
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate('/admin/list-menu')}
                            className="p-2 hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Detail Menu</h1>
                            <p className="text-gray-600">Informasi lengkap menu item</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => navigate(`/admin/edit-menu/${menuItem.id}`)}
                        className="flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Menu
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Gambar Menu
                            </h3>
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                    src={menuItem.image_url} 
                                    alt={menuItem.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = '/placeholder-food.jpg'
                                    }}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-2">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                        {menuItem.name}
                                        {menuItem.is_spicy && (
                                            <span className="text-2xl">🌶️</span>
                                        )}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            menuItem.is_avaible 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {menuItem.is_avaible ? 'Tersedia' : 'Habis'}
                                        </span>
                                        {menuItem.Category?.name && (
                                            <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                                                {menuItem.Category.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Harga</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        Rp {menuItem.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {menuItem.description || 'Tidak ada deskripsi'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Harga</p>
                                                <p className="text-sm text-gray-600">
                                                    Rp {menuItem.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Tag className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Kategori</p>
                                                <p className="text-sm text-gray-600">
                                                    {menuItem.Category?.name || 'Tidak berkategori'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Dibuat</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(menuItem.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Diperbarui</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(menuItem.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Properti</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            menuItem.is_avaible 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {menuItem.is_avaible ? '✅ Tersedia' : '❌ Tidak Tersedia'}
                                        </span>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            menuItem.is_spicy 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {menuItem.is_spicy ? '🌶️ Pedas' : '😌 Tidak Pedas'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}