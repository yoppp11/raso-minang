import { Star } from "lucide-react";

export default function HeroSection(){
    return (
        <div className="relative bg-green-900 text-white">
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src="/api/placeholder/1920/600" 
                    alt="Masakan Padang"
                    className="w-full h-full object-cover opacity-20" 
                />
            </div>

            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Masakan Padang Asli Raso Minang</h1>
                    <p className="text-lg md:text-xl mb-8 text-green-50">
                        Nikmati cita rasa autentik masakan Padang dengan bahan-bahan berkualitas dan resep turun temurun yang sudah terjaga selama puluhan tahun.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                            Pesan Sekarang
                        </button>
                        <button className="bg-white hover:bg-gray-100 text-green-800 px-6 py-3 rounded-full font-medium transition-colors">
                            Lihat Menu
                        </button>
                    </div>

                    <div className="mt-12 flex items-center space-x-6">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-40 text-yellow-400" />
                            ))}
                        </div>
                        <span className="ml-2 font-medium">4.9</span>
                    </div>

                    <div className="bg-green-800 px-4 py-1 rounded-full">
                        <span>500+ Pelanggan Puas</span>
                    </div>
                </div>
            </div>
        </div>
    )
}