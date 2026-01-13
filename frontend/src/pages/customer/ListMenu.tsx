
  // pages/MenuPage.tsx
  import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FilterPanel } from "../../components/customer/FilterPanel";
import MenuCard from "../../components/customer/MenuCard";
import { MenuStats } from "../../components/customer/MenuStats";
import Navbar from "../../components/customer/Navbar.tsx";
import { SearchInput } from "../../components/customer/SearchInput.tsx";
import ChatWidget from "../../components/customer/ChatWidget.tsx";
import { http } from "../../helpers/axios.ts";
import { Category, FilterOptions, MenuItem } from "../../types";
  
  const sampleMenuItems: MenuItem[] = [
    {
      id: 1,
      name: "Rendang Daging",
      description: "Rendang daging sapi yang empuk dengan bumbu rempah khas Padang",
      price: 25000,
      image_url: "https://example.com/rendang.jpg",
      category_id: 1,
      Category: {
        id: 1,
        name: "Daging"
      },
      is_avaible: true,
      is_spicy: true,
    }
  ];
  
  export default function ListMenu() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({
      category: "",
      isSpicy: null,
      isAvaible: null,
      priceRange: [0, 100000],
      sortBy: "name",
      sortOrder: "asc"
    });

    const getCategorires = async () => {
      try {
        setLoading(true);

        const response = await http({
          method: "get",
          url: "/categories",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        const data: Category[] = response.data.data
        console.log(data);
        

        setCategories(data)

      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Gagal memuat kategori",
          text: "Terjadi kesalahan saat mengambil data kategori. Silakan coba lagi nanti.",
          confirmButtonText: "OK"
        })
      } finally {
        setLoading(false);
      }
    }

    const getMenus = async () => {
      try {
        setLoading(true);

        const response = await http({
          method: "get",
          url: "/menus",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        const data: MenuItem[] = response.data.data
        console.log(data);
        

        setMenus(data)
        
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Gagal memuat menu",
          text: "Terjadi kesalahan saat mengambil data menu. Silakan coba lagi nanti.",
          confirmButtonText: "OK"
        })
        
      } finally {
        setLoading(false);
      }
    }
  
    const filteredItems = useMemo(() => {
      let filtered = menus.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !filters.category || item.Category?.name === filters.category;
        
        const matchesSpicy = filters.isSpicy === null || item.is_spicy === filters.isSpicy;
        
        const matchesAvailability = filters.isAvaible === null || item.is_avaible === filters.isAvaible;
        
        const matchesPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
  
        return matchesSearch && matchesCategory && matchesSpicy && matchesAvailability && matchesPrice;
      });
  
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "price":
            comparison = a.price - b.price;
            break;
          case "rating":
            comparison = (4) - (5);
            break;
        }
  
        return filters.sortOrder === "desc" ? -comparison : comparison;
      });
  
      return filtered;
    }, [searchQuery, filters]);

    useEffect(()=> {
      getCategorires();
      getMenus()
    }, [])

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Masakan Padang</h1>
              <p className="text-gray-600">Nikmati cita rasa autentik masakan Padang yang menggugah selera</p>
            </div>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  categories={categories}
                />
              </div>
            </div>
  
            <div className="lg:col-span-3 space-y-6">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari rendang, ayam pop, gulai..."
                className="w-full"
              />
  
              <MenuStats
                totalItems={menus.length}
                filteredItems={filteredItems.length}
                searchQuery={searchQuery}
              />
  
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu tidak ditemukan</h3>
                  <p className="text-gray-600 mb-4">
                    Coba ubah kata kunci pencarian atau filter yang dipilih
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({
                        category: "",
                        isSpicy: null,
                        isAvaible: null,
                        priceRange: [0, 100000],
                        sortBy: "name",
                        sortOrder: "asc"
                      });
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ChatWidget isLoggedIn={!!localStorage.getItem('access_token')} />
      </div>
    );
  }