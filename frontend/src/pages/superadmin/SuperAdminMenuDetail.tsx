import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { MenuItem } from "../../types"

export default function SuperAdminMenuDetail() {
    const { id } = useParams()
    const [menu, setMenu] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchMenu = async () => {
        try {
            setLoading(true)
            const response = await http({
                method: 'get',
                url: `/menus/${id}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            setMenu(response.data.data)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load menu details'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMenu()
    }, [id])

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Hapus Menu',
            text: `Apakah Anda yakin ingin menghapus "${menu?.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        })

        if (result.isConfirmed) {
            try {
                await http({
                    method: 'DELETE',
                    url: `/menus/${id}`,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Menu berhasil dihapus',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/superadmin/menu')
                })
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal menghapus menu',
                })
            }
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    if (!menu) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Menu not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/superadmin/menu')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
                        <p className="text-sm text-gray-600">Menu Detail</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/superadmin/menu/edit/${id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <img
                            src={menu.image_url}
                            alt={menu.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    menu.is_avaible
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {menu.is_avaible ? 'Tersedia' : 'Tidak Tersedia'}
                                </span>
                                {menu.is_spicy && (
                                    <span className="text-red-500 text-lg">🌶️ Pedas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Menu</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nama Menu</label>
                                <p className="text-gray-900 mt-1">{menu.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                <p className="text-gray-900 mt-1">{menu.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Harga</label>
                                    <p className="text-2xl font-bold text-orange-600 mt-1">
                                        {formatCurrency(menu.price)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Kategori</label>
                                    <p className="mt-1">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            {menu.Category?.name}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Menu Pedas</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    menu.is_spicy ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {menu.is_spicy ? 'Ya' : 'Tidak'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Status Ketersediaan</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    menu.is_avaible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {menu.is_avaible ? 'Tersedia' : 'Habis'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Dibuat</label>
                                <p className="text-gray-900 mt-1">{menu.createdAt ? formatDate(menu.createdAt) : '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Terakhir Diubah</label>
                                <p className="text-gray-900 mt-1">{menu.updatedAt ? formatDate(menu.updatedAt) : '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
