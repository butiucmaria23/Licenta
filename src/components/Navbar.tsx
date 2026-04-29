"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { user, logout, isAdmin, isLoading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-cyan-600 dark:group-hover:from-emerald-300 dark:group-hover:to-cyan-300 transition-all">
              Pack&Go
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/packages"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
            >
              {t("nav.packages")}
            </Link>

            {!isLoading && user && (
              <Link
                href="/reservations"
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
              >
                {t("nav.myOrders")}
              </Link>
            )}

            {!isLoading && isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition-all text-sm font-medium"
              >
                {t("nav.admin")}
              </Link>
            )}

            {/* Toggle buttons */}
            <div className="flex items-center gap-2 ml-2 border-l border-slate-200 dark:border-white/10 pl-2">
              <button
                onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
                className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all"
              >
                {language.toUpperCase()}
              </button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
                  title={theme === 'light' ? 'Switch to dark' : theme === 'dark' ? 'Switch to system' : 'Switch to light'}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-base"
                >
                  {theme === 'dark' ? '🌙' : theme === 'system' ? '🖥️' : '☀️'}
                </button>
              )}
            </div>

            {!isLoading && !user ? (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all text-sm font-medium shadow-lg shadow-emerald-500/25"
                >
                  {t("nav.register")}
                </Link>
              </div>
            ) : !isLoading && user ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t("nav.hello")} <span className="text-emerald-600 dark:text-emerald-400 font-medium">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all text-sm font-medium"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
              className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 text-xs font-bold"
            >
              {language.toUpperCase()}
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? '🌙' : theme === 'system' ? '🖥️' : '☀️'}
              </button>
            )}
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 pt-2">
            <Link href="/" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
              {t("nav.home")}
            </Link>
            <Link href="/packages" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
              {t("nav.packages")}
            </Link>
            {user && (
              <Link href="/reservations" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
                {t("nav.myOrders")}
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="block px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
                {t("nav.admin")}
              </Link>
            )}
            {!user ? (
              <>
                <Link href="/login" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="block px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10 transition-all text-sm" onClick={() => setMobileOpen(false)}>
                  {t("nav.register")}
                </Link>
              </>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all text-sm">
                {t("nav.logout")}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
