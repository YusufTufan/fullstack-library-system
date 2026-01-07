import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Şu anki Kullanıcı Bilgisi:", user);

  const handleLogout = () => {
    logout(); // Hafızayı temizle (Token silinir)
    toast.info('Çıkış yapıldı.');
    navigate('/login'); // Giriş sayfasına at
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* SOL TARA: Logo ve İsim */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-100 transition">
          📚 Kütüphane Sistemi
        </Link>

        {/* SAĞ TARAF: Menüler */}
        <div className="flex items-center gap-4">
          
          {user ? (
            // --- GİRİŞ YAPMIŞ KULLANICI GÖRÜNÜMÜ ---
            <>
              <Link 
                to="/profile" 
                className="text-white hover:text-yellow-300 font-semibold flex items-center gap-1 mr-2"
              >
                👤 Profilim
              </Link>
              {/* 1. Admin ise Panel Butonu Çıksın */}
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm font-semibold transition border border-purple-500"
                >
                  ⚙️ Admin Paneli
                </Link>
              )}

              {/* 2. Hoşgeldin Mesajı */}
              <div className="hidden md:block text-blue-100 text-sm">
                Hoşgeldin, <span className="font-bold text-white">{user.email}</span>
              </div>

              {/* 3. Çıkış Yap Butonu */}
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            // --- GİRİŞ YAPMAMIŞ (ZİYARETÇİ) GÖRÜNÜMÜ ---
            <>
              <Link to="/login" className="hover:text-blue-200 font-medium transition">
                Giriş Yap
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition"
              >
                Kayıt Ol
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;