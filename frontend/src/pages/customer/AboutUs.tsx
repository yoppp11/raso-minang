// pages/AboutUsPage.tsx
import { Award, Clock, Heart, MapPin, Users, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import bg from '../../assets/about-us.jpg';
import Button from '../../components/customer/Button';
import FeatureCard from '../../components/customer/FeatureCard';
import Footer from '../../components/customer/Footer';
import Navbar from '../../components/customer/Navbar';
import SectionTitle from '../../components/customer/SectionTitle';
import TeamMember from '../../components/customer/TeamMember';

interface AboutFeature {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
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
      description: "Melayani pelanggan dengan sepenuh hati sejak 2023, memberikan pengalaman kuliner yang tak terlupakan.",
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

  const teamMembers: TeamMemberType[] = [
    {
      id: 1,
      name: "Danang Hidayat",
      position: "Founder & Head Chef",
      image_url: "https://www.kevinashleyphotography.com/wp-content/uploads/2015/11/person.jpg",
      description: "Pemilik resep rahasia dan jiwa dari Raso Minang"
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
              Tentang Rasa Minang
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8">
              Perjalanan cita rasa autentik masakan Padang yang telah menghangatkan hati 
              ribuan keluarga Indonesia selama lebih dari dua tahun
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-green-100">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Madiun, Jawa Timur</span>
              </div>
              <div className="flex items-center text-green-100">
                <Clock className="h-5 w-5 mr-2" />
                <span>Sejak 2023</span>
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
                    Rasa Minang dimulai dari dapur sederhana Danang Hidayat di tahun 2023. 
                    Dengan resep warisan nenek yang telah turun-temurun, beliau mulai menyajikan 
                    masakan Padang autentik untuk keluarga dan tetangga.
                  </p>
                  <p>
                    Cita rasa yang khas dan kehangatan pelayanan membuat Rasa Minang cepat 
                    dikenal. Dari mulut ke mulut, reputasi kami tumbuh hingga akhirnya membuka 
                    restoran pertama di Kabupaten Madiun.
                  </p>
                  <p>
                    Kini, setelah 30 tahun perjalanan, Rasa Minang telah hadir di 2 kota dengan 
                    komitmen yang sama: menyajikan masakan Padang terbaik dengan cinta dan 
                    ketulusan hati.
                  </p>
                </div>
                <div className="mt-8">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={()=> { navigate('/list-menu') }}
                  >
                    Jelajahi Menu Kami
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={bg}
                  alt="Sejarah Raso Minang"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">2+</div>
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

      {/* <section className="py-16 bg-green-50">
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
      </section> */}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Tim Kami" 
            subtitle="Orang-orang hebat di balik kelezatan setiap hidangan"
            centered
          />
          <div className="flex justify-center mt-12">
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
              <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-8 text-green-600">
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
              <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-8 text-green-600">
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

      {/* <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Siap Merasakan Cita Rasa Autentik Minang?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Kunjungi cabang terdekat kami atau pesan online untuk menikmati hidangan 
              khas Padang yang telah dipercaya selama beberapa tahun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/list-menu')}
              >
                Pesan Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default AboutUsPage;