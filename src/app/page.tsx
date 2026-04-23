"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Package {
  id: string;
  title: string;
  titleEn?: string;
  destination: string;
  destinationEn?: string;
  price: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Package[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => setFeatured(data.slice(0, 8)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-emerald-100/40 to-slate-100 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-950 transition-colors" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-8 animate-fade-in-up">
            <span></span> {t("hero.badge").replace(" ", "")}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.title1")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent animated-gradient">
              {t("hero.title2")}
            </span>
            <br />
            {t("hero.title3")}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/packages"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-lg"
            >
              {t("hero.explore")}
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:-translate-y-0.5 text-lg"
            >
              {t("hero.createAccount")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50+</div>
              <div className="text-sm text-slate-600 dark:text-slate-500">{t("stats.destinations")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">1000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-500">{t("stats.clients")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.9</div>
              <div className="text-sm text-slate-600 dark:text-slate-500">{t("stats.rating")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              {t("featured.title")}{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {t("featured.titleHighlight")}
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {t("featured.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((pkg, i) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group card-glow bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={pkg.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-slate-200 dark:border-white/10">
                    €{pkg.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                    {language === "en" && pkg.titleEn ? pkg.titleEn : pkg.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <span></span> {language === "en" && pkg.destinationEn ? pkg.destinationEn : pkg.destination}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    {new Date(pkg.startDate).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")} —{" "}
                    {new Date(pkg.endDate).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {featured.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">{t("featured.loading")}</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium"
            >
              {t("featured.all")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-slate-100 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            {t("why.title")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t("why.titleHighlight")}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "", title: t("why.safe.title"), desc: t("why.safe.desc") },
              { icon: "", title: t("why.filter.title"), desc: t("why.filter.desc") },
              { icon: "", title: t("why.admin.title"), desc: t("why.admin.desc") },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 hover:border-emerald-500/20 transition-all group shadow-sm dark:shadow-none"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950 transition-colors border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              {t("testimonials.title")}{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {t("testimonials.titleHighlight")}
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Andrei Popescu", dest: "Maldives", review: language === "ro" ? "Cea mai bună experiență! Echipa a fost minunată, prețurile fantastice." : "The best experience! Wonderful team, fantastic prices." },
              { name: "Elena Ionescu", dest: "Bali", review: language === "ro" ? "Am avut o vacanță de vis, rezervarea a fost rapidă și sigură. Recomand cu încredere!" : "I had a dream vacation, the booking was fast and secure. Highly recommended!" },
              { name: "Mihai Stoica", dest: "Paris", review: language === "ro" ? "M-am bucurat de fiecare moment, pachetul oferea tot ce era necesar." : "I enjoyed every moment, the package had everything needed." },
            ].map((test, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none hover:-translate-y-1 transition-transform cursor-default">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{test.name}</h4>
                    <p className="text-xs text-slate-500 pt-0.5">{language === "ro" ? "A rezervat " : "Booked "}{test.dest}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{test.review}"</p>
                <div className="mt-4 flex gap-1 text-amber-500 dark:text-amber-400 text-sm">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
