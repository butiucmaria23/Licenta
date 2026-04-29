"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { reservations: number; reviews: number };
}

export default function AdminUsersPage() {
  const { user, token, isAdmin, isLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAdmin) { router.push("/login"); return; }
    fetchUsers();
  }, [user, isAdmin, isLoading]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data);
    } catch { console.error("Error fetching users"); }
    setLoading(false);
  };

  const locale = language === "ro" ? "ro-RO" : "en-US";

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="bg-gradient-to-b from-violet-100 dark:from-violet-950/30 to-transparent py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="text-violet-600 dark:text-violet-400 text-sm hover:underline mb-2 inline-block">
            ← {language === "ro" ? "Dashboard" : "Dashboard"}
          </Link>
          <h1 className="text-4xl font-bold">
            {language === "ro" ? "Utilizatori" : "Users"}{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              {language === "ro" ? "înregistrați" : "registered"}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {users.length} {language === "ro" ? "utilizatori totali" : "total users"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 -mt-4">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "ro" ? "Cauta dupa nume sau email..." : "Search by name or email..."}
            className="w-full md:w-96 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all shadow-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500 dark:text-slate-400">
              {language === "ro" ? "Niciun utilizator gasit." : "No users found."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Nume" : "Name"}</th>
                    <th className="text-left py-4 px-5 font-medium">Email</th>
                    <th className="text-left py-4 px-5 font-medium">Rol</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Rezervari" : "Bookings"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Recenzii" : "Reviews"}</th>
                    <th className="text-left py-4 px-5 font-medium">{language === "ro" ? "Inregistrat" : "Joined"}</th>
                  </tr>
                </thead>
                <motion.tbody
                  initial="hidden" animate="visible"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                  className="divide-y divide-slate-100 dark:divide-white/5"
                >
                  {filtered.map((u) => (
                    <motion.tr
                      key={u.id}
                      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-5 font-medium text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "ADMIN"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}>
                          {u.role === "ADMIN" ? "Admin" : "Client"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-medium">
                          {u._count.reservations}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-medium">
                          {u._count.reviews}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString(locale)}
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
