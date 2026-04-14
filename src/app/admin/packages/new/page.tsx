"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function NewPackagePage() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", titleEn: "", destination: "", destinationEn: "", description: "", descriptionEn: "",
    price: "", startDate: "", endDate: "", maxSlots: "", imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === "ro" ? "Eroare la crearea pachetului" : "Error creating package"));
    }
    setLoading(false);
  };

  const lbl = (ro: string, en: string) => language === "ro" ? ro : en;
  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="bg-gradient-to-b from-amber-100 dark:from-amber-950/30 to-transparent py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/packages" className="text-amber-600 dark:text-amber-400 text-sm hover:underline mb-2 inline-block">
            ← {lbl("Înapoi la pachete", "Back to packages")}
          </Link>
          <h1 className="text-4xl font-bold">
            {lbl("Pachet", "New")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {lbl("Nou", "Package")}
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20 -mt-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-8 space-y-5 shadow-sm dark:shadow-none">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Titlu pachet *", "Package title *")}</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Santorini Dream Escape" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Titlu pachet (EN)", "Package title (EN)")}</label>
              <input type="text" name="titleEn" value={form.titleEn} onChange={handleChange} placeholder="Ex: Santorini Dream Escape" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Destinație *", "Destination *")}</label>
              <input type="text" name="destination" value={form.destination} onChange={handleChange} required placeholder={lbl("Ex: Santorini, Grecia", "Ex: Santorini, Greece")} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Destinație (EN)", "Destination (EN)")}</label>
              <input type="text" name="destinationEn" value={form.destinationEn} onChange={handleChange} placeholder="Ex: Santorini, Greece" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Preț per persoană (€) *", "Price per person (€) *")}</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="999.99" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Data început *", "Start date *")}</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Data sfârșit *", "End date *")}</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Nr. maxim locuri *", "Max slots *")}</label>
              <input type="number" name="maxSlots" value={form.maxSlots} onChange={handleChange} required min="1" placeholder="20" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("URL Imagine", "Image URL")}</label>
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Descriere *", "Description *")}</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                placeholder={lbl("Descrierea detaliată a pachetului turistic...", "Detailed description of the travel package...")}
                className={inputCls + " resize-none"}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1.5">{lbl("Descriere (EN)", "Description (EN)")}</label>
              <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows={4}
                placeholder="Detailed description of the travel package..."
                className={inputCls + " resize-none"}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {loading ? lbl("Se creează...", "Creating...") : lbl("✅ Creează Pachet", "✅ Create Package")}
            </button>
            <button type="button" onClick={() => router.push("/admin/packages")}
              className="px-8 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium"
            >
              {t("res.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
