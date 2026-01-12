# 📚 Library Management System (Kütüphane Yönetim Sistemi)

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir Kütüphane Yönetim Sistemidir. Kullanıcıların kitap ödünç almasını, iade etmesini ve kütüphane envanterinin yönetilmesini sağlar.


## 🚀 Teknolojiler

Bu proje Full Stack mimari ile geliştirilmiştir:

### Backend (Sunucu Tarafı)
* **Framework:** NestJS (Node.js)
* **Dil:** TypeScript
* **Veritabanı:** Sqlite
* **ORM:** TypeORM / Prisma
* **Authentication:** JWT (JSON Web Tokens)

### Frontend (İstemci Tarafı)
* **Library:** React.js
* **State Management:** Redux / Context API
* **Styling:** Tailwind CSS / Material UI / SCSS
* **HTTP Client:** Axios

## ✨ Özellikler

* ✅ **Kullanıcı Yönetimi:** Kayıt ol, giriş yap, rol tabanlı yetkilendirme (Admin/User).
* ✅ **Kitap İşlemleri:** Kitap ekle, sil, güncelle ve listele.
* ✅ **Ödünç Sistemi:** Kitap ödünç alma ve iade etme takibi.
* ✅ **Arama ve Filtreleme:** Yazar, kategori veya isme göre detaylı arama.
* ✅ **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz.

## 🛠️ Kurulum (Installation)

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Hazırlık
Bilgisayarınızda Node.js ve Git'in yüklü olduğundan emin olun.

1. **Repoyu Klonlayın:**
   ```bash
   git clone [https://github.com/YusufTufan/library-management-system.git](https://github.com/YusufTufan/library-management-system.git)
   cd library-management-system
   ```
2. Backend Kurulumu
   ```bash
   cd library_backend
   npm install
   # .env dosyasını oluşturup veritabanı ayarlarınızı yapmayı unutmayın!
   npm run start:dev
    ```
3. Frontend Kurulumu
Yeni bir terminal açın ve:
   ```bash
   cd library-frontend
   npm install
   npm run dev
   ```

📄 License
This project is licensed under the MIT License - see the LICENSE file for details. Copyright (c) 2025 YusufTufan

