import { Edit, Filter, Plus, Search, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import Button from "../../components/admin/Button"
import Card from "../../components/admin/Card"
import Input from "../../components/admin/Input"
import { http } from "../../helpers/axios"

interface Category {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function CategoriesTable() {
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

      console.log(response.data.categories)
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
      } catch (error) {
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
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Kategori</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchCategories}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/admin/add-category')}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama kategori..."
            />
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Dibuat
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{category.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/edit-category/${category.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(category.id, category.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {filteredCategories.map((category) => (
          <div key={category.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  #{category.id.toString().padStart(3, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/edit-category/${category.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCategory(category.id, category.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="font-medium text-gray-900 mb-2">{category.name}</div>
              <div className="text-xs text-gray-500">{formatDate(category.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Tidak ada kategori yang ditemukan</p>
        </div>
      )}
    </Card>
  )
}