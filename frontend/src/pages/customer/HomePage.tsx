import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import HeroSection from '../../components/customer/HeroSection';
import MenuCard from '../../components/customer/MenuCard';
import Navbar from '../../components/customer/Navbar';
import ChatWidget from '../../components/customer/ChatWidget';
import { http } from '../../helpers/axios';
import { MenuItem } from '../../types';
import '../../App.css';
import { useNavigate } from 'react-router';
import Footer from '../../components/customer/Footer';


function HomePage() {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
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
            <p className="text-xl text-gray-500">Tidak ada menu yang ditemukan</p>
          </div>
        )}
      </section>
      
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Kenapa Memilih Rasa Minang?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyajikan masakan Padang autentik dengan kualitas terbaik sejak tahun 2023
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
      
      <Footer />
      <ChatWidget isLoggedIn={!!localStorage.getItem('access_token')} />
    </div>
  )
}

export default HomePage
