import { Edit, Plus, Search, Trash2, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"

interface Category {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
}

export default function SuperAdminCategories() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await http({
                method: 'GET',
                url: '/categories',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal memuat data kategori. Silakan coba lagi.',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const filteredCategories = categories.filter(category => {
        return category.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const deleteCategory = async (categoryId: number, categoryName: string) => {
        const result = await Swal.fire({
            title: 'Hapus Kategori',
            text: `Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`,
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
                    url: `/categories/${categoryId}`,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Kategori berhasil dihapus',
                    timer: 1500,
                    showConfirmButton: false
                })

                fetchCategories()
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal menghapus kategori',
                })
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">Kategori</h2>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={fetchCategories}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                            <button 
                                onClick={() => navigate('/superadmin/categories/add')}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 mt-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari berdasarkan nama kategori..."
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        #{category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                                <span className="text-orange-600 font-bold">
                                                    {category.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {category.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(category.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/superadmin/categories/edit/${category.id}`)}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id, category.name)}
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Tidak ada kategori yang ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    )
}
