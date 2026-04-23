"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Reservation {
  id: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  package: { id: string; title: string; titleEn?: string | null; destination: string; price: number };
}

export default function AdminReservationsPage() {
  const { user, token, isAdmin, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAdmin) { router.push("/login"); return; }
    fetchReservations();
  }, [user, isAdmin, isLoading]);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/admin/reservations", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setReservations(data);
    } catch { console.error("Error fetching reservations"); }
    setLoading(false);
  };

  const cancelReservation = async (id: string) => {
    if (!confirm(t("res.cancelConfirm"))) return;
    try {
      await fetch(`/api/reservations/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchReservations();
    } catch { console.error("Error cancelling reservation"); }
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: t("admin.confirmed"),
      CANCELLED: t("admin.cancelled"),
      PENDING:   t("admin.pending"),
    };
    return map[status] || status;
  };

  const statusStyle = (status: string) => {
    if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    if (status === "CANCELLED") return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  };

  if (isLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="bg-gradient-to-b from-amber-100 dark:from-amber-950/30 to-transparent py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="text-amber-600 dark:text-amber-400 text-sm hover:underline mb-2 inline-block">
            ← {t("admin.dashboard")}
          </Link>
          <h1 className="text-4xl font-bold">
            {language === "ro" ? "Toate" : "All"}{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {language === "ro" ? "Rezervările" : "Reservations"}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {reservations.length} {language === "ro"
              ? `rezervăr${reservations.length !== 1 ? "i" : "e"} totale`
              : `total reservation${reservations.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 -mt-4">
        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4"></p>
            <p className="text-xl text-slate-500 dark:text-slate-400">{t("admin.noReservations")}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-4 px-5 font-medium">{t("admin.client")}</th>
                    <th className="text-left py-4 px-5 font-medium">Email</th>
                    <th className="text-left py-4 px-5 font-medium">{t("admin.package")}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Persoane" : "People"}</th>
                    <th className="text-left py-4 px-5 font-medium">{t("admin.value")}</th>
                    <th className="text-left py-4 px-5 font-medium">{t("admin.status")}</th>
                    <th className="text-left py-4 px-5 font-medium">{t("admin.date")}</th>
                    <th className="text-right py-4 px-5 font-medium">{language === "ro" ? "Acțiuni" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 font-medium text-slate-900 dark:text-white">{r.user.name}</td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{r.user.email}</td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {language === "en" && r.package.titleEn ? r.package.titleEn : r.package.title}
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{r.numberOfPeople}</td>
                      <td className="py-4 px-5 text-emerald-600 dark:text-emerald-400 font-medium">€{r.totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(r.status)}`}>
                          {statusLabel(r.status)}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(r.createdAt).toLocaleDateString(locale)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {r.status !== "CANCELLED" && (
                          <button onClick={() => cancelReservation(r.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-xs font-medium"
                          >
                            {t("res.cancel")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
