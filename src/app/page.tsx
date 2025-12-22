"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AppButton from "@/components/buttons/AppButton";
import { ArrowRight, Shield, Users as UsersIcon, TrendingUp, Download, Building2, File, TabletSmartphone, UserCog, Database, Building, Phone, Globe, Instagram, Youtube } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ButtonProps {
  variant?: "ghost" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface GoalItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface StepItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface UserGroup {
  icon: React.ElementType;
  title: string;
  description: string;
  users: string[];
  color: string;
  bgColor: string;
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Button component untuk social media links
 */
const Button: React.FC<ButtonProps> = ({ variant = "ghost", size = "sm", className = "", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variantClasses = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

/**
 * Main Landing Page Component
 */
const Page: React.FC = () => {
  useEffect(() => {
    // Set HTML attributes untuk accessibility
    document.documentElement.lang = "id";
    document.title = "SIDINI - Sistem Informasi Deteksi Dini Kota Medan";

    // Add structured data untuk SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      name: "SIDINI - Sistem Informasi Deteksi Dini Kota Medan",
      description: "Sistem informasi deteksi dini untuk meningkatkan keamanan dan kesiapsiagaan Kota Medan",
      provider: {
        "@type": "GovernmentOrganization",
        name: "Pemerintah Kota Medan",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Kapten Maulana Lubis No.2",
          addressLocality: "Medan",
          addressRegion: "Sumatera Utara",
          postalCode: "20112",
          addressCountry: "ID",
        },
      },
      areaServed: "Medan, Indonesia",
      serviceType: "Emergency Detection System",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <GoalsSection />
      <HowItWorksSection />
      <UsersSection />
      <FooterSection />
    </main>
  );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

/**
 * Hero Section - Bagian utama landing page
 */
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12 md:pt-16 lg:pt-10 pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background parallax-bg" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 scroll-reveal">
            {/* Header dengan logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 justify-start lg:justify-start">
                <Image src="/LOGO KOTA MEDAN.png" alt="Logo Pemko Medan" width={64} height={64} className="h-12 sm:h-14 md:h-16 w-auto drop-shadow" />
                <div className="text-left leading-tight">
                  <div className="text-xs sm:text-sm text-muted-foreground">Badan Kesatuan Bangsa dan Politik</div>
                  <div className="text-sm sm:text-base font-semibold tracking-wide">Kota Medan</div>
                </div>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
                <span className="text-primary">SIDINI</span>
                <br />
                <span className="text-foreground">Sistem Informasi Deteksi Dini untuk</span>
                <br />
                <span className="text-primary">Kota Medan</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0">Sistem Informasi Deteksi Dini yang mengintegrasikan teknologi modern untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian di Kota Medan.</p>
            </div>

            {/* Stats cards */}
            <div className="flex flex-wrap gap-3 sm:gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full icon-bubble-success flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Monitoring</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full icon-bubble-info flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">20+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Instansi</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full icon-bubble-warning flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">Real-time</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Pelaporan</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
              <a href="/auth/login/domain" className="w-full sm:w-auto flex justify-center lg:justify-start">
                <AppButton className="bg-primary hover:bg-[var(--primary-hover)] text-white rounded-full cta-lift w-full sm:w-auto px-6 py-3" label="Mulai Sekarang" icon={<ArrowRight className="w-5 h-5" />} />
              </a>

              <a href="/doc/Buku_Panduan_SIDINI.pdf" className="w-full sm:w-auto flex justify-center lg:justify-start">
                <AppButton isOutline variant="secondary" className="rounded-full border-secondary text-[var(--secondary)] hover:bg-[var(--secondary-hover)] hover:text-white cta-lift w-full sm:w-auto px-6 py-3" icon={<Download className="w-5 h-5" />} label="Download Buku Panduan" />
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative scroll-reveal hidden lg:block" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <Image src="/dashboard_admin.png" alt="SIDINI Dashboard Interface" width={1200} height={800} className="w-full rounded-2xl shadow-2xl border border-border" />

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border government-card">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Monitoring</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border government-card">
                <div className="text-sm text-muted-foreground">Laporan Hari Ini</div>
                <div className="text-2xl font-bold text-primary">300+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * About Section - Tentang SIDINI
 */
const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        {/* Mobile Layout - Konten di atas, video di bawah */}
        <div className="block lg:hidden space-y-12">
          {/* Konten Section untuk Mobile */}
          <div className="space-y-8 scroll-reveal mx-auto" style={{ animationDelay: "200ms" }}>
            <div className="text-center space-y-4 mb-16 scroll-reveal">
              <div className="badge-highlight mx-auto flex">
                <Building2 className="w-4 h-4" />
                Tentang SIDINI
              </div>

              <h2 className="text-4xl font-bold leading-tight text-center">
                Satu Aplikasi untuk <span className="text-primary">Mencegah</span> Konflik Sejak Dini
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed text-center">Sebelum ada SIDINI, pelaporan potensi konflik di Medan masih manual lewat WhatsApp grup sehingga lambat, menumpuk yang memakan storage besar, dan sulit direkap. Kini dengan SIDINI (Sistem Informasi Deteksi Dini), setiap laporan bisa masuk secara real-time, terstruktur, dan terdokumentasi otomatis tanpa memakan storage yang besar, sehingga pemerintah dan perangkat kelurahan/kecamatan dapat merespons lebih cepat, tepat, dan akurat demi menjaga kerukunan masyarakat multikultural.</p>
            </div>
          </div>

          {/* Video Section untuk Mobile */}
          <div className="relative scroll-reveal mx-auto">
            <iframe title="Video Inovasi" src="https://www.youtube.com/embed/9cZh0hEAsvk?autoplay=1&mute=1&rel=0&modestbranding=1" className="w-full rounded-2xl shadow-xl border border-border" style={{ border: 0, height: "280px" }} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </div>
        </div>

        {/* Desktop Layout - Video di kiri, konten di kanan */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
          <div className="relative scroll-reveal mx-auto lg:mx-0">
            <iframe title="Video Inovasi" src="https://www.youtube.com/embed/9cZh0hEAsvk?autoplay=1&mute=1&rel=0&modestbranding=1" className="w-full rounded-2xl shadow-xl border border-border" style={{ border: 0, height: "400px" }} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </div>

          <div className="space-y-8 scroll-reveal mx-auto lg:mx-0" style={{ animationDelay: "200ms" }}>
            <div className="space-y-4">
              <div className="badge-highlight mx-auto lg:mx-0">
                <Building2 className="w-4 h-4" />
                Tentang SIDINI
              </div>

              <h2 className="text-4xl font-bold leading-tight text-center lg:text-left">
                Satu Aplikasi untuk <span className="text-primary">Mencegah</span> Konflik Sejak Dini
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed text-center lg:text-justify">Sebelum ada SIDINI, pelaporan potensi konflik di Medan masih manual lewat WhatsApp grup sehingga lambat, menumpuk yang memakan storage besar, dan sulit direkap. Kini dengan SIDINI (Sistem Informasi Deteksi Dini), setiap laporan bisa masuk secara real-time, terstruktur, dan terdokumentasi otomatis tanpa memakan storage yang besar, sehingga pemerintah dan perangkat kelurahan/kecamatan dapat merespons lebih cepat, tepat, dan akurat demi menjaga kerukunan masyarakat multikultural.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Goals Section - Fitur utama SIDINI
 */
const GoalsSection: React.FC = () => {
  const goals: GoalItem[] = [
    {
      icon: File,
      title: "Pelaporan Real-Time & Terstruktur",
      description: "Setiap laporan bisa diinput lengkap: kategori, lokasi detail, kronologi, hingga bukti foto/video. Tidak ada lagi laporan tercecer atau data yang hilang, semua tercatat dengan rapi.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: TabletSmartphone,
      title: "Aplikasi Mobile yang Mudah Digunakan",
      description: "Perangkat kecamatan dan kelurahan cukup menggunakan smartphone untuk mengirim laporan. Desain sederhana membuat aplikasi ini bisa digunakan siapa saja tanpa ribet.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: UserCog,
      title: "Dashboard Admin Web",
      description: "Pihak pemerintah dapat mengelola laporan dengan lebih mudah. Statistik bisa dipantau per hari, minggu, atau bulan. Data otomatis bisa diekspor ke PDF atau Excel untuk dokumentasi resmi.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <section id="tujuan" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 scroll-reveal">
          <div className="badge-highlight">
            <File className="w-4 h-4" />
            Fitur SIDINI
          </div>

          <h2 className="text-4xl font-bold">
            Tiga Fitur Utama <span className="text-primary">Sistem Informasi Deteksi Dini</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">SIDINI dirancang dengan fitur-fitur modern yang menjawab kebutuhan pelaporan cepat dan akurat.</p>
        </div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <div key={index} className="government-card card-hover-highlight text-center space-y-6 scroll-reveal" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto icon-bubble-secondary">
                  <Icon className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{goal.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{goal.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/**
 * How It Works Section - Cara kerja SIDINI
 */
const HowItWorksSection: React.FC = () => {
  const steps: StepItem[] = [
    {
      icon: File,
      title: "Pelaporan",
      description: "Masyarakat atau instansi melaporkan kejadian secara real-time melalui aplikasi mobile, lengkap dengan detail lokasi, kronologi, serta bukti foto/video.",
    },
    {
      icon: Database,
      title: "Manajemen Storage",
      description: "Setiap laporan otomatis tersimpan aman di sistem, tidak membebani handphone sehingga data tidak tercecer dan mudah diakses kapan pun dibutuhkan.",
    },
    {
      icon: File,
      title: "Konversi Excel",
      description: "Data laporan dapat langsung diolah dan diekspor ke format Excel, dan memfilternya sesuai kebutuhan memudahkan dokumentasi resmi.",
    },
    {
      icon: File,
      title: "Tindakan",
      description: "Tim respons turun ke lapangan dengan informasi yang sudah terdokumentasi rapi, sehingga setiap langkah penanganan bisa dilakukan lebih cepat, tepat, dan terkoordinasi.",
    },
  ];

  return (
    <section id="cara-kerja" className="py-24 bg-gradient-to-br from-surface via-background to-surface">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 scroll-reveal">
          <div className="badge-highlight">
            <Database className="w-4 h-4" />
            Cara Kerja
          </div>

          <h2 className="text-4xl font-bold">
            Bagaimana <span className="text-primary">SIDINI</span> Bekerja
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Proses terintegrasi mulai dari pelaporan hingga tindakan nyata dalam empat langkah sederhana namun efektif.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {/* Steps Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative scroll-reveal h-full" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="government-card card-hover-highlight text-center space-y-4 md:space-y-6 relative z-10 h-full">
                      <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto icon-bubble-primary">
                          <Icon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-lg md:text-xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-xs md:text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="scroll-reveal lg:col-span-1 col-span-full mt-8 lg:mt-0" style={{ animationDelay: "300ms" }}>
            <div className="government-card p-0 overflow-hidden">
              {/* Mobile Layout - Video Full Width dengan Height yang Fleksibel */}
              <div className="block lg:hidden">
                <video
                  src="/video/Tutorial Aplikasi SIDINI.mp4"
                  className="w-full h-auto min-h-[600px] sm:min-h-[650px] md:min-h-[750px] rounded-xl shadow-lg object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                  controls
                  preload="metadata"
                  style={{
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Desktop Layout - Video dengan Height Fixed */}
              <div className="hidden lg:block">
                <video
                  src="/video/Tutorial Aplikasi SIDINI.mp4"
                  className="w-full h-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px] xl:min-h-[520px] rounded-xl shadow-lg object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                  controls
                  preload="metadata"
                  style={{
                    maxHeight: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Users Section - Pengguna sistem SIDINI
 */
const UsersSection: React.FC = () => {
  const userGroups: UserGroup[] = [
    {
      icon: Building,
      title: "Badan Kesatuan Bangsa dan Politik",
      description: "Kesbangpol turut serta menyediakan inovasi SIDINI serta menjadi Admin dari Aplikasi SIDINI",
      users: [],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: UsersIcon,
      title: "Kecamatan",
      description: "Divisi Trantib Kecamatan sebagai mata dan telinga utama dalam sistem deteksi dini kejadian.",
      users: [],
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Phone,
      title: "Operator Sistem",
      description: "Tim teknis yang mengelola dan memantau sistem 24/7 untuk memastikan operasional optimal.",
      users: [],
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <section id="pengguna" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 scroll-reveal">
          <div className="badge-highlight">
            <UsersIcon className="w-4 h-4" />
            Pengguna Sistem
          </div>

          <h2 className="text-4xl font-bold">
            Siapa yang <span className="text-primary">Menggunakan</span> SIDINI
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">SIDINI dirancang untuk melayani berbagai pemangku kepentingan dalam ekosistem keamanan dan kesiapsiagaan Kota Medan dengan antarmuka yang disesuaikan untuk setiap peran.</p>
        </div>

        {/* User Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {userGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <div key={index} className="government-card card-hover-highlight p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg scroll-reveal" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transform hover:rotate-12 transition-transform duration-300 icon-bubble-secondary">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">{group.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{group.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {group.users.map((user, userIndex) => (
                      <span key={userIndex} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/**
 * Footer Section - Footer dengan navigasi dan kontak
 */
const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", hash);
    }
  };

  return (
    <footer className="bg-white text-foreground py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Image src="/icon.png" className="w-50 h-24" alt="SIDINI Icon" width={66} height={66} />
              </div>
            </div>

            <p className="text-black leading-relaxed">Sistem Informasi Deteksi Dini untuk meningkatkan keamanan dan kesiapsiagaan Kota Medan melalui teknologi modern dan kolaborasi lintas sektor.</p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a href="https://wa.me/6289522232085">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-background/70 hover:text-primary hover:bg-background/10">
                  <Phone className="w-4 h-4" />
                </Button>
              </a>

              <a href="https://sidini.medan.go.id/">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-background/70 hover:text-primary hover:bg-background/10">
                  <Globe className="w-4 h-4" />
                </Button>
              </a>

              <a href="https://www.instagram.com/kesbangpolmedan/">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-background/70 hover:text-primary hover:bg-background/10">
                  <Instagram className="w-4 h-4" />
                </Button>
              </a>

              <a href="https://www.youtube.com/@kesbangpolmedan">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-background/70 hover:text-primary hover:bg-background/10">
                  <Youtube className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-black">Navigasi</h4>
              <nav className="space-y-3">
                <a href="#tentang" onClick={(e) => handleNavClick(e, "#tentang")} className="block text-black hover:text-purple-600 hover:translate-x-1 transition-all duration-200">
                  Tentang SIDINI
                </a>
                <a href="#tujuan" onClick={(e) => handleNavClick(e, "#tujuan")} className="block text-black hover:text-purple-600 hover:translate-x-1 transition-all duration-200">
                  Fitur Sidini
                </a>
                <a href="#cara-kerja" onClick={(e) => handleNavClick(e, "#cara-kerja")} className="block text-black hover:text-purple-600 hover:translate-x-1 transition-all duration-200">
                  Cara Kerja
                </a>
                <a href="#pengguna" onClick={(e) => handleNavClick(e, "#pengguna")} className="block text-black hover:text-purple-600 hover:translate-x-1 transition-all duration-200">
                  Pengguna
                </a>
              </nav>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-black">Lokasi</h4>
            <div className="relative scroll-reveal">
              <iframe title="Monitoring Kota Medan" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d94465.81594932565!2d98.66584721754033!3d3.5819366137356603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313139110e1f25%3A0xd1f0aff6684b1928!2sBADAN%20KESBANGPOL%20KOTA%20MEDAN!5e0!3m2!1sid!2sid!4v1755604204263!5m2!1sid!2sid" className="w-full rounded-2xl shadow-xl border border-border" style={{ border: 0, height: "250px" }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black text-sm">© {currentYear} SIDINI - Pemerintah Kota Medan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Page;
