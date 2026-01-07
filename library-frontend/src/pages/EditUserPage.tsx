import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}`);
        setEmail(res.data.email);
        setRole(res.data.role);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) { 
        toast.error('Kullanıcı bilgisi alınamadı'); 
        navigate('/admin'); 
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Şifre göndermiyoruz, sadece rol değişimi için
      await axiosInstance.patch(`/users/${id}`, { role });
      toast.success('Kullanıcı güncellendi! ✅');
      navigate('/admin');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) { 
      toast.error('Güncelleme başarısız.'); 
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-yellow-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">✏️ Kullanıcı Rolünü Düzenle</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-bold text-gray-700">Email</label>
          <input type="email" className="w-full p-2 border rounded bg-gray-100 text-gray-500" value={email} disabled />
        </div>
        <div>
          <label className="block font-bold text-gray-700">Rol</label>
          <select className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-yellow-400" 
            value={role} onChange={e => setRole(e.target.value)}>
            <option value="member">Üye (Member)</option>
            <option value="admin">Yönetici (Admin)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 font-bold shadow">
          Güncelle
        </button>
      </form>
    </div>
  );
};
export default EditUserPage;