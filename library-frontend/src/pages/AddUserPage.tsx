import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddUserPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users', { email, password, role });
      toast.success('Kullanıcı oluşturuldu! 🎉');
      navigate('/admin');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) { 
      toast.error('Ekleme başarısız.'); 
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">👤 Yeni Kullanıcı Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-gray-700">Email</label>
          <input type="email" required className="w-full p-2 border rounded outline-none focus:border-blue-500" 
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block font-bold text-gray-700">Şifre</label>
          <input type="password" required className="w-full p-2 border rounded outline-none focus:border-blue-500" 
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block font-bold text-gray-700">Rol</label>
          <select className="w-full p-2 border rounded bg-white" value={role} onChange={e => setRole(e.target.value)}>
            <option value="member">Üye (Member)</option>
            <option value="admin">Yönetici (Admin)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold shadow">
          Kaydet
        </button>
      </form>
    </div>
  );
};
export default AddUserPage;