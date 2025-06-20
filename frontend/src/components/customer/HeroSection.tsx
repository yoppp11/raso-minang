import { Star, Menu, ShoppingCart } from "lucide-react";
import bg from "../../assets/bg-hero.jpg";
import { useNavigate } from "react-router";

export default function HeroSection() {
    const navigate = useNavigate()

  return (
    <section className="relative bg-green-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt="Masakan Padang"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-green-900/60" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Masakan Padang <span className="text-yellow-400">Raso Minang</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8">
            Nikmati cita rasa autentik dengan bahan pilihan dan resep warisan turun-temurun yang tak lekang oleh waktu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all"
                >
              <ShoppingCart size={18} /> Pesan Sekarang
            </button>
            <button
                onClick={() => navigate('/menu')} 
                className="bg-white hover:bg-gray-100 text-green-800 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all"
                >
              <Menu size={18} /> Lihat Menu
            </button>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-medium">4.9 dari 500+ ulasan</span>
            </div>
            <span className="bg-green-800 text-sm px-4 py-1 rounded-full font-medium">
              500+ Pelanggan Puas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
