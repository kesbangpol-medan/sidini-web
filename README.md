# SIDINI Web Application

Sistem Informasi Deteksi Dini untuk Kota Medan - Aplikasi web modern yang mengintegrasikan teknologi untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian.

## 🚀 Cara Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📱 Halaman yang Tersedia

### 🏠 Halaman Utama (Landing Page)
- **URL**: `/` (root)
- **File**: `src/app/page.tsx`
- **Komponen**: `src/app/landingpage.tsx`
- **Deskripsi**: Halaman landing page utama SIDINI dengan informasi lengkap tentang sistem

### 🔐 Halaman Login
- **URL**: `/auth/login/domain`
- **File**: `src/app/auth/login/domain/page.tsx`
- **Deskripsi**: Halaman login untuk akses dashboard

### 📊 Dashboard
- **URL**: `/dashboard`
- **File**: `src/app/dashboard/page.tsx`
- **Deskripsi**: Dashboard utama aplikasi

### 📋 Modul Laporan
- **URL**: `/dashboard/report`
- **File**: `src/app/dashboard/report/page.tsx`
- **Deskripsi**: Halaman laporan dengan grafik dan statistik

### 👥 Manajemen User
- **URL**: `/dashboard/user`
- **File**: `src/app/dashboard/user/page.tsx`
- **Deskripsi**: Manajemen pengguna sistem

### 🏘️ Manajemen Wilayah
- **URL**: `/dashboard/village`, `/dashboard/subvillage`, `/dashboard/district`, `/dashboard/department`
- **Deskripsi**: Manajemen data wilayah administratif

## 🛠️ Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Halaman utama (/)
│   ├── landingpage.tsx    # Komponen landing page
│   ├── not-found.tsx      # Halaman 404
│   ├── layout.tsx         # Layout utama
│   ├── globals.css        # CSS global
│   ├── auth/              # Modul autentikasi
│   └── dashboard/         # Modul dashboard
├── components/             # Komponen reusable
│   ├── buttons/           # Komponen tombol
│   ├── cards/             # Komponen kartu
│   ├── inputs/            # Komponen input
│   ├── tables/            # Komponen tabel
│   └── dashboards/        # Komponen dashboard
├── configs/                # Konfigurasi aplikasi
└── utils/                  # Utility functions
```

## 🎯 Fitur Utama

1. **Landing Page Responsif** - Halaman utama yang informatif dan menarik
2. **Dashboard Admin** - Interface untuk mengelola data dan laporan
3. **Sistem Pelaporan** - Pelaporan real-time dengan grafik dan statistik
4. **Manajemen User** - Sistem manajemen pengguna yang terintegrasi
5. **Manajemen Wilayah** - Pengelolaan data wilayah administratif

## 🔧 Teknologi yang Digunakan

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Chart.js
- **State Management**: React Hooks

## 📝 Catatan Penting

- Halaman utama sekarang bisa diakses langsung di `/` (root)
- File `landingpage.tsx` berisi komponen lengkap landing page
- File `page.tsx` mengimpor dan menggunakan komponen dari `landingpage.tsx`
- Halaman 404 custom telah dibuat dengan `not-found.tsx`

## 🌐 Akses Aplikasi

Setelah menjalankan `npm run dev`, buka browser dan akses:
- **Halaman Utama**: `http://localhost:3000/`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Login**: `http://localhost:3000/auth/login/domain`

## 📞 Kontak

Untuk informasi lebih lanjut, silakan hubungi:
- **Website**: https://sidini.medan.go.id/
- **Instagram**: @kesbangpolmedan
- **YouTube**: @kesbangpolmedan
