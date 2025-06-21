import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import CategoryFilter from '../../components/customer/CategoryFilter';
import HeroSection from '../../components/customer/HeroSection';
import MenuCard from '../../components/customer/MenuCard';
import Navbar from '../../components/customer/Navbar';
import { http } from '../../helpers/axios';
import { Category, MenuItem } from '../../types';
import '../../App.css';
import { Link, useNavigate } from 'react-router';


const categories: Category[] = [
  { id: 1, name: "Nasi" },
  { id: 2, name: "Lauk Pauk" },
  { id: 3, name: "Sayuran" },
  { id: 4, name: "Minuman" },
  { id: 5, name: "Sambal" }
];

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [spicyFilter, setSpicyFilter] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const menuSectionRef = useRef<HTMLDivElement>(null)

  const fetchData = async ()=> {
    try {
        const response = await http({
            method: 'get',
            url: '/pub/menus',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        console.log(response);
        

        setFilteredItems(response.data.data)
        
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Terjadi kesalahan saat mengambil data!',
            confirmButtonText: 'Tutup'
        })
        
    }
  }

  useEffect(()=> {
    fetchData()

    // let filtered = menuItems

    // if(selectedCategory !== null) filtered = filtered.filter(item => item.category_id === selectedCategory)
  }, [])

  if(!localStorage.getItem('access_token')) {
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Perhatian',
    //   text: 'Anda harus masuk terlebih dahulu untuk mengakses halaman ini.',
    //   confirmButtonText: 'Masuk',
    //   preConfirm: () => {
    //   }
    // });
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection scrollToMenu={()=> menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}/>
      
      <section ref={menuSectionRef} className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Jelajahi Menu Kami</h2>
          
          {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSpicyFilter(spicyFilter === true ? null : true)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                  spicyFilter === true 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Pedas</span>
              </button>
              
              <button 
                onClick={() => setSpicyFilter(spicyFilter === false ? null : false)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                  spicyFilter === false 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Tidak Pedas</span>
              </button>
            </div>
          </div> */}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Tidak ada menu yang sesuai dengan filter</p>
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setSpicyFilter(null);
              }}
              className="mt-4 text-green-600 font-medium"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>
      
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Kenapa Memilih Raso Minang?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyajikan masakan Padang autentik dengan kualitas terbaik sejak tahun 1995
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Bahan Premium",
                description: "Kami hanya menggunakan bahan-bahan berkualitas tinggi dan segar untuk setiap hidangan"
              },
              {
                title: "Resep Tradisional",
                description: "Resep turun-temurun yang terjaga keasliannya dari generasi ke generasi"
              },
              {
                title: "Cita Rasa Autentik",
                description: "Rasakan keaslian cita rasa masakan Minang dengan bumbu rempah pilihan"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="bg-green-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Raso Minang</h3>
              <p className="text-green-100 mb-6">
                Restoran dengan menu masakan Padang autentik yang menyajikan cita rasa asli Minangkabau.
              </p>
              <div className="flex space-x-4">
                <Link to="" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </Link>
                <Link to="" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </Link>
                <Link to="" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-green-100 hover:text-white">Beranda</Link></li>
                <li><Link to="/menu" className="text-green-100 hover:text-white">Menu</Link></li>
                <li><Link to="/about-us" className="text-green-100 hover:text-white">Tentang Kami</Link></li>
                <li><Link to="/my-order" className="text-green-100 hover:text-white">Pesanan Saya</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
              <ul className="space-y-2">
                <li className="text-green-100">Senin - Jumat: 10:00 - 22:00</li>
                <li className="text-green-100">Sabtu - Minggu: 08:00 - 23:00</li>
                <li className="text-green-100">Hari Libur: 09:00 - 22:00</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2">
                <li className="text-green-100 flex items-start">
                  <span className="mr-2">📍</span>
                  <span>Jl. Pandan No. 210, Kabupaten Madiun, Jawa Timur</span>
                </li>
                <li className="text-green-100 flex items-start">
                  <span className="mr-2">📞</span>
                  <span>+62 822-4829-6010</span>
                </li>
                <li className="text-green-100 flex items-start">
                  <span className="mr-2">✉️</span>
                  <span>info@rasominang.id</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-12 pt-6 text-center">
            <p className="text-green-100">© 2025 Raso Minang. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
