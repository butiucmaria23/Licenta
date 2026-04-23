"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Package {
  id: string;
  title: string; titleEn?: string | null;
  destination: string; destinationEn?: string | null;
  price: number;
  startDate: string;
  endDate: string;
  maxSlots: number;
  _count: { reservations: number };
}

export default function AdminPackagesPage() {
  const { user, token, isAdmin, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAdmin) { router.push("/login"); return; }
    fetchPackages();
  }, [user, isAdmin, isLoading]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data);
    } catch { console.error("Error fetching packages"); }
    setLoading(false);
  };

  const deletePackage = async (id: string, title: string) => {
    if (!confirm(language === "ro"
      ? `Ești sigur că dorești să ștergi pachetul "${title}"? Toate rezervările asociate vor fi șterse.`
      : `Are you sure you want to delete the package "${title}"? All associated reservations will be deleted.`
    )) return;
    try {
      await fetch(`/api/packages/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchPackages();
    } catch { console.error("Error deleting package"); }
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  if (isLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="bg-gradient-to-b from-amber-100 dark:from-amber-950/30 to-transparent py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/admin" className="text-amber-600 dark:text-amber-400 text-sm hover:underline mb-2 inline-block">
              ← {t("admin.dashboard")}
            </Link>
            <h1 className="text-4xl font-bold">
              {language === "ro" ? "Gestionare" : "Manage"}{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                {language === "ro" ? "Pachete" : "Packages"}
              </span>
            </h1>
          </div>
          <Link href="/admin/packages/new"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 text-center"
          >
             {t("admin.newPackage")}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 -mt-4">
        {packages.length === 0 ? (
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
                    <th className="text-left py-4 px-5 font-medium">{t("admin.package")}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Destinație" : "Destination"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Preț" : "Price"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Perioadă" : "Period"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Locuri" : "Slots"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Rezervări" : "Bookings"}</th>
                    <th className="text-right py-4 px-5 font-medium">{language === "ro" ? "Acțiuni" : "Actions"}</th>
                  </tr>
                </thead>
                <motion.tbody 
                  initial="hidden" animate="visible"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                  className="divide-y divide-slate-100 dark:divide-white/5"
                >
                  {packages.map((pkg) => (
                    <motion.tr 
                      key={pkg.id} 
                      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-5"><span className="font-medium text-slate-900 dark:text-white">{language === "en" && pkg.titleEn ? pkg.titleEn : pkg.title}</span></td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{language === "en" && pkg.destinationEn ? pkg.destinationEn : pkg.destination}</td>
                      <td className="py-4 px-5 text-emerald-600 dark:text-emerald-400 font-medium">€{pkg.price}</td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(pkg.startDate).toLocaleDateString(locale)} —{" "}
                        {new Date(pkg.endDate).toLocaleDateString(locale)}
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{pkg.maxSlots}</td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-medium">
                          {pkg._count.reservations}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <Link href={`/admin/packages/${pkg.id}/edit`}
                          className="inline-block px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-xs font-medium"
                        >
                          ️ {language === "ro" ? "Editează" : "Edit"}
                        </Link>
                        <button onClick={() => deletePackage(pkg.id, pkg.title)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-xs font-medium"
                        >
                          ️ {language === "ro" ? "Șterge" : "Delete"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
