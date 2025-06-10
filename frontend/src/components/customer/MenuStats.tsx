interface MenuStatsProps {
    totalItems: number;
    filteredItems: number;
    searchQuery: string;
  }
  
  export function MenuStats({ totalItems, filteredItems, searchQuery }: MenuStatsProps) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-green-800 font-medium">
              Menampilkan {filteredItems} dari {totalItems} menu
            </p>
            {searchQuery && (
              <p className="text-green-600 text-sm">
                Hasil pencarian untuk: "<span className="font-semibold">{searchQuery}</span>"
              </p>
            )}
          </div>
          {filteredItems === 0 && (
            <div className="text-green-600 text-sm">
              Tidak ada menu yang sesuai dengan kriteria
            </div>
          )}
        </div>
      </div>
    );
  }