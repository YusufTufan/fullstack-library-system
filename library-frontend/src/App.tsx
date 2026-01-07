import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/LoginPage'; // Giriş Sayfası
import RegisterPage from './pages/RegisterPage'; // Kayıt Sayfası
import HomePage from './pages/HomePage'; // Ana Sayfa
import AdminPage from './pages/AdminPage'; // Yönetim Paneli
import AddBookPage from './pages/AddBookPage'; // Kitap Ekleme Sayfası
import EditBookPage from './pages/EditBookPage'; // Kitap Düzenleme Sayfası

import AddUserPage from './pages/AddUserPage'; // Kullanıcı Ekleme Sayfası
import EditUserPage from './pages/EditUserPage'; // Kullanıcı Düzenleme Sayfası

import ProfilePage from './pages/ProfilePage'; // Profil Sayfası

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Baba Component (Çerçeve)
    children: [ // Çocuklar (Sayfalar)
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'admin/add-book',
        element: <AddBookPage />,
      },
      {
        path: 'admin/edit-book/:id', // :id demek, buraya değişen bir numara gelecek demek
        element: <EditBookPage />,
      },
      { 
        path: 'admin/add-user',
        element: <AddUserPage />
      },
      { 
        path: 'admin/edit-user/:id',
        element: <EditUserPage />
      },
      {
        path:"/profile",
        element: <ProfilePage />
      },
      {
        path: '*',
        element: <div className="text-red-500 text-center mt-10">404 - Sayfa Bulunamadı</div>,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App