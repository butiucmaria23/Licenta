"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  } | null;
}

export default function ReservationsPage() {
  const { user, token, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

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

  const [cancellingId, setCancellingId] = useState("");

  const cancelReservation = async (id: string) => {
    if (!confirm(t("res.cancelConfirm") || "Sigur dorești să anulezi această rezervare?")) return;
    
    setCancellingId(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { 
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: "CANCELLED" })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Eroare la anularea rezervării");
      }
      
      // Force a hard refresh to be 100% sure the UI updates
      window.location.reload();
    } catch (err) { 
      console.error("Error cancelling reservation:", err);
      alert(err instanceof Error ? err.message : "Eroare la anularea rezervării");
    } finally {
      setCancellingId("");
    }
  };

  const openReviewModal = (id: string) => {
    setSelectedResId(id);
    setRating(5);
    setComment("");
    setReviewError("");
    setReviewModalOpen(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reservationId: selectedResId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Eroare la adăugarea recenziei");
      }
      setReviewModalOpen(false);
      fetchReservations(); // Reload the data
    } catch(err: any) {
      setReviewError(err.message);
    }
    setReviewLoading(false);
  };

  const handlePayNow = async (reservationId: string) => {
    try {
      const checkoutRes = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reservationId }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error);
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Eroare la procesarea plății");
    }
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      PENDING:   "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      PENDING_PAYMENT: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      CANCELLED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      PAYMENT_FAILED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    };
    const labels: Record<string, string> = {
      CONFIRMED: t("res.confirmed"),
      PENDING: t("res.pending"),
      PENDING_PAYMENT: language === "en" ? "Pending Payment" : "Așteaptă plata",
      CANCELLED: t("res.cancelled"),
      PAYMENT_FAILED: language === "en" ? "Payment Failed" : "Plată eșuată",
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
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            className="space-y-4"
          >
            <AnimatePresence>
              {reservations.map((r) => {
                const isFinished = r.status === "CONFIRMED" && new Date(r.package.endDate) < new Date();
                return (
                <motion.div 
                  layout
                  key={r.id} 
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-none"
                >
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
                          <span> {new Date(r.package.startDate).toLocaleDateString(locale)} - {new Date(r.package.endDate).toLocaleDateString(locale)}</span>
                          <span> {r.numberOfPeople} {t("res.people")}</span>
                          <span> {t("res.booked")} {new Date(r.createdAt).toLocaleDateString(locale)}</span>
                        </div>
                        {r.review && (
                          <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-amber-500 text-sm">
                                {"★".repeat(r.review.rating)}{"☆".repeat(5 - r.review.rating)}
                              </div>
                              <span className="text-xs font-semibold text-slate-400">
                                {language === "en" ? "Your review" : "Recenzia ta"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{r.review.comment}"</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">€{r.totalPrice.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">{t("res.total")}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {r.status === "PENDING_PAYMENT" && (
                            <button onClick={() => handlePayNow(r.id)}
                              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-md shadow-blue-500/20"
                            >
                              {language === "en" ? "Pay Now" : "Plătește acum"}
                            </button>
                          )}
                          {r.status === "PENDING_PAYMENT" && (
                            <button 
                              onClick={() => cancelReservation(r.id)}
                              disabled={cancellingId === r.id}
                              className="relative z-10 cursor-pointer px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium disabled:opacity-50"
                            >
                              {cancellingId === r.id ? (language === "en" ? "Cancelling..." : "Anulare...") : t("res.cancel")}
                            </button>
                          )}
                          {r.status === "CONFIRMED" && (
                            <button 
                              onClick={() => router.push(`/reservations/${r.id}/invoice`)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500/30 transition-all text-sm font-medium flex items-center gap-2"
                            >
                              <span>📄</span> {language === "ro" ? "Vezi Factura" : "View Invoice"}
                            </button>
                          )}
                          {isFinished && !r.review && (
                            <button onClick={() => openReviewModal(r.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all text-sm font-medium"
                            >
                              {language === "en" ? "Leave review" : "Lasă o recenzie"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
      {reviewModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-white/10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">{language === "en" ? "Review your trip" : "Evaluează vacanța"}</h2>
            {reviewError && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-sm">
                {reviewError}
              </div>
            )}
            <form onSubmit={submitReview}>
              <div className="mb-5 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === "en" ? "Rating:" : "Notă:"}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`text-3xl focus:outline-none transition-colors ${rating >= star ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === "en" ? "Share your experience (comment):" : "Împărtășește experiența ta (comentariu):"}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={language === "en" ? "I loved the location and the guide was fantastic..." : "Locația a fost minunată, iar ghidul fantastic..."}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all min-h-[120px]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium"
                >
                  {language === "en" ? "Cancel" : "Anulează"}
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50"
                >
                  {reviewLoading ? (language === "en" ? "Submitting..." : "Se trimite...") : (language === "en" ? "Submit review" : "Trimite recenzia")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
