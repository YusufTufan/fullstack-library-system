import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Backend'e İstek At
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      // 2. Gelen veriyi (Token ve Payload) al
      // Backend'den dönen yapı: { access_token: "...", user: { id: 1, role: "admin", ... } }
      // NOT: Backend'indeki AuthController'da login metodu sadece token dönüyorsa,
      // kullanıcı bilgisini token'dan çözmemiz (decode) gerekebilir.
      // Ama şimdilik senin backend yapına uygun olarak token geldiğini varsayıyoruz.
      
      // Backend cevabını konsola yazdırıp kontrol edelim (Test için)
      console.log('Login Cevabı:', response.data);

      // Burası önemli: Backend sadece access_token dönüyorsa, user bilgisini decode etmeliyiz.
      // Şimdilik token'ı alıp sisteme sokalım.
      const { access_token, user } = response.data; 

      // Eğer backend 'user' objesini dönmüyorsa, geçici olarak token'dan decode etmemiz gerekir
      // Şimdilik backend'in user döndüğünü varsayarak ilerliyoruz.
      
      login(access_token, user); 
      
      toast.success('Giriş Başarılı! Hoşgeldiniz.');
      navigate('/'); // Ana sayfaya git
      
    } catch (err) {
      //  Hata tipini güvenli bir şekilde belirttik (Casting)
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      // Artık TypeScript kızmaz, çünkü error'un bir AxiosError olduğunu biliyor
      toast.error(error.response?.data?.message || 'Giriş başarısız. Bilgileri kontrol et.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Giriş Yap</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email Adresi</label>
            <input
              type="email"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Şifre</label>
            <input
              type="password"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200 font-bold"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Hemen Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;