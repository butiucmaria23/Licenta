"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Pack&Go
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{t("footer.nav")}</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t("nav.home")}</a>
              </li>
              <li>
                <a href="/packages" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t("nav.packages")}</a>
              </li>
              <li>
                <a href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t("nav.login")}</a>
              </li>
              <li>
                <a href="/register" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t("nav.register")}</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span>📧</span> contact@packandgo.ro
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +40 123 456 789
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> București, România
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/10 mt-8 pt-8 text-center text-slate-500 dark:text-slate-500 text-sm">
          © {new Date().getFullYear()} {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
