"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Reservation {
  id: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  package: {
    id: string;
    title: string;
    titleEn?: string | null;
    destination: string;
    destinationEn?: string | null;
    startDate: string;
    endDate: string;
    imageUrl: string;
  };
}

export default function ReservationsPage() {
  const { user, token, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchReservations();
  }, [user, isLoading]);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations", { headers: { Authorization: `Bearer ${token}` } });
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

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      PENDING:   "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      CANCELLED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    };
    const labels: Record<string, string> = {
      CONFIRMED: t("res.confirmed"),
      PENDING: t("res.pending"),
      CANCELLED: t("res.cancelled"),
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="bg-gradient-to-b from-emerald-100 dark:from-emerald-950/40 to-transparent py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            {t("res.title")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t("res.titleHighlight")}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{t("res.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 -mt-4">
        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4"></p>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-2">{t("res.empty")}</p>
            <p className="text-slate-500 mb-6">{t("res.emptyDesc")}</p>
            <button onClick={() => router.push("/packages")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              {t("res.explore")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-none">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-36 md:h-auto flex-shrink-0">
                    <img src={r.package.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop"}
                      alt={language === "en" && r.package.titleEn ? r.package.titleEn : r.package.title} className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          onClick={() => router.push(`/packages/${r.package.id}`)}
                        >
                          {language === "en" && r.package.titleEn ? r.package.titleEn : r.package.title}
                        </h3>
                        {statusBadge(r.status)}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2"><span></span> {language === "en" && r.package.destinationEn ? r.package.destinationEn : r.package.destination}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span> {new Date(r.package.startDate).toLocaleDateString(locale)} — {new Date(r.package.endDate).toLocaleDateString(locale)}</span>
                        <span> {r.numberOfPeople} {t("res.people")}</span>
                        <span> {t("res.booked")} {new Date(r.createdAt).toLocaleDateString(locale)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">€{r.totalPrice.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{t("res.total")}</div>
                      </div>
                      {r.status !== "CANCELLED" && (
                        <button onClick={() => cancelReservation(r.id)}
                          className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium"
                        >
                          {t("res.cancel")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
