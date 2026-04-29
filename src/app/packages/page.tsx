"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface Package {
  id: string;
  title: string;
  titleEn?: string;
  destination: string;
  destinationEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  startDate: string;
  endDate: string;
  maxSlots: number;
  imageUrl: string;
  _count: { reservations: number };
}

export default function PackagesPage() {
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async (options?: { searchStr?: string, min?: string, max?: string }) => {
    setLoading(true);
    const params = new URLSearchParams();
    const s = options?.searchStr ?? search;
    const minP = options?.min ?? minPrice;
    const maxP = options?.max ?? maxPrice;
    
    if (s) params.set("search", s);
    if (minP) params.set("minPrice", minP);
    if (maxP) params.set("maxPrice", maxP);
    
    try {
      const res = await fetch(`/api/packages?${params}`);
      const data = await res.json();
      setPackages(data);
    } catch { console.error("Error fetching packages"); }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchPackages(); };

  const clearFilters = () => {
    setSearch(""); setMinPrice(""); setMaxPrice("");
    fetchPackages({ searchStr: "", min: "", max: "" });
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-100 dark:from-emerald-950/40 to-transparent py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pkgs.title")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t("pkgs.titleHighlight")}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t("pkgs.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Filters */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6 mb-8 -mt-4 shadow-sm dark:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("pkgs.search")}</label>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("pkgs.searchPlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("pkgs.minPrice")}</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{t("pkgs.maxPrice")}</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="5000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25">
              {t("pkgs.searchBtn")}
            </button>
            <button type="button" onClick={clearFilters} className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium">
              {t("pkgs.reset")}
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 mt-4">{t("pkgs.loading")}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4"></p>
            <p className="text-xl text-slate-500 dark:text-slate-400">{t("pkgs.noResults")}</p>
            <button onClick={clearFilters} className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline">{t("pkgs.resetFilters")}</button>
          </div>
        ) : (
          <>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {packages.length} {packages.length !== 1 ? t("pkgs.found.many") : t("pkgs.found.one")}
            </p>
            <motion.div 
              initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {packages.map((pkg) => {
                const slotsUsed = pkg.reservations?.reduce((sum, r) => sum + r.numberOfPeople, 0) || 0;
                const available = Math.max(0, pkg.maxSlots - slotsUsed);
                return (
                  <motion.div key={pkg.id} variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                    <Link href={`/packages/${pkg.id}`}
                    className="group card-glow bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 shadow-sm dark:shadow-none"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img src={pkg.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"} alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 font-bold text-lg border border-slate-200 dark:border-white/10">
                        €{pkg.price}
                      </div>
                      {available <= 3 && available > 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-medium animate-pulse-subtle">
                          {t("pkgs.slots.few").replace("{n}", String(available))}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5">
                        {language === "en" && pkg.titleEn ? pkg.titleEn : pkg.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                        <span></span> {language === "en" && pkg.destinationEn ? pkg.destinationEn : pkg.destination}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                        {language === "en" && pkg.descriptionEn ? pkg.descriptionEn : pkg.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span> {new Date(pkg.startDate).toLocaleDateString(locale)} — {new Date(pkg.endDate).toLocaleDateString(locale)}</span>
                        <span className={available > 5 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                          {t("pkgs.slots").replace("{n}", String(available))}
                        </span>
                      </div>
                    </div>
                  </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
