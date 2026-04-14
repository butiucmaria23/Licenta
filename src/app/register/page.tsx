"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError(t("reg.pwdMismatch")); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("reg.error"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-cyan-50/20 to-slate-100 dark:from-slate-950 dark:via-cyan-950/20 dark:to-slate-950 transition-colors" />

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-xl dark:shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-4xl">🌍</span>
            <h1 className="text-2xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">{t("reg.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("reg.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("reg.fullName")}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder={t("reg.namePlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder={t("reg.emailPlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("reg.password")}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                placeholder={t("reg.passwordPlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("reg.confirmPassword")}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                placeholder={t("reg.confirmPlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {loading ? t("reg.loading") : t("reg.btn")}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {t("reg.hasAccount")}{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">{t("reg.signIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
