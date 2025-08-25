import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      <div className="text-center space-y-8 px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Image 
            src="/LOGO KOTA MEDAN.png" 
            alt="Logo Pemko Medan" 
            width={64} 
            height={64} 
            className="h-16 w-auto drop-shadow" 
          />
          <div className="text-left leading-tight">
            <div className="text-sm text-muted-foreground">
              Badan Kesatuan Bangsa dan Politik
            </div>
            <div className="text-base font-semibold tracking-wide">
              Kota Medan
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-full hover:bg-muted transition-colors"
          >
            Masuk ke Dashboard
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground">
          <p>Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.</p>
        </div>
      </div>
    </div>
  );
}
