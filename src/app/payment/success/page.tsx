"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Optional: Redirect to reservations after a delay
    const timer = setTimeout(() => {
      router.push("/reservations");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Plată reușită!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Rezervarea ta a fost confirmată. Vei fi redirecționat către pagina de rezervări în câteva secunde.
        </p>
        <Link
          href="/reservations"
          className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25"
        >
          Vezi rezervările mele
        </Link>
      </div>
    </div>
  );
}
