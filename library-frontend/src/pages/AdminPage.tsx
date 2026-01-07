import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

// --- TİPLER ---
interface Book { id: number; title: string; authors: { name: string }[]; category: { name: string }; }
interface User { id: number; email: string; role: string; createdAt?: string; }
interface Category { id: number; name: string; }
interface Author { id: number; name: string; }
interface Loan { id: number; book: { title: string }; user: { email: string }; loanDate: string; returnDate: string | null; isReturned: boolean; }

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'books' | 'users' | 'loans' | 'categories' | 'authors'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  
  const [newCatName, setNewCatName] = useState('');
  const [newAuthName, setNewAuthName] = useState('');

  // 1. GÜVENLİK KONTROLÜ
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Yetkisiz Giriş!');
      navigate('/');
    }
  }, [user, navigate]);

  // ✅ 2. VERİ ÇEKME FONKSİYONU (Artık Dışarıda ve Özgür!)
  const loadData = useCallback(async () => {
    try {
      if (activeTab === 'books') {
        const res = await axiosInstance.get('/books');
        setBooks(res.data);
      } else if (activeTab === 'users') {
        const res = await axiosInstance.get('/users');
        setUsers(res.data);
      } else if (activeTab === 'loans') {
        const res = await axiosInstance.get('/loans');
        setLoans(res.data);
      } else if (activeTab === 'categories') {
        const res = await axiosInstance.get('/books/categories');
        setCategories(res.data);
      } else if (activeTab === 'authors') {
        const res = await axiosInstance.get('/books/authors');
        setAuthors(res.data);
      }
    } catch (err) {
      console.error(err);
      // Hata toast'ını kaldırdık, çok sık çıkmasın diye
    }
  }, [activeTab]);

  // Sekme değişince veriyi yükle
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // --- İŞLEM FONKSİYONLARI ---

  const deleteItem = async (endpoint: string, id: number, message: string) => {
    if(!confirm('Bu kaydı silmek istediğine emin misin?')) return;
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      toast.success(message);
      loadData(); // ✅ Artık doğru loadData çalışacak
    } catch (err) {
       console.error(err);
       toast.error('Silme işlemi başarısız. (Bu kayıt kullanımda olabilir)');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/books/categories', { name: newCatName });
      toast.success('Kategori eklendi! 🎉');
      setNewCatName('');
      loadData(); // ✅ Listeyi yenile
    } catch (err) { console.error(err); toast.error('Ekleme başarısız.'); }
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/books/authors', { name: newAuthName });
      toast.success('Yazar eklendi! ✍️');
      setNewAuthName('');
      loadData(); // ✅ Listeyi yenile
    } catch (err) { console.error(err); toast.error('Ekleme başarısız.'); }
  };

  const handleDeleteBook = async (id: number) => {
    if(!confirm('Silmek istediğine emin misin?')) return;
    try {
      await axiosInstance.delete(`/books/${id}`);
      toast.success('Kitap silindi.');
      loadData(); 
    } catch (err) { 
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Silme başarısız.'); 
    }
  };

  const handleDeleteUser = async (id: number) => {
    if(!confirm('Banlamak istediğine emin misin?')) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      toast.success('Kullanıcı banlandı.');
      loadData();
    } catch (err) { 
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'İşlem başarısız.'); 
    }
  };

  const handleReturnLoan = async (id: number) => {
    try {
      await axiosInstance.patch(`/loans/${id}/return`);
      toast.success('İade alındı.');
      loadData();
    } catch (err) { 
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'İade başarısız.'); 
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛡️ Yönetim Paneli</h1>

      {/* SEKMELER */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('books')} className={`py-3 px-4 font-semibold ${activeTab === 'books' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>📚 Kitaplar</button>
        <button onClick={() => setActiveTab('users')} className={`py-3 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>👥 Kullanıcılar</button>
        <button onClick={() => setActiveTab('loans')} className={`py-3 px-4 font-semibold ${activeTab === 'loans' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>🔄 Ödünçler</button>
        <button onClick={() => setActiveTab('categories')} className={`py-3 px-4 font-semibold ${activeTab === 'categories' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>🏷️ Kategoriler</button>
        <button onClick={() => setActiveTab('authors')} className={`py-3 px-4 font-semibold ${activeTab === 'authors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>✍️ Yazarlar</button>
      </div>

      {/* İÇERİK: Kitaplar */}
      {activeTab === 'books' && (
        <div>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold">Envanter</h2>
             <button onClick={() => navigate('/admin/add-book')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Kitap Ekle</button>
          </div>
          {books.length === 0 ? <p className="text-gray-500">Kayıtlı kitap yok.</p> : (
            <table className="w-full text-left border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                    <th className="p-3 border">ID</th><th className="p-3 border">Başlık</th><th className="p-3 border">Yazar</th><th className="p-3 border">Kategori</th><th className="p-3 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{b.id}</td>
                    <td className="p-3 font-medium">{b.title}</td>
                    <td className="p-3">{b.authors?.map(a => a.name).join(', ') || '-'}</td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{b.category?.name || '-'}</span></td>
                    <td className="p-3 flex gap-2">
                       <button onClick={() => navigate(`/admin/edit-book/${b.id}`)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">✏️</button>
                       <button onClick={() => handleDeleteBook(b.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* İÇERİK: Kullanıcılar */}
      {activeTab === 'users' && (
        <div>
           {/* ÜST BAŞLIK VE EKLE BUTONU */}
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-gray-700">Üye Listesi</h2>
             
             {/* KİTAPLARDAKİ GİBİ YEŞİL EKLE BUTONU */}
             <button onClick={() => navigate('/admin/add-user')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow flex items-center gap-2">
               <span>+</span> Kullanıcı Ekle
             </button>
           </div>

           {/* TABLO */}
           <table className="w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Rol</th>
                  <th className="p-3 border">Üyelik Tarihi</th>
                  <th className="p-3 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{u.id}</td>
                    <td className="p-3 font-medium">{u.email}</td>
                    
                    {/* Rol Gösterimi */}
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Tarih Formatlama */}
                    <td className="p-3 text-sm text-gray-600">
                      {/* Tarih varsa gün/ay/yıl yap, yoksa çizgi koy */}
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}
                    </td>

                    {/* İŞLEM BUTONLARI (GÜNCELLE ve SİL) */}
                    <td className="p-3 flex gap-2">
                      {/* Güncelle (Sarı) */}
                      <button 
                        onClick={() => navigate(`/admin/edit-user/${u.id}`)} 
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition shadow-sm"
                      >
                        ✏️ Güncelle
                      </button>

                      {/* Sil (Kırmızı) - Admin kendini silemesin diye kontrol */}
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition shadow-sm"
                        >
                          🗑️ Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
      {/* İÇERİK: Ödünçler */}
      {activeTab === 'loans' && (
        <div>
           <h2 className="text-xl font-bold mb-4">Ödünç Hareketleri</h2>
           <table className="w-full text-left border-collapse border">
              <thead><tr className="bg-gray-100"><th className="p-3 border">Kitap</th><th className="p-3 border">Üye</th><th className="p-3 border">Durum</th><th className="p-3 border">İşlem</th></tr></thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id} className="border-b">
                    <td className="p-3">{l.book?.title}</td>
                    <td className="p-3">{l.user?.email}</td>
                    <td className="p-3">{l.isReturned ? <span className="text-green-600">Rafta</span> : <span className="text-red-600 font-bold">🔴 Üyede</span>}</td>
                    <td className="p-3">{!l.isReturned && <button onClick={() => handleReturnLoan(l.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">İade Al</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
      
      {/* İÇERİK: KATEGORİLER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
             <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
             <table className="w-full text-left border-collapse border">
                <thead><tr className="bg-gray-100"><th className="p-3 border">ID</th><th className="p-3 border">İsim</th><th className="p-3 border">İşlem</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="border-b">
                      <td className="p-3">{c.id}</td>
                      <td className="p-3 font-semibold">{c.name}</td>
                      <td className="p-3"><button onClick={() => deleteItem('/books/categories', c.id, 'Kategori silindi')} className="text-red-500 hover:text-red-700">🗑️ Sil</button></td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
           <div className="bg-gray-50 p-4 rounded h-fit border">
             <h3 className="font-bold mb-2">Yeni Kategori Ekle</h3>
             <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
               <input type="text" placeholder="Örn: Bilim Kurgu" className="p-2 border rounded" value={newCatName} onChange={e => setNewCatName(e.target.value)} required />
               <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ekle</button>
             </form>
           </div>
        </div>
      )}

      {/* İÇERİK: YAZARLAR */}
      {activeTab === 'authors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
             <h2 className="text-xl font-bold mb-4">Yazarlar</h2>
             <table className="w-full text-left border-collapse border">
                <thead><tr className="bg-gray-100"><th className="p-3 border">ID</th><th className="p-3 border">İsim</th><th className="p-3 border">İşlem</th></tr></thead>
                <tbody>
                  {authors.map(a => (
                    <tr key={a.id} className="border-b">
                      <td className="p-3">{a.id}</td>
                      <td className="p-3 font-semibold">{a.name}</td>
                      <td className="p-3"><button onClick={() => deleteItem('/books/authors', a.id, 'Yazar silindi')} className="text-red-500 hover:text-red-700">🗑️ Sil</button></td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
           <div className="bg-gray-50 p-4 rounded h-fit border">
             <h3 className="font-bold mb-2">Yeni Yazar Ekle</h3>
             <form onSubmit={handleAddAuthor} className="flex flex-col gap-2">
               <input type="text" placeholder="Örn: Zülfü Livaneli" className="p-2 border rounded" value={newAuthName} onChange={e => setNewAuthName(e.target.value)} required />
               <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ekle</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;