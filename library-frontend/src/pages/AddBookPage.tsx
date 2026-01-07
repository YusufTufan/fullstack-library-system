import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

// Tipler
interface Category { id: number; name: string; }
interface Author { id: number; name: string; }

const AddBookPage = () => {
  const navigate = useNavigate();
  
  // Form Verileri
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorIds, setAuthorIds] = useState<string[]>([]); // Seçilen yazar ID'si

  // Dropdown Verileri
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // Sayfa açılınca Kategorileri ve Yazarları Çek
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Backend'de bu endpointler yoksa hata verebilir, 
        // o yüzden önce basitçe listeleri çekmeyi deniyoruz.
        // Eğer veritabanın boşsa bunlar boş dizi döner.
        const [catRes, authRes] = await Promise.all([
          axiosInstance.get('/books/categories'), 
          axiosInstance.get('/books/authors')
        ]);
        setCategories(catRes.data);
        setAuthors(authRes.data);
      } catch (err) {
        console.error('Veri çekme hatası:', err);
        toast.warning('Yazar veya Kategori listesi yüklenemedi. Veritabanı boş olabilir.');
      }
    };
    fetchFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/books', {
        title,
        description,
        publishYear: parseInt(publishYear),
        imageUrl,
        categoryId: parseInt(categoryId),
        authorIds: authorIds.map(id => parseInt(id)) // Backend array bekliyorsa
      });
      
      toast.success('Kitap Başarıyla Eklendi! 🎉');
      navigate('/admin'); // İş bitince panele dön
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Ekleme başarısız.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">📖 Yeni Kitap Ekle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Başlık */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Kitap Adı</label>
          <input 
            type="text" required 
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" 
            placeholder="Örn: Sefiller"
            value={title} onChange={e => setTitle(e.target.value)} 
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
          <textarea 
            required rows={4}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" 
            placeholder="Kitap hakkında kısa bilgi..."
            value={description} onChange={e => setDescription(e.target.value)} 
          />
        </div>

        {/* Yıl ve Resim */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Yayın Yılı</label>
            <input 
              type="number" required 
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="2024"
              value={publishYear} onChange={e => setPublishYear(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Resim URL</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="https://..." 
              value={imageUrl} onChange={e => setImageUrl(e.target.value)} 
            />
          </div>
        </div>

        {/* Kategori Seçimi */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Kategori</label>
          <select 
            required 
            className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
            value={categoryId} onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">Kategori Seçiniz...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {categories.length === 0 && (
             <p className="text-red-500 text-xs mt-1">⚠️ Listede kategori yok. Veritabanından 'categories' tablosuna veri eklemelisin.</p>
          )}
        </div>

        {/* Yazar Seçimi */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Yazar</label>
          <select 
            required 
            className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
            onChange={e => setAuthorIds([e.target.value])} // Şimdilik tek yazar seçtiriyoruz
          >
            <option value="">Yazar Seçiniz...</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {authors.length === 0 && (
             <p className="text-red-500 text-xs mt-1">⚠️ Listede yazar yok. Veritabanından 'authors' tablosuna veri eklemelisin.</p>
          )}
        </div>

        {/* Kaydet Butonu */}
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition shadow-md hover:shadow-lg transform active:scale-95"
        >
          ✅ Kitabı Kaydet
        </button>
      </form>
    </div>
  );
};

export default AddBookPage;