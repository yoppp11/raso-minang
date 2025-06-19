import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Category, FilterOptions } from "../../types";
import { Select } from "./Select";
import CategoryFilter from "./CategoryFilter";
  
interface FilterPanelProps {
filters: FilterOptions;
onFiltersChange: (filters: FilterOptions) => void;
categories: Category[];
}

export function FilterPanel({ filters, onFiltersChange, categories }: FilterPanelProps) {
const [isOpen, setIsOpen] = useState(false);

const spicyOptions = [
    { id: 0, name: "Semua" },
    { id: 1, name: "🌶️ Pedas" },
    { id: 2, name: "😊 Tidak Pedas" },
  ];
  
  const availabilityOptions = [
    { id: 0, name: "Semua" },
    { id: 1, name: "✅ Tersedia" },
    { id: 2, name: "❌ Habis" },
  ];

const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
};

const resetFilters = () => {
    onFiltersChange({
    category: "",
    isSpicy: null,
    isAvaible: null,
    priceRange: [0, 100000],
    sortBy: "name",
    sortOrder: "asc"
    });
};

const hasActiveFilters = filters.category !== "" || filters.isSpicy !== null || filters.isAvaible !== null;

return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Filter Menu</h3>
                {hasActiveFilters && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Aktif
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                    <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                    Reset
                    </button>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
                </button>
            </div>
        </div>

        <div className={`space-y-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <Select
                    value={filters.category}
                    onChange={(value) => updateFilter("category", value)}
                    options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                    placeholder="Semua Kategori"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level Pedas</label>
            <div className="flex flex-wrap gap-2">
                <CategoryFilter
                    categories={spicyOptions}
                    selectedCategory={
                    filters.isSpicy === null ? 0 : filters.isSpicy === true ? 1 : 2
                    }
                    onSelectCategory={(id) => {
                    if (id === 0) updateFilter("isSpicy", null);
                    else if (id === 1) updateFilter("isSpicy", true);
                    else if (id === 2) updateFilter("isSpicy", false);
                    }}
                />
                </div>
            </div>

            {/* Availability Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ketersediaan</label>
                <div className="flex flex-wrap gap-2">
                    <CategoryFilter
                        categories={availabilityOptions}
                        selectedCategory={
                        filters.isAvaible === null ? 0 : filters.isAvaible === true ? 1 : 2
                        }
                        onSelectCategory={(id) => {
                        if (id === 0) updateFilter("isAvaible", null);
                        else if (id === 1) updateFilter("isAvaible", true);
                        else if (id === 2) updateFilter("isAvaible", false);
                        }}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                <div className="grid grid-cols-2 gap-2">
                    <Select
                    value={filters.sortBy}
                    onChange={(value) => updateFilter("sortBy", value as any)}
                    options={[
                        { value: "name", label: "Nama" },
                        { value: "price", label: "Harga" },
                        { value: "rating", label: "Rating" }
                    ]}
                    />
                    <Select
                    value={filters.sortOrder}
                    onChange={(value) => updateFilter("sortOrder", value as any)}
                    options={[
                        { value: "asc", label: "A-Z / Rendah-Tinggi" },
                        { value: "desc", label: "Z-A / Tinggi-Rendah" }
                    ]}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rentang Harga: Rp {filters.priceRange[0].toLocaleString()} - Rp {filters.priceRange[1].toLocaleString()}
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter("priceRange", [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    </div>
);
}