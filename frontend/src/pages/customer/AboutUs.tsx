// pages/AboutUsPage.tsx
import { Award, Clock, Heart, MapPin, Users, Utensils } from 'lucide-react';
import Navbar from '../../components/customer/Navbar';
import SectionTitle from '../../components/customer/SectionTitle';
import FeatureCard from '../../components/customer/FeatureCard';
import StatCard from '../../components/customer/StatCard';
import TeamMember from '../../components/customer/TeamMember';
import Button from '../../components/customer/Button';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

// Types
interface AboutFeature {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface AboutStat {
  id: number;
  number: string;
  label: string;
  description: string;
}

interface TeamMemberType {
  id: number;
  name: string;
  position: string;
  image_url: string;
  description: string;
}

const AboutUsPage = () => {
  const navigate = useNavigate()

  const features: AboutFeature[] = [
    {
      id: 1,
      title: "Warisan Kuliner Minang",
      description: "Melestarikan cita rasa autentik masakan Padang dengan resep turun-temurun yang telah diwariskan selama puluhan tahun.",
      icon: Heart,
      color: "bg-red-100 text-red-600"
    },
    {
      id: 2,
      title: "Bahan Berkualitas Premium", 
      description: "Menggunakan bahan-bahan segar pilihan dan rempah-rempah asli Minangkabau untuk menghasilkan cita rasa terbaik.",
      icon: Award,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: 3,
      title: "Pelayanan Terpercaya",
      description: "Melayani pelanggan dengan sepenuh hati sejak 1995, memberikan pengalaman kuliner yang tak terlupakan.",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 4,
      title: "Tradisi & Inovasi",
      description: "Memadukan tradisi kuliner klasik dengan inovasi modern untuk memenuhi selera masa kini.",
      icon: Utensils,
      color: "bg-green-100 text-green-600"
    }
  ];

  const stats: AboutStat[] = [
    {
      id: 1,
      number: "30+",
      label: "Tahun Pengalaman",
      description: "Melayani dengan dedikasi"
    },
    {
      id: 2,
      number: "50K+",
      label: "Pelanggan Puas",
      description: "Kepercayaan yang terus tumbuh"
    },
    {
      id: 3,
      number: "25+",
      label: "Menu Spesial",
      description: "Hidangan khas Minang"
    },
    {
      id: 4,
      number: "5",
      label: "Cabang Restoran",
      description: "Di berbagai kota"
    }
  ];

  const teamMembers: TeamMemberType[] = [
    {
      id: 1,
      name: "Hj. Siti Aminah",
      position: "Founder & Head Chef",
      image_url: "/api/placeholder/300/300",
      description: "Pemilik resep rahasia dan jiwa dari Raso Minang"
    },
    {
      id: 2,
      name: "Muhammad Rizki",
      position: "Executive Chef",
      image_url: "/api/placeholder/300/300",
      description: "Ahli masakan Padang dengan pengalaman 15 tahun"
    },
    {
      id: 3,
      name: "Dewi Sartika",
      position: "Operations Manager",
      image_url: "/api/placeholder/300/300",
      description: "Memastikan kualitas dan konsistensi di setiap cabang"
    }
  ];

  if(!localStorage.getItem('access_token')) {
    Swal.fire({
      icon: 'warning',
      title: 'Perhatian',
      text: 'Anda harus login untuk mengakses halaman ini.',
      confirmButtonText: 'Login',
      showCancelButton: true,
      cancelButtonText: 'Batal'
    }).then(result => {
        if (result.isConfirmed) {
          navigate('/login')
        }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang Raso Minang
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8">
              Perjalanan cita rasa autentik masakan Padang yang telah menghangatkan hati 
              ribuan keluarga Indonesia selama lebih dari tiga dekade
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-green-100">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Padang, Sumatera Barat</span>
              </div>
              <div className="flex items-center text-green-100">
                <Clock className="h-5 w-5 mr-2" />
                <span>Sejak 1995</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionTitle 
                  title="Kisah Kami" 
                  subtitle="Dari dapur rumah hingga menjadi kebanggaan kuliner Nusantara"
                />
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    Raso Minang dimulai dari dapur sederhana Hj. Siti Aminah di tahun 1995. 
                    Dengan resep warisan nenek yang telah turun-temurun, beliau mulai menyajikan 
                    masakan Padang autentik untuk keluarga dan tetangga.
                  </p>
                  <p>
                    Cita rasa yang khas dan kehangatan pelayanan membuat Raso Minang cepat 
                    dikenal. Dari mulut ke mulut, reputasi kami tumbuh hingga akhirnya membuka 
                    restoran pertama di jantung kota Padang.
                  </p>
                  <p>
                    Kini, setelah 30 tahun perjalanan, Raso Minang telah hadir di 5 kota dengan 
                    komitmen yang sama: menyajikan masakan Padang terbaik dengan cinta dan 
                    ketulusan hati.
                  </p>
                </div>
                <div className="mt-8">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => window.location.href = '/menu'}
                  >
                    Jelajahi Menu Kami
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Sejarah Raso Minang"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">30+</div>
                  <div className="text-sm">Tahun Melayani</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Nilai-Nilai Kami" 
            subtitle="Prinsip yang menjadi fondasi setiap hidangan yang kami sajikan"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature) => (
              <FeatureCard 
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                iconColor={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Pencapaian Kami" 
            subtitle="Angka-angka yang menceritakan perjalanan dan kepercayaan"
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {stats.map((stat) => (
              <StatCard 
                key={stat.id}
                number={stat.number}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Tim Kami" 
            subtitle="Orang-orang hebat di balik kelezatan setiap hidangan"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member) => (
              <TeamMember 
                key={member.id}
                name={member.name}
                position={member.position}
                image_url={member.image_url}
                description={member.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Heart className="h-8 w-8 mr-3 text-green-300" />
                  Visi Kami
                </h3>
                <p className="text-lg leading-relaxed">
                  Menjadi restoran masakan Padang terdepan yang melestarikan dan 
                  menyebarkan kekayaan kuliner Minangkabau ke seluruh Nusantara dan dunia, 
                  sambil tetap mempertahankan keaslian cita rasa dan nilai-nilai budaya.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="h-8 w-8 mr-3 text-green-300" />
                  Misi Kami
                </h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">•</span>
                    Menyajikan masakan Padang berkualitas tinggi dengan cita rasa autentik
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">•</span>
                    Memberikan pelayanan terbaik dengan kehangatan khas budaya Minang
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">•</span>
                    Melestarikan tradisi kuliner untuk generasi mendatang
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Siap Merasakan Cita Rasa Autentik Minang?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Kunjungi cabang terdekat kami atau pesan online untuk menikmati hidangan 
              khas Padang yang telah dipercaya selama puluhan tahun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/menu'}
              >
                Pesan Sekarang
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/kontak'}
              >
                Hubungi Kami
              </Button>
            </div>
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
                <a href="#" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-green-100 hover:text-white">Beranda</a></li>
                <li><a href="/menu" className="text-green-100 hover:text-white">Menu</a></li>
                <li><a href="/promo" className="text-green-100 hover:text-white">Promo</a></li>
                <li><a href="/tentang-kami" className="text-green-100 hover:text-white">Tentang Kami</a></li>
                <li><a href="/kontak" className="text-green-100 hover:text-white">Kontak</a></li>
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
                  <span>Jl. Raya Padang No. 123, Padang, Sumatera Barat</span>
                </li>
                <li className="text-green-100 flex items-start">
                  <span className="mr-2">📞</span>
                  <span>+62 812-3456-7890</span>
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
  );
};

export default AboutUsPage;