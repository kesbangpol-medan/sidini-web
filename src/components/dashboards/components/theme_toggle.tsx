"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Inisialisasi tema dari localStorage atau preferensi OS
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Jika belum ada preferensi, ikuti OS
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Hindari flash saat hydration
  if (!mounted) return <div className="w-14 h-8" />;

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full border border-border bg-card flex items-center justify-between p-1 transition-all duration-200 cursor-pointer shadow-inner focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-purple-glow)]"
      aria-label={isDark ? "Aktifkan light mode" : "Aktifkan dark mode"}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        <FaSun className="text-amber-500/40 dark:text-amber-500/20 text-[10px] transition-colors" />
        <FaMoon className="text-indigo-400/20 dark:text-indigo-300/40 text-[10px] transition-colors" />
      </div>

      {/* Sliding Knob */}
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="w-6 h-6 rounded-full bg-surface dark:bg-[#0f1117] border border-border shadow-sm hover:shadow-md flex items-center justify-center z-10"
      >
        {isDark ? (
          <FaMoon className="text-amber-300 text-[11px]" />
        ) : (
          <FaSun className="text-amber-500 text-[11px]" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
