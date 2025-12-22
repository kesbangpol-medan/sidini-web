# Changelog

Semua perubahan penting pada proyek SIDINI Web Application akan didokumentasikan dalam file ini.

Format berdasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Landing page SIDINI yang lengkap dan responsif
- Halaman login dengan form autentikasi
- Dashboard admin dengan berbagai modul
- Sistem manajemen user dan wilayah
- Halaman laporan dengan grafik dan statistik
- Halaman 404 custom yang informatif
- Konfigurasi favicon dengan `icon_sidini.png`
- PWA manifest untuk Progressive Web App
- SEO optimization dengan meta tags dan OpenGraph
- File robots.txt dan sitemap.xml untuk SEO

### Changed
- Button "Mulai Sekarang" sekarang mengarah ke `/auth/login/domain`
- Favicon browser berubah dari Vercel menjadi `icon_sidini.png`
- Title halaman berubah menjadi "SIDINI - Sistem Informasi Deteksi Dini Kota Medan"
- Language HTML berubah dari "en" menjadi "id" untuk Bahasa Indonesia

### Fixed
- Error 404 pada halaman utama - sekarang bisa diakses langsung di `/`
- Routing Next.js App Router sudah berfungsi dengan benar
- Konfigurasi images.domains yang deprecated diganti dengan remotePatterns
- Warning metadataBase sudah ditambahkan untuk menghilangkan warning

### Technical
- File `landingpage.tsx` diubah menjadi `page.tsx` untuk routing yang benar
- Konfigurasi Next.js dioptimasi untuk performance dan security
- Build process berhasil tanpa error
- Development server berjalan dengan baik di port 3000/3001

## [0.1.0] - 2024-01-20

### Added
- Initial project setup dengan Next.js 15.3.2
- TypeScript configuration
- Tailwind CSS setup
- Basic project structure

## Cara Update Changelog

Untuk setiap perubahan yang signifikan, tambahkan entry baru di bagian [Unreleased] dengan format:

### Added (untuk fitur baru)
### Changed (untuk perubahan yang ada)
### Deprecated (untuk fitur yang akan dihapus)
### Removed (untuk fitur yang sudah dihapus)
### Fixed (untuk bug fixes)
### Security (untuk security updates)
