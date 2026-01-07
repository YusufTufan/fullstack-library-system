import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar'; // Akıllı Navbar bileşenimiz

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">
      
      {/* 1. ÜST MENÜ: Elle yazdığın HTML'i sildik, yerine akıllı bileşeni koyduk */}
      <Navbar />

      {/* 2. DEĞİŞEN İÇERİK: Sayfalar BURADA görünecek */}
      <main className="flex-grow container mx-auto p-6 mt-4">
        {/* Outlet OLMAZSA sayfalar (HomePage, Login vs.) görünmez! */}
        <Outlet />
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto border-t border-gray-700">
        &copy; 2026 Kütüphane Projesi
      </footer>
      
      {/* Bildirim Kutusu */}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MainLayout;