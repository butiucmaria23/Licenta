"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Package {
  id: string; title: string; titleEn?: string;
  destination: string; destinationEn?: string;
  description: string; descriptionEn?: string;
  price: number; startDate: string; endDate: string; maxSlots: number;
  imageUrl: string;
  reservations: { id: string; numberOfPeople: number; status: string }[];
  _count: { reservations: number };
}

export default function PackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [numberOfPeople, setNumberOfPeople] = useState<number | "">(1);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/packages/${id}`)
      .then((res) => res.json())
      .then((data) => { setPkg(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const bookedSlots = pkg?.reservations?.filter((r) => r.status !== "CANCELLED").reduce((sum, r) => sum + r.numberOfPeople, 0) || 0;
  const available = pkg ? Math.max(0, pkg.maxSlots - bookedSlots) : 0;

  const handleBook = async () => {
    if (!user) { router.push("/login"); return; }
    setBooking(true); setMessage(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageId: id, numberOfPeople: numberOfPeople || 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: `${t("pkg.bookSuccess")}${data.totalPrice}` });
      const updated = await fetch(`/api/packages/${id}`).then((r) => r.json());
      setPkg(updated);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("pkg.bookError") });
    }
    setBooking(false);
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-xl text-slate-500 dark:text-slate-400">{t("pkg.notFound")}</p>
        <button onClick={() => router.push("/packages")} className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline">
          {t("pkg.back")}
        </button>
      </div>
    </div>
  );

  const pkgTitle = language === "en" && pkg.titleEn ? pkg.titleEn : pkg.title;
  const pkgDest  = language === "en" && pkg.destinationEn ? pkg.destinationEn : pkg.destination;
  const pkgDesc  = language === "en" && pkg.descriptionEn ? pkg.descriptionEn : pkg.description;
  const days = Math.ceil((new Date(pkg.endDate).getTime() - new Date(pkg.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={pkg.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop"} alt={pkgTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <button onClick={() => router.push("/packages")} className="text-slate-300 hover:text-white mb-4 text-sm flex items-center gap-1">
            {t("pkg.back")}
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{pkgTitle}</h1>
          <p className="text-lg text-slate-300 flex items-center gap-2"><span></span> {pkgDest}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "", val: `€${pkg.price}`, label: t("pkg.perPerson"), cls: "text-emerald-600 dark:text-emerald-400" },
                { icon: "", val: String(days), label: t("pkg.days"), cls: "text-cyan-600 dark:text-cyan-400" },
                { icon: "", val: String(available), label: t("pkg.availableSlots"), cls: available > 5 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400" },
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center shadow-sm dark:shadow-none">
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className={`text-2xl font-bold ${c.cls}`}>{c.val}</div>
                  <div className="text-xs text-slate-500">{c.label}</div>
                </div>
              ))}
              <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center shadow-sm dark:shadow-none">
                <div className="text-2xl mb-1">️</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {new Date(pkg.startDate).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                </div>
                <div className="text-xs text-slate-500">
                  — {new Date(pkg.endDate).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold mb-4">{t("pkg.description")}</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{pkgDesc}</p>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold mb-4">{t("pkg.location")} — {pkgDest}</h2>
              <div className="rounded-xl overflow-hidden aspect-[16/9]">
                <iframe width="100%" height="100%" style={{ border: 0, minHeight: "350px" }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(pkg.destination)}&output=embed`}
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm dark:shadow-none">
              <h3 className="text-xl font-bold mb-1">{t("pkg.bookNow")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("pkg.instantConfirm")}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("pkg.numPeople")}</label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setNumberOfPeople(Math.max(1, (numberOfPeople as number) - 1))}
                      disabled={(numberOfPeople as number) <= 1 || available <= 0}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none shadow-sm"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={numberOfPeople}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val === "") {
                          setNumberOfPeople("");
                        } else {
                          const n = parseInt(val, 10);
                          setNumberOfPeople(Math.min(n, available));
                        }
                      }}
                      onBlur={() => {
                        const n = Number(numberOfPeople);
                        if (!n || n < 1) setNumberOfPeople(1);
                        else if (n > available) setNumberOfPeople(available);
                      }}
                      className="w-20 text-center text-2xl font-bold px-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all disabled:opacity-50"
                      disabled={available <= 0}
                    />
                    <button
                      type="button"
                      onClick={() => setNumberOfPeople(Math.min(available, (numberOfPeople as number) + 1))}
                      disabled={(numberOfPeople as number) >= available || available <= 0}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{t("pkg.pricePerPerson")}</span>
                    <span className="text-slate-900 dark:text-white">€{pkg.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{t("pkg.people")}</span>
                    <span className="text-slate-900 dark:text-white">×{numberOfPeople || 1}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-white/10 pt-2 flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{t("pkg.total")}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">€{(pkg.price * (numberOfPeople || 1)).toFixed(2)}</span>
                  </div>
                </div>

                {available <= 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
                    {t("pkg.noSpots")}
                  </div>
                )}

                {message && (
                  <div className={`p-3 rounded-xl text-sm ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"}`}>
                    {message.text}
                  </div>
                )}

                <button onClick={handleBook} disabled={booking || available <= 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {booking ? t("pkg.processing") : available <= 0 ? t("pkg.soldOut") : t("pkg.book")}
                </button>

                {!user && (
                  <p className="text-xs text-center text-slate-500">
                    {t("pkg.loginRequired")}{" "}
                    <a href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">{t("pkg.loginRequired2")}</a>{" "}
                    {t("pkg.loginRequired3")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
