"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        api.get("/jobs/?page=1&page_size=10"),
        api.get("/resume/?page=1&page_size=10"),
      ]);
      setJobs(jobsRes.data.jobs || []);
      setCandidates(candidatesRes.data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatName = (name: string) =>
    name?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  const navItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard", key: "dashboard" },
    { icon: "🔍", label: "Screener", href: "/ranking", key: "ranking" },
    { icon: "👥", label: "Candidates", href: "/candidates", key: "candidates" },
    { icon: "💼", label: "Jobs", href: "/jobs", key: "jobs" },
    { icon: "📊", label: "Reports", href: "/ranking", key: "reports" },
    { icon: "⭐", label: "Shortlisted", href: "/candidates", key: "shortlisted" },
    { icon: "⚙️", label: "Settings", href: "/settings", key: "settings" },
    { icon: "❓", label: "Help & Support", href: "/help", key: "help" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#E6E6E6" }}>
      <div style={{ color: "#404E3B" }} className="font-semibold">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#E6E6E6" }}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col min-h-screen fixed left-0 top-0 z-10" style={{ background: "#404E3B" }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(186,200,177,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7B9669" }}>
              <span className="text-white text-xs font-bold">RS</span>
            </div>
            <span className="text-white font-bold text-base">ResumeScreener</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setActiveNav(item.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={
                activeNav === item.key
                  ? { background: "#7B9669", color: "#fff", fontWeight: 600 }
                  : { color: "#BAC8B1" }
              }
              onMouseEnter={e => {
                if (activeNav !== item.key) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(186,200,177,0.15)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }
              }}
              onMouseLeave={e => {
                if (activeNav !== item.key) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#BAC8B1";
                }
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(186,200,177,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#7B9669" }}>
              {user?.full_name?.charAt(0) || "F"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{formatName(user?.full_name)}</p>
              <p className="text-xs truncate" style={{ color: "#BAC8B1" }}>{user?.company || "HR Manager"}</p>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ color: "#BAC8B1" }}
              className="text-sm hover:text-red-400 transition-colors">↩</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">

        {/* Top navbar */}
        <header className="bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ borderBottom: "1px solid #BAC8B1" }}>
          <div />
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6C8480" }}>
            <span>🕐</span>
            <span>{currentTime.toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span style={{ color: "#BAC8B1" }}>|</span>
            <span className="font-mono font-semibold" style={{ color: "#404E3B" }}>
              {currentTime.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-lg" style={{ color: "#6C8480" }}>🔔</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#7B9669" }}>
                {user?.full_name?.charAt(0) || "F"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#404E3B" }}>{formatName(user?.full_name)}</p>
                <p className="text-xs" style={{ color: "#6C8480" }}>{user?.company || "HR Manager"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">

          {/* Welcome */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#404E3B" }}>
                Welcome back, {user?.full_name?.split(" ")[0]?.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Fatiha"} 👋
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6C8480" }}>Screen smarter. Hire better.</p>
            </div>
            <Link href="/jobs/create"
              className="text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
              style={{ background: "#404E3B" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#7B9669"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#404E3B"}
            >
              <span>＋</span> Post New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload area */}
              <Link href="/upload">
                <div className="bg-white rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
                  style={{ border: "2px dashed #BAC8B1" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#7B9669";
                    (e.currentTarget as HTMLElement).style.background = "#f0f4ee";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#BAC8B1";
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#E6E6E6" }}>
                    <span className="text-2xl">☁️</span>
                  </div>
                  <p className="font-semibold text-lg" style={{ color: "#404E3B" }}>Upload CVs / Resumes</p>
                  <p className="text-sm mt-1" style={{ color: "#6C8480" }}>Click to browse files</p>
                  <p className="text-xs mt-1" style={{ color: "#BAC8B1" }}>Supports PDF, DOCX · Max 10MB</p>
                </div>
              </Link>

              {/* Stats */}
              <div>
                <h2 className="font-semibold mb-3" style={{ color: "#404E3B" }}>Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "👥", label: "Total Candidates", value: candidates.length, sub: "Active pipeline" },
                    { icon: "✅", label: "Active Jobs", value: jobs.filter((j: any) => j.is_active !== false).length, sub: "Currently open" },
                    { icon: "💼", label: "Total Jobs", value: jobs.length, sub: "All postings" },
                    { icon: "📈", label: "Avg. Candidates", value: jobs.length > 0 ? Math.round(candidates.length / jobs.length) : 0, sub: "Per job" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-default"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(64,78,59,0.15)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ""}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg mb-3" style={{ background: "#E6E6E6" }}>
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold" style={{ color: "#404E3B" }}>{stat.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6C8480" }}>{stat.label}</p>
                      <p className="text-xs mt-1" style={{ color: "#7B9669" }}>↑ {stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Candidates */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold" style={{ color: "#404E3B" }}>Recent Candidates</h2>
                  <Link href="/candidates" className="text-xs hover:underline" style={{ color: "#7B9669" }}>View all</Link>
                </div>
                {candidates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm" style={{ color: "#BAC8B1" }}>No candidates yet.</p>
                    <Link href="/upload" className="text-sm hover:underline" style={{ color: "#7B9669" }}>Upload a resume</Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {candidates.map((c: any) => (
                      <Link key={c.id} href={`/candidates/${c.id}`}>
                        <div className="flex items-center justify-between py-2.5 rounded-xl px-3 transition-all duration-150"
                          style={{ borderBottom: "1px solid #E6E6E6" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#7B9669" }}>
                              {c.full_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#404E3B" }}>{formatName(c.full_name)}</p>
                              <p className="text-xs" style={{ color: "#6C8480" }}>{c.total_experience_years} yrs exp</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {c.skills?.slice(0, 2).map((skill: string) => (
                              <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E6E6E6", color: "#404E3B" }}>
                                {skill}
                              </span>
                            ))}
                            {c.skills?.length > 2 && (
                              <span className="text-xs" style={{ color: "#BAC8B1" }}>+{c.skills.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — Recent Screenings */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold" style={{ color: "#404E3B" }}>Recent Screenings</h2>
                <Link href="/jobs" className="text-xs hover:underline" style={{ color: "#7B9669" }}>View all</Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-10 flex-1">
                  <p className="text-sm" style={{ color: "#BAC8B1" }}>No screenings yet.</p>
                  <Link href="/jobs/create" className="text-sm hover:underline" style={{ color: "#7B9669" }}>Create your first job</Link>
                </div>
              ) : (
                <div className="space-y-1 flex-1">
                  {jobs.map((job: any) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div className="flex items-center justify-between py-2.5 rounded-xl px-2 transition-all duration-150"
                        style={{ borderBottom: "1px solid #E6E6E6" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "#E6E6E6" }}>📄</div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#404E3B" }}>{job.title}</p>
                            <p className="text-xs" style={{ color: "#6C8480" }}>{job.company || "—"} · {job.candidate_count} candidates</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                          style={job.candidate_count > 0
                            ? { background: "#E6E6E6", color: "#7B9669" }
                            : { background: "#BAC8B1", color: "#404E3B" }
                          }>
                          {job.candidate_count > 0 ? "Active" : "New"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Quick actions */}
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid #E6E6E6" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "#6C8480" }}>Quick Actions</p>
                {[
                  { icon: "📄", label: "Upload Resume", href: "/upload" },
                  { icon: "💼", label: "Post New Job", href: "/jobs/create" },
                  { icon: "📊", label: "Rank Candidates", href: "/ranking" },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: "#404E3B" }}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="mt-6" style={{ background: "#404E3B", color: "#BAC8B1" }}>
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#7B9669" }}>
                    <span className="text-white text-xs font-bold">RS</span>
                  </div>
                  <span className="text-white font-bold">ResumeScreener</span>
                </div>
                <p className="text-xs leading-relaxed">Smart CV screening to find the right talent, faster.</p>
                <div className="flex gap-3 mt-3">
                  {["in", "tw", "gh", "db"].map(s => (
                    <div key={s} className="w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors"
                      style={{ background: "rgba(186,200,177,0.2)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#7B9669"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(186,200,177,0.2)"}
                    >{s}</div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
                {[["Dashboard", "/dashboard"], ["Screener", "/ranking"], ["Candidates", "/candidates"], ["Jobs", "/jobs"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs py-1 transition-colors hover:text-white">{label}</Link>
                ))}
              </div>

              <div className="text-center">
                <p className="text-xs mb-2">Designed & Developed by</p>
                <p className="text-white font-bold text-xl italic" style={{ fontFamily: "cursive" }}>
                  {formatName(user?.full_name) || "Fatiha Sheikh"}
                </p>
                <p className="text-xs mt-2 leading-relaxed">Building impactful digital experiences<br />with clean code and creative design.</p>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
                {[["About Us", "/about"], ["Careers", "/careers"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Contact Us", "/contact"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs py-1 transition-colors hover:text-white">{label}</Link>
                ))}
              </div>
            </div>

            <div className="pt-4 text-center text-xs" style={{ borderTop: "1px solid rgba(186,200,177,0.2)" }}>
              © {new Date().getFullYear()} ResumeScreener. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}