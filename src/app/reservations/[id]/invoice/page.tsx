"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";
import { motion } from "framer-motion";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const { token, user } = useAuth();
  const { language } = useLanguage();
  const t = (key: string) => {
    const keys = key.split(".");
    let obj: any = translations[language];
    for (const k of keys) obj = obj?.[k];
    return obj || key;
  };

  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchReservation();
  }, [token, id]);

  const fetchReservation = async () => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReservation(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!reservation) return <div className="p-10 text-center text-red-500">Invoice not found.</div>;

  const invoiceNumber = `INV-${reservation.id.slice(-8).toUpperCase()}`;
  const date = new Date(reservation.createdAt).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        {/* Actions - Hidden when printing */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <button 
            onClick={() => window.history.back()}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 transition-colors"
          >
            ← {language === "ro" ? "Înapoi" : "Back"}
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            {language === "ro" ? "Printează Factura" : "Print Invoice"}
          </button>
        </div>

        {/* Invoice Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-10 md:p-16 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 print:shadow-none print:border-none print:p-0"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-10 mb-10">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 italic">
                Pack&Go<span className="text-emerald-500">.</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">
                Strada Universității Nr. 1, <br />
                București, România <br />
                contact@packandgo.ro
              </p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {language === "ro" ? "FACTURĂ" : "INVOICE"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">#{invoiceNumber}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{date}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {language === "ro" ? "Client" : "Billed To"}
              </h3>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{reservation.user.name}</p>
              <p className="text-slate-500 dark:text-slate-400">{reservation.user.email}</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {language === "ro" ? "Status Plată" : "Payment Status"}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-200 dark:border-emerald-500/30">
                {language === "ro" ? "ACHITAT" : "PAID"}
              </span>
              <p className="text-xs text-slate-400 mt-2">Stripe Payment Gateway</p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden mb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {language === "ro" ? "Descriere Servicii" : "Description"}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    {language === "ro" ? "Pers." : "Qty"}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    {language === "ro" ? "Preț/Pers." : "Rate"}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    {language === "ro" ? "Total" : "Amount"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="px-6 py-6">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === "en" && reservation.package.titleEn ? reservation.package.titleEn : reservation.package.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {language === "en" && reservation.package.destinationEn ? reservation.package.destinationEn : reservation.package.destination} <br />
                      {new Date(reservation.package.startDate).toLocaleDateString()} - {new Date(reservation.package.endDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-center text-slate-700 dark:text-slate-300">
                    {reservation.numberOfPeople}
                  </td>
                  <td className="px-6 py-6 text-right text-slate-700 dark:text-slate-300">
                    €{reservation.package.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-6 text-right font-bold text-slate-900 dark:text-white">
                    €{reservation.totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 pr-6">
            <div className="flex justify-between w-full max-w-[200px] text-sm">
              <span className="text-slate-500">{language === "ro" ? "Subtotal" : "Subtotal"}</span>
              <span className="text-slate-900 dark:text-white">€{reservation.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[200px] text-sm">
              <span className="text-slate-500">{language === "ro" ? "TVA (0%)" : "VAT (0%)"}</span>
              <span className="text-slate-900 dark:text-white">€0.00</span>
            </div>
            <div className="flex justify-between w-full max-w-[240px] pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{language === "ro" ? "TOTAL ACHITAT" : "TOTAL PAID"}</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">€{reservation.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Footer */}
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-400">
              {language === "ro" 
                ? "Vă mulțumim că ați ales Pack&Go pentru călătoria dumneavoastră!" 
                : "Thank you for choosing Pack&Go for your journey!"}
            </p>
            <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-4 uppercase tracking-[0.2em]">
              This is a computer generated invoice. No signature is required.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
