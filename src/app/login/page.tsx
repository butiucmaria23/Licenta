"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.error"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-100 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 transition-colors" />

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-xl dark:shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-4xl">✈️</span>
            <h1 className="text-2xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">{t("login.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("login.password")}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {loading ? t("login.loading") : t("login.btn")}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {t("login.noAccount")}{" "}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">{t("login.signUp")}</Link>
          </p>

          <div className="mt-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-700/30 border border-slate-200 dark:border-white/5">
            <p className="text-xs text-slate-500 text-center mb-1">{t("login.demoAccounts")}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Admin: <span className="text-emerald-600 dark:text-emerald-400">admin@packgo.ro</span> / admin123</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">User: <span className="text-emerald-600 dark:text-emerald-400">maria@example.com</span> / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
