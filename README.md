# SIDINI Web Application

Sistem Informasi Deteksi Dini untuk Kota Medan - Aplikasi web modern yang mengintegrasikan teknologi untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian.

## Cara Menjalankan Aplikasi

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

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Halaman utama (/)
│   ├── not-found.tsx      # Halaman 404
│   ├── layout.tsx         # Layout utama dengan favicon
│   ├── globals.css        # CSS global
│   ├── auth/              # Modul autentikasi
│   │   └── login/         # Halaman login
│   │       └── domain/    # Login domain
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

## Teknologi yang Digunakan

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Chart.js
- **State Management**: React Hooks
- **Animation**: Framer Motion

