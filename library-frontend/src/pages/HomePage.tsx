import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AxiosError } from 'axios';

// Tipler
interface Book {
  id: number;
  title: string;
  description: string;
  publishYear: number;
  imageUrl: string;
  category?: { name: string };
  author?: { name: string }[];
  isAvailable: boolean;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Kitapları Backend'den Çek
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Kitaplar yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBorrow = async (bookId: number) => {
    if (!user) return; // Kullanıcı yoksa işlem yapma (zaten buton görünmez ama önlem)

    try {
      // Backend'e { bookId: 5 } gibi veri gönderiyoruz
      await axiosInstance.post('/loans', { bookId });
      toast.success('Kitap ödünç alındı! Profilinden görebilirsin. 🎉');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      // Backend "Bu kitap başkasında" derse o hatayı ekrana bas
      toast.error(error.response?.data?.message || 'Ödünç alma başarısız.');
    }
  };

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;

  
  return (
    <div>
      {/* --- SADELEŞTİRİLMİŞ BAŞLIK ALANI --- */}
      {/* Artık burada Admin butonu yok, sadece başlık ve açıklama var */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">📚 Kitap Listesi</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Kütüphanemizdeki güncel eserleri buradan inceleyip ödünç alabilirsin.
        </p>
      </div>

      {/* --- KİTAP LİSTESİ (GRİD) --- */}
      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-xl font-medium">Henüz raflarda kitap yok.</p>
          {user?.role === 'admin' && (
            <p className="mt-2 text-sm text-purple-600">
              (Kitap eklemek için yukarıdaki "Admin Paneli" butonunu kullanabilirsin)
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
              {/* Kitap Resmi */}
              <div className="h-48 bg-gray-100 w-full object-cover flex items-center justify-center text-gray-400 text-4xl border-b border-gray-50">
                 {book.imageUrl ? (
                   <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                 ) : (
                   <span>📖</span> 
                 )}
              </div>

              {/* Kitap Bilgileri */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    {book.category?.name || 'Genel'}
                  </span>
                  <span className="text-sm text-gray-400 font-mono">{book.publishYear}</span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-800 leading-tight">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {book.description}
                </p>

                {/* Ödünç Al Butonu */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                   {user ? (
                     /* KULLANICI GİRİŞ YAPMIŞSA */
                     book.isAvailable ? (
                       // ✅ KİTAP MÜSAİTSE: Mavi Buton
                       <button 
                         onClick={() => handleBorrow(book.id)}
                         className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition active:scale-95 shadow-md"
                       >
                         📖 Ödünç Al
                       </button>
                     ) : (
                       // ⛔ KİTAP BAŞKASINDAYSA: Gri ve Tıklanmaz Buton
                       <button 
                         disabled
                         className="w-full bg-gray-300 text-gray-500 font-bold py-2 rounded cursor-not-allowed border border-gray-200"
                       >
                         🚫 Başkasında
                       </button>
                     )
                   ) : (
                     <Link to="/login" className="block text-center w-full bg-gray-100 text-gray-600 font-medium py-2 rounded hover:bg-gray-200 transition">
                       Giriş Yap
                     </Link>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;