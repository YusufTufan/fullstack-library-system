import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Category { id: number; name: string; }
interface Author { id: number; name: string; }

const EditBookPage = () => {
  const { id } = useParams(); // URL'den ID'yi al
  const navigate = useNavigate();
  
  // State'ler
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorIds, setAuthorIds] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // 1. Sayfa Açılınca: Kategorileri, Yazarları VE Düzenlenecek Kitabı Çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, authRes, bookRes] = await Promise.all([
          axiosInstance.get('/books/categories'),
          axiosInstance.get('/books/authors'),
          axiosInstance.get(`/books/${id}`) // Mevcut kitabı getir
        ]);

        setCategories(catRes.data);
        setAuthors(authRes.data);

        // Gelen kitap verilerini kutulara doldur (Pre-fill)
        const book = bookRes.data;
        setTitle(book.title);
        setDescription(book.description);
        setPublishYear(book.publishYear);
        setImageUrl(book.imageUrl);
        setCategoryId(book.category?.id || '');
        
        // Backend 'authors' veya 'author' gönderebilir, kontrol et
        const bookAuthors = book.authors || book.author || [];
        if (bookAuthors.length > 0) {
          setAuthorIds([bookAuthors[0].id.toString()]); // Şimdilik tek yazar
        }

      } catch (err) {
        console.error(err);
        toast.error('Kitap bilgileri yüklenemedi.');
        navigate('/admin');
      }
    };
    fetchData();
  }, [id, navigate]);

  // 2. Güncelleme İşlemi (PUT/PATCH)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/books/${id}`, {
        title,
        description,
        publishYear: parseInt(publishYear),
        imageUrl,
        categoryId: parseInt(categoryId),
        // Backend tek yazar bekliyorsa array'in ilkini al, yoksa array gönder
        // Senin backend yapına göre burayı array olarak gönderiyorum:
        authorIds: authorIds.map(i => parseInt(i)) 
      });
      
      toast.success('Kitap başarıyla güncellendi! ✅');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Güncelleme başarısız oldu.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-yellow-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">✏️ Kitabı Düzenle</h2>
      
      <form onSubmit={handleUpdate} className="space-y-5">
        
        <div>
          <label className="block text-gray-700 font-bold mb-2">Kitap Adı</label>
          <input type="text" required className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-400 outline-none" 
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
          <textarea rows={4} className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-400 outline-none" 
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Yıl</label>
            <input type="number" required className="w-full p-3 border rounded" 
              value={publishYear} onChange={e => setPublishYear(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Resim URL</label>
            <input type="text" className="w-full p-3 border rounded" 
              value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Kategori</label>
          <select required className="w-full p-3 border rounded bg-white"
            value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Seçiniz...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Yazar</label>
          <select required className="w-full p-3 border rounded bg-white"
            value={authorIds[0] || ''} onChange={e => setAuthorIds([e.target.value])}>
            <option value="">Seçiniz...</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-3 rounded hover:bg-yellow-600 transition shadow-md">
          💾 Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;