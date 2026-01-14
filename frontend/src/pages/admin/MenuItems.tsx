import { useEffect, useState } from "react"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { MenuItem } from "../../types"
import { useNavigate } from "react-router"
import Card from "../../components/admin/Card"
import Button from "../../components/admin/Button"
import Input from "../../components/admin/Input"

export default function MenuItemsTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const navigate = useNavigate()

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await http({
                method: 'GET',
                url: '/menus',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            setMenuItems(response.data.data)
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal memuat data menu. Silakan coba lagi.',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (id: number) => {
        navigate(`/admin/edit-menu/${id}`)
    }

    const handleView = (id: number) => {
        navigate(`/admin/menu/${id}`)
    }

    const handleDelete = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: 'Hapus Menu?',
            text: `Apakah Anda yakin ingin menghapus menu "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
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
                    title: 'Berhasil!',
                    text: 'Menu berhasil dihapus.',
                    timer: 2000,
                    showConfirmButton: false
                })
                
                fetchData() 
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menghapus',
                    text: 'Terjadi kesalahan saat menghapus menu. Silakan coba lagi.',
                })
            }
        }
    }

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) return

        const result = await Swal.fire({
            title: 'Hapus Menu Terpilih?',
            text: `Apakah Anda yakin ingin menghapus ${selectedItems.length} menu? Tindakan ini tidak dapat dibatalkan.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus Semua',
            cancelButtonText: 'Batal'
        })

        if (result.isConfirmed) {
            try {
                await Promise.all(
                    selectedItems.map(id => 
                        http({
                            method: 'DELETE',
                            url: `/menus/${id}`,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                            }
                        })
                    )
                )
                
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: `${selectedItems.length} menu berhasil dihapus.`,
                    timer: 2000,
                    showConfirmButton: false
                })
                
                setSelectedItems([])
                fetchData()
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menghapus',
                    text: 'Terjadi kesalahan saat menghapus menu. Silakan coba lagi.',
                })
            }
        }
    }

    const toggleItemSelection = (id: number) => {
        setSelectedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        setSelectedItems(
            selectedItems.length === filteredItems.length 
                ? [] 
                : filteredItems.map(item => item.id)
        )
    }

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "all" || item.Category?.name === filterCategory
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(menuItems.map(item => item.Category?.name)))

    if (loading) {
        return (
            <Card className="overflow-hidden">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Kelola menu makanan Raso Minang
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {selectedItems.length > 0 && (
                            <Button 
                                variant="outline" 
                                onClick={handleBulkDelete}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus ({selectedItems.length})
                            </Button>
                        )}
                        <Button onClick={() => navigate('/admin/add-menu')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Menu
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <div className="flex-1">
                        <Input
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama menu..."
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white min-w-[160px]"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Total: {filteredItems.length} menu</span>
                        <span>•</span>
                        <span>Tersedia: {filteredItems.filter(item => item.is_avaible).length}</span>
                        <span>•</span>
                        <span>Habis: {filteredItems.filter(item => !item.is_avaible).length}</span>
                    </div>
                    {selectedItems.length > 0 && (
                        <span className="text-sm font-medium text-green-600">
                            {selectedItems.length} item dipilih
                        </span>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Tidak ada menu ditemukan
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterCategory !== 'all' 
                                ? 'Coba ubah kata kunci pencarian atau filter kategori'
                                : 'Mulai dengan menambahkan menu baru'
                            }
                        </p>
                        {(!searchTerm && filterCategory === 'all') && (
                            <Button onClick={() => navigate('/admin/add-menu')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Menu Pertama
                            </Button>
                        )}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Menu
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Harga
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className={`hover:bg-gray-50 transition-colors ${
                                        selectedItems.includes(item.id) ? 'bg-green-50' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => toggleItemSelection(item.id)}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                <img 
                                                    className="h-16 w-16 rounded-xl object-cover shadow-sm border border-gray-100" 
                                                    src={item.image_url} 
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-food.jpg'
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                                    {item.name}
                                                    {item.is_spicy && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            🌶️ Pedas
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.Category?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            item.is_avaible 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                item.is_avaible ? 'bg-green-400' : 'bg-red-400'
                                            }`}></span>
                                            {item.is_avaible ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleView(item.id)}
                                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEdit(item.id)}
                                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    )
}