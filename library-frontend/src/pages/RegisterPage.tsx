import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Backend'e Kayıt İsteği At
      // NOT: Backend'de rol otomatik 'member' olarak atanıyor olabilir.
      // Eğer backend body'de rol istiyorsa buraya role: 'member' ekleriz.
      await axiosInstance.post('/auth/register', {
        email,
        password,
      });

      toast.success('Kayıt Başarılı! Şimdi giriş yapabilirsiniz.');
      
      // 2 saniye sonra giriş sayfasına yönlendir (Kullanıcı mesajı okusun)
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      toast.error(error.response?.data?.message || 'Kayıt olunamadı. Tekrar deneyin.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Aramıza Katıl</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email Adresi</label>
            <input
              type="email"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ornek@ogrenci.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Şifre Belirle</label>
            <input
              type="password"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition duration-200 font-bold"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;