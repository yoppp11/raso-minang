import { Category } from "../types";

export default function CategoryFilter({ 
    categories, 
    selectedCategory, 
    onSelectCategory 
}: { 
    categories: Category[], 
    selectedCategory: number | null, 
    onSelectCategory: (id: number | null) => void 
}) {
    return (
        <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
            <button
                onClick={() => onSelectCategory(null)} 
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${selectedCategory === null ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
                Semua Menu
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                        selectedCategory === category.id 
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}