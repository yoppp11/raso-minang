import { MenuIcon, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden mr-4 text-gray-700"
                            >
                                <MenuIcon />
                        </button>
                        <h1 className="text-2xl font-bold text-green-700">Raso Minang</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to={'/'} className="text-gray-700 hover:text-green-600 font-medium">Beranda</Link>
                        <Link to={'/'} className="text-gray-700 hover:text-green-600 font-medium">Menu</Link>
                        <Link to={'/'} className="text-gray-700 hover:text-green-600 font-medium">Promo</Link>
                        <Link to={'/about-us'} className="text-gray-700 hover:text-green-600 font-medium">Tentang Kami</Link>
                        <Link to={'/'} className="text-gray-700 hover:text-green-600 font-medium">Kontak</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <input 
                                type="text"
                                placeholder="Cari menu..."
                                className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" />
                        </div>

                        <button className="relative" onClick={()=> { navigate('/cart') }}>
                            <ShoppingBag className="text-gray-700" />
                            {/* <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-ful w-5 h-5 flex items-center justify-center text-xs font-bold">
                                2
                            </span> */}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white z-50 pt-20">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsMenuOpen(false)} 
                            >
                                <X className="text-gray-700"/>
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-6 p-4">
                        <Link
                            to={'/'} 
                            className="text-gray-700 hover:text-green-600 font-medium text-xl"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            to={'/'} 
                            className="text-gray-700 hover:text-green-600 font-medium text-xl"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Meuu
                        </Link>
                        <Link
                            to={'/'} 
                            className="text-gray-700 hover:text-green-600 font-medium text-xl"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Promo
                        </Link>
                        <Link
                            to={'/about-us'} 
                            className="text-gray-700 hover:text-green-600 font-medium text-xl"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            to={'/'} 
                            className="text-gray-700 hover:text-green-600 font-medium text-xl"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Kontak
                        </Link>

                        <div className="w-full mt-4">
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Cari menu..."
                                    className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:rinf-2 focus:ring-green-500"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}