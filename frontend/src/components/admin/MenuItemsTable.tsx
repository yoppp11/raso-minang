import { useEffect, useState } from "react"
import Card from "./Card"
import Button from "./Button"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import Input from "./Input"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { MenuItem } from "../../types"
import { useNavigate } from "react-router"

export default function MenuItemsTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const navigate = useNavigate()

    const fetchData = async () => {
      try {
        const response = await http({
          method: 'GET',
          url: '/menus',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        console.log(response.data.data);
        setMenuItems(response.data.data)
        
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Gagal memuat data menu. Silakan coba lagi.',
        })
        
      }
    }

    useEffect(() => {
      fetchData()
    }, [])
    
    const filteredItems = menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || item.Category?.name === filterCategory
      return matchesSearch && matchesCategory
    })
    
    return (
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <Button onClick={()=> { navigate('/admin/add-menu') }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Menu
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari menu..."
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="Lauk Pauk">Lauk Pauk</option>
              <option value="Gulai">Gulai</option>
              <option value="Sambal">Sambal</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={item.image_url} 
                        alt={item.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {item.name}
                          {item.is_spicy && (
                            <span className="ml-2 text-red-500 text-xs">🌶️ Pedas</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.Category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.is_avaible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_avaible ? 'Tersedia' : 'Habis'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/admin/edit-menu/${item.id}`)}
                        variant="ghost" size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={ async ()=> {
                          Swal.fire({
                            title: 'Hapus Menu',
                            text: `Apakah Anda yakin ingin menghapus menu "${item.name}"?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Hapus',
                            cancelButtonText: 'Batal'
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              try {
                                await http({
                                  method: 'DELETE',
                                  url: `/menus/${item.id}`,
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                                  }
                                })
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Berhasil',
                                  text: 'Menu berhasil dihapus.',
                                })
                                fetchData() 
                              } catch (error) {
                                console.error(error)
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Gagal',
                                  text: 'Terjadi kesalahan saat menghapus menu.',
                                })
                              }
                            }
                          })

                          
                        }} 
                        variant="ghost" 
                        size="sm"
                        >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }