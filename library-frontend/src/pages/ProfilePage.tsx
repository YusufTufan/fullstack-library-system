import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Gelen veri tiplerini tanımlayalım
interface Loan {
  id: number;
  book: { 
    title: string; 
    imageUrl?: string;
    authors?: { name: string }[];
  };
  loanDate: string;
  returnDate: string | null;
  isReturned: boolean;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    // Backend'deki "Benim Kitaplarım" servisine istek atıyoruz
    const fetchMyLoans = async () => {
      try {
        const res = await axiosInstance.get('/loans/my-loans');
        setLoans(res.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Kitap geçmişi alınamadı.');
      }
    };
    fetchMyLoans();
  }, []);

  // Kitapları ikiye ayır: Şu an okuduklarım vs. Eskiden okuduklarım
  const activeLoans = loans.filter(l => !l.isReturned);
  const pastLoans = loans.filter(l => l.isReturned);

  return (
    <div className="container mx-auto p-6">
      {/* 1. KART: KULLANICI BİLGİSİ */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Merhaba, {user?.email.split('@')[0]}! 👋</h1>
          <p className="opacity-90">Kütüphane hesabın ve okuma geçmişin.</p>
        </div>
        <div className="text-right">
           <div className="text-4xl font-bold">{activeLoans.length}</div>
           <div className="text-sm opacity-80">Şu anda okunan kitap sayısı</div>
        </div>
      </div>

      {/* 2. KART: ŞU AN ELİNDEKİ KİTAPLAR */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">📖 Şu An Sende Olanlar</h2>
      
      {activeLoans.length === 0 ? (
        <p className="text-gray-500 mb-8 bg-gray-50 p-4 rounded border">Şu an ödünç aldığın bir kitap yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {activeLoans.map(loan => (
            <div key={loan.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex gap-4 items-center">
              {/* Küçük Resim */}
              <div className="w-16 h-24 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
                {loan.book.imageUrl ? (
                  <img src={loan.book.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📚</div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{loan.book.title}</h3>
                <p className="text-sm text-gray-600">
                   📅 Alınma: {new Date(loan.loanDate).toLocaleDateString('tr-TR')}
                </p>
                <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold">
                   Okunuyor
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. KART: GEÇMİŞ (İADE ETTİKLERİN) */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">✅ Okuma Geçmişin</h2>
      
      {pastLoans.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-4 rounded border">Henüz bitirip iade ettiğin kitap yok.</p>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Kitap</th>
                <th className="p-3 hidden md:table-cell">Alınma Tarihi</th>
                <th className="p-3 hidden md:table-cell">İade Tarihi</th>
                <th className="p-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {pastLoans.map(loan => (
                <tr key={loan.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium">{loan.book.title}</td>
                  <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                    {new Date(loan.loanDate).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                    {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="p-3">
                    <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                      İade Edildi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;