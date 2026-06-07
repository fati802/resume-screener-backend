"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const P = "#404E3B";
const S = "#7B9669";
const A = "#BAC8B1";
const SLATE = "#6C8480";
const PALE = "#E6E6E6";

const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
  help: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  upload: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  clock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  trendUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
};

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
    { icon: Icons.dashboard, label: "Dashboard", href: "/dashboard", key: "dashboard" },
    { icon: Icons.search, label: "Screener", href: "/ranking", key: "ranking" },
    { icon: Icons.users, label: "Candidates", href: "/candidates", key: "candidates" },
    { icon: Icons.briefcase, label: "Jobs", href: "/jobs", key: "jobs" },
    { icon: Icons.chart, label: "Reports", href: "/ranking", key: "reports" },
    { icon: Icons.star, label: "Shortlisted", href: "/candidates", key: "shortlisted" },
    { icon: Icons.settings, label: "Settings", href: "/settings", key: "settings" },
    { icon: Icons.help, label: "Help & Support", href: "/help", key: "help" },
  ];

  const stats = [
    { icon: Icons.users, label: "Total Candidates", value: candidates.length, sub: "Active pipeline" },
    { icon: Icons.briefcase, label: "Active Jobs", value: jobs.filter((j: any) => j.is_active !== false).length, sub: "Currently open" },
    { icon: Icons.chart, label: "Total Jobs", value: jobs.length, sub: "All postings" },
    { icon: Icons.trendUp, label: "Avg. Candidates", value: jobs.length > 0 ? Math.round(candidates.length / jobs.length) : 0, sub: "Per job" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: PALE }}>
      <div style={{ color: P }} className="font-semibold text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: PALE }}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col min-h-screen fixed left-0 top-0 z-10" style={{ background: P }}>
        <div className="px-5 py-5" style={{ borderBottom: `1px solid rgba(186,200,177,0.2)` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: S }}>
              <span className="text-white text-xs font-bold">RS</span>
            </div>
            <span className="text-white font-bold text-sm">ResumeScreener</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setActiveNav(item.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={activeNav === item.key
                ? { background: S, color: "#fff", fontWeight: 600 }
                : { color: A }
              }
              onMouseEnter={e => {
                if (activeNav !== item.key) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(186,200,177,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }
              }}
              onMouseLeave={e => {
                if (activeNav !== item.key) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = A;
                }
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: `1px solid rgba(186,200,177,0.2)` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: S }}>
              {user?.full_name?.charAt(0) || "F"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{formatName(user?.full_name)}</p>
              <p className="text-xs truncate" style={{ color: A }}>{user?.company || "HR Manager"}</p>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ color: A }}
              className="flex-shrink-0 hover:text-red-400 transition-colors">
              {Icons.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">

        {/* Top navbar */}
        <header className="bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ borderBottom: `1px solid ${A}` }}>
          <div />
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: SLATE }}>
            <span style={{ color: A }}>{Icons.clock}</span>
            <span>{currentTime.toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span style={{ color: A }}>|</span>
            <span className="font-mono font-semibold" style={{ color: P }}>
              {currentTime.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button style={{ color: SLATE }} className="hover:opacity-70 transition-opacity">
              {Icons.bell}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: S }}>
                {user?.full_name?.charAt(0) || "F"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: P }}>{formatName(user?.full_name)}</p>
                <p className="text-xs" style={{ color: SLATE }}>{user?.company || "HR Manager"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">

          {/* Welcome */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: P }}>
                Welcome back, {user?.full_name?.split(" ")[0]?.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Fatiha"}
              </h1>
              <p className="text-sm mt-1" style={{ color: SLATE }}>Screen smarter. Hire better.</p>
            </div>
            <Link href="/jobs/create"
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: P }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = S}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = P}
            >
              {Icons.plus}
              Post New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left col */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload area */}
              <Link href="/upload">
                <div className="bg-white rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
                  style={{ border: `2px dashed ${A}` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = S;
                    (e.currentTarget as HTMLElement).style.background = "#f0f4ee";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = A;
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: PALE, color: S }}>
                    {Icons.upload}
                  </div>
                  <p className="font-semibold text-base" style={{ color: P }}>Upload CVs / Resumes</p>
                  <p className="text-sm mt-1" style={{ color: SLATE }}>Click to browse files</p>
                  <p className="text-xs mt-1" style={{ color: A }}>Supports PDF, DOCX · Max 10MB</p>
                </div>
              </Link>

              {/* Stats */}
              <div>
                <h2 className="font-semibold text-sm mb-3" style={{ color: P }}>Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-default"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 15px rgba(64,78,59,0.12)`}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-3 flex-shrink-0"
                        style={{ background: PALE, color: S }}>
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold" style={{ color: P }}>{stat.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: SLATE }}>{stat.label}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span style={{ color: S }}>{Icons.trendUp}</span>
                        <p className="text-xs" style={{ color: S }}>{stat.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Candidates */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-sm" style={{ color: P }}>Recent Candidates</h2>
                  <Link href="/candidates" className="text-xs font-medium hover:underline" style={{ color: S }}>View all</Link>
                </div>
                {candidates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: PALE, color: A }}>
                      {Icons.users}
                    </div>
                    <p className="text-sm" style={{ color: A }}>No candidates yet.</p>
                    <Link href="/upload" className="text-sm font-medium hover:underline mt-1 inline-block" style={{ color: S }}>Upload a resume</Link>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: PALE }}>
                    {candidates.map((c: any) => (
                      <Link key={c.id} href={`/candidates/${c.id}`}>
                        <div className="flex items-center justify-between py-3 px-2 rounded-xl transition-all duration-150"
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: S }}>
                              {c.full_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: P }}>{formatName(c.full_name)}</p>
                              <p className="text-xs" style={{ color: SLATE }}>{c.total_experience_years} yrs experience</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {c.skills?.slice(0, 2).map((skill: string) => (
                              <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: PALE, color: P }}>
                                {skill}
                              </span>
                            ))}
                            {c.skills?.length > 2 && (
                              <span className="text-xs" style={{ color: A }}>+{c.skills.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right col */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm" style={{ color: P }}>Recent Screenings</h2>
                <Link href="/jobs" className="text-xs font-medium hover:underline" style={{ color: S }}>View all</Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-10 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: PALE, color: A }}>
                    {Icons.briefcase}
                  </div>
                  <p className="text-sm" style={{ color: A }}>No screenings yet.</p>
                  <Link href="/jobs/create" className="text-sm font-medium hover:underline mt-1 inline-block" style={{ color: S }}>Create your first job</Link>
                </div>
              ) : (
                <div className="flex-1 divide-y" style={{ borderColor: PALE }}>
                  {jobs.map((job: any) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div className="flex items-center justify-between py-3 px-2 rounded-xl transition-all duration-150"
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: PALE, color: S }}>
                            {Icons.file}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: P }}>{job.title}</p>
                            <p className="text-xs" style={{ color: SLATE }}>{job.company || "—"} · {job.candidate_count} candidates</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                          style={job.candidate_count > 0
                            ? { background: PALE, color: S }
                            : { background: A, color: P }
                          }>
                          {job.candidate_count > 0 ? "Active" : "New"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Quick actions */}
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${PALE}` }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: A }}>Quick Actions</p>
                {[
                  { icon: Icons.upload, label: "Upload Resume", href: "/upload" },
                  { icon: Icons.plus, label: "Post New Job", href: "/jobs/create" },
                  { icon: Icons.chart, label: "Rank Candidates", href: "/ranking" },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                    style={{ color: P }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f4ee"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <span style={{ color: S }}>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="mt-6" style={{ background: P, color: A }}>
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: S }}>
                    <span className="text-white text-xs font-bold">RS</span>
                  </div>
                  <span className="text-white font-bold text-sm">ResumeScreener</span>
                </div>
                <p className="text-xs leading-relaxed">Smart CV screening to find the right talent, faster.</p>
                <div className="flex gap-3 mt-3">
                  {["in", "tw", "gh", "db"].map(s => (
                    <div key={s} className="w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors"
                      style={{ background: "rgba(186,200,177,0.15)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = S}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(186,200,177,0.15)"}
                    >{s}</div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Platform</h4>
                {[["Dashboard", "/dashboard"], ["Screener", "/ranking"], ["Candidates", "/candidates"], ["Jobs", "/jobs"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs py-1 transition-colors hover:text-white">{label}</Link>
                ))}
              </div>

              <div className="text-center">
                <p className="text-xs mb-2 uppercase tracking-wide">Designed & Developed by</p>
                <p className="text-white font-bold text-lg italic" style={{ fontFamily: "Georgia, serif" }}>
                  {formatName(user?.full_name) || "Fatiha Sheikh"}
                </p>
                <p className="text-xs mt-2 leading-relaxed opacity-70">Building impactful digital experiences<br />with clean code and creative design.</p>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Company</h4>
                {[["About Us", "/about"], ["Careers", "/careers"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Contact Us", "/contact"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs py-1 transition-colors hover:text-white">{label}</Link>
                ))}
              </div>
            </div>

            <div className="pt-4 text-center text-xs opacity-60" style={{ borderTop: `1px solid rgba(186,200,177,0.2)` }}>
              © {new Date().getFullYear()} ResumeScreener. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}