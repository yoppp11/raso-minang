import { MenuIcon, Search, ShoppingBag, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = (): void => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user'); // optional, if it exists
        setIsLoggedIn(false);
        setIsUserMenuOpen(false);
        navigate('/', { replace: true });
    };

    const handleLogin = (): void => {
        navigate('/login');
    };

    const closeMenus = (): void => {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden mr-4 text-gray-700 hover:text-green-600 transition-colors"
                        >
                            <MenuIcon />
                        </button>
                        <Link to="/" className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors">
                            Raso Minang
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to='/' className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                            Beranda
                        </Link>
                        <Link to='/menu' className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                            Menu
                        </Link>
                        <Link to='/about-us' className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                            Tentang Kami
                        </Link>
                        <Link to='/my-order' className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                            Pesanan Saya
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* <div className="relative hidden md:block">
                            <input 
                                type="text"
                                placeholder="Cari menu..."
                                className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div> */}

                        {isLoggedIn && (
                            <button 
                                className="relative hover:text-green-600 transition-colors" 
                                onClick={() => navigate('/cart')}
                            >
                                <ShoppingBag className="text-gray-700" />
                            </button>
                        )}

                        <div className="relative">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                                    >
                                        <User size={20} />
                                        <span className="hidden md:block font-medium">
                                            Akun
                                        </span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">Akun</p>
                                                <p className="text-xs text-gray-500">user@example.com</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                <User size={16} className="mr-2" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/my-order"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                <ShoppingBag size={16} className="mr-2" />
                                                Pesanan Saya
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white z-50 pt-20">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-700 hover:text-green-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-6 p-4">
                        {isLoggedIn && (
                            <div className="text-center pb-4 border-b border-gray-200 w-full">
                                <div className="flex items-center justify-center mb-2">
                                    <User size={24} className="text-green-600" />
                                </div>
                                <p className="font-medium text-gray-900">Akun</p>
                                <p className="text-sm text-gray-500">user@example.com</p>
                            </div>
                        )}

                        <Link to='/' className="text-gray-700 hover:text-green-600 font-medium text-xl transition-colors" onClick={closeMenus}>
                            Beranda
                        </Link>
                        <Link to='/menu' className="text-gray-700 hover:text-green-600 font-medium text-xl transition-colors" onClick={closeMenus}>
                            Menu
                        </Link>
                        {isLoggedIn && (
                            <Link to='/my-order' className="text-gray-700 hover:text-green-600 font-medium text-xl transition-colors" onClick={closeMenus}>
                                My Order
                            </Link>
                        )}
                        <Link to='/about-us' className="text-gray-700 hover:text-green-600 font-medium text-xl transition-colors" onClick={closeMenus}>
                            Tentang Kami
                        </Link>

                        {/* <div className="w-full mt-4">
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Cari menu..."
                                    className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div> */}

                        <div className="w-full pt-4 border-t border-gray-200">
                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-center w-full py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        onClick={closeMenus}
                                    >
                                        <User size={18} className="mr-2" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center w-full py-2 text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut size={18} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isUserMenuOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}
