"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params.id as string;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchCandidate();
  }, []);

  const fetchCandidate = async () => {
    try {
      const res = await api.get(`/resume/${candidateId}`);
      setCandidate(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this candidate? This cannot be undone.")) return;
    try {
      await api.delete(`/resume/${candidateId}`);
      router.push("/candidates");
    } catch (err) {
      console.error(err);
    }
  };

  const extractSection = (raw: string, headings: string[]): string[] => {
    if (!raw) return [];
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    let inSection = false;
    const items: string[] = [];
    const allHeadings = [
      "SUMMARY", "EDUCATION", "WORK EXPERIENCE", "EXPERIENCE",
      "SKILLS", "PROJECTS", "CERTIFICATIONS", "CERTIFICATES",
      "SOCIETIES", "ACTIVITIES", "LEADERSHIP", "PUBLICATIONS",
      "AWARDS", "LANGUAGES", "INTERESTS", "REFERENCES"
    ];
    for (const line of lines) {
      const upper = line.toUpperCase();
      if (headings.some(h => upper === h || upper.includes(h))) {
        inSection = true;
        continue;
      }
      if (inSection) {
        const isNewSection = allHeadings.some(h => upper === h);
        if (isNewSection) break;
        if (line.length > 5) items.push(line);
      }
    }
    return items;
  };

  const extractSummary = (raw: string): string => {
    if (!raw) return "";
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    const summaryIdx = lines.findIndex(l => l.toUpperCase() === "SUMMARY");
    if (summaryIdx !== -1) {
      const summaryLines: string[] = [];
      for (let i = summaryIdx + 1; i < lines.length; i++) {
        if (lines[i].toUpperCase() === lines[i] && lines[i].length < 30) break;
        summaryLines.push(lines[i]);
        if (summaryLines.length >= 5) break;
      }
      return summaryLines.join(" ");
    }
    for (const line of lines) {
      if (line.length > 80) return line;
    }
    return "";
  };

  const extractExperience = (raw: string): { title: string; company: string; period: string; details: string }[] => {
    if (!raw) return [];
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    let inSection = false;
    const sectionLines: string[] = [];
    const stopHeadings = ["SKILLS", "PROJECTS", "EDUCATION", "CERTIFICATIONS", "CERTIFICATES", "SOCIETIES", "AWARDS"];
    for (const line of lines) {
      const upper = line.toUpperCase();
      if (upper === "WORK EXPERIENCE" || upper === "EXPERIENCE" || upper === "PROFESSIONAL EXPERIENCE") {
        inSection = true;
        continue;
      }
      if (inSection) {
        if (stopHeadings.includes(upper)) break;
        sectionLines.push(line);
      }
    }
    const entries: { title: string; company: string; period: string; details: string }[] = [];
    let current: { title: string; company: string; period: string; details: string } | null = null;
    for (const line of sectionLines) {
      const periodMatch = line.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)[\s\-–]*(20\d{2}|19\d{2}|present|current)/i)
        || line.match(/\b(20\d{2}|19\d{2})\b/);
      const looksLikeTitle = line.length < 60 && !line.endsWith(".") && line === line.trim();
      if (looksLikeTitle && periodMatch) {
        if (current) entries.push(current);
        current = { title: "", company: "", period: line, details: "" };
      } else if (looksLikeTitle && !periodMatch && line.length < 50) {
        if (current && !current.title) {
          current.title = line;
        } else if (current && !current.company) {
          current.company = line;
        } else {
          if (current) entries.push(current);
          current = { title: line, company: "", period: "", details: "" };
        }
      } else {
        if (!current) current = { title: "Role", company: "", period: "", details: "" };
        current.details += (current.details ? " " : "") + line;
      }
    }
    if (current) entries.push(current);
    return entries.filter(e => e.title || e.company || e.details);
  };

  const extractLeadership = (raw: string): string[] => {
    const fromSection = extractSection(raw, ["SOCIETIES", "LEADERSHIP", "ACTIVITIES", "CO-CURRICULAR", "EXTRACURRICULAR"]);
    if (fromSection.length > 0) return fromSection.slice(0, 8);
    if (!raw) return [];
    const keywords = ["society", "president", "head", "lead", "organiz", "manage", "outreach", "sponsorship", "event", "volunteer", "club", "committee", "captain", "coordinator"];
    return raw.split("\n").map(l => l.trim()).filter(l =>
      l.length > 10 && l.length < 200 && keywords.some(k => l.toLowerCase().includes(k))
    ).slice(0, 6);
  };

  const extractCertificates = (raw: string): string[] => {
    return extractSection(raw, ["CERTIFICATIONS", "CERTIFICATES", "CERTIFICATION", "COURSES", "TRAINING"]).slice(0, 8);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );

  if (!candidate) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Candidate not found.</div>
    </div>
  );

  const parsed = candidate.parsed_data || {};
  const summary = extractSummary(candidate.raw_text || "");
  const experienceEntries = extractExperience(candidate.raw_text || "");
  const leadership = extractLeadership(candidate.raw_text || "");
  const certificates = extractCertificates(candidate.raw_text || "");
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">RS</span>
            </div>
            <span className="font-semibold text-gray-900">Resume Screener</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Jobs</Link>
            <Link href="/candidates" className="text-sm text-indigo-600 font-medium">Candidates</Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload Resume</Link>
            <Link href="/ranking" className="text-sm text-gray-600 hover:text-gray-900">Ranking</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <span className="text-indigo-600 text-2xl font-bold">
                  {candidate.full_name?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{candidate.full_name}</h1>
                <p className="text-gray-500">{candidate.email}</p>
                {candidate.phone && <p className="text-gray-500 text-sm">{candidate.phone}</p>}
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{parsed.total_experience_years || 0} yrs</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Skills Found</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{parsed.skills?.length || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Resume File</p>
              <p className="text-sm font-medium text-gray-900 mt-1 truncate">{candidate.original_filename}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📝</span>
              <h2 className="font-semibold text-gray-900">Summary</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Skills */}
        {parsed.skills?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⚡</span>
              <h2 className="font-semibold text-gray-900">Skills</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{parsed.skills.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsed.skills.map((skill: string) => (
                <span key={skill} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {parsed.education?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎓</span>
              <h2 className="font-semibold text-gray-900">Education</h2>
            </div>
            <div className="space-y-4">
              {parsed.education.map((edu: any, i: number) => {
                const endYear = edu.year ? parseInt(edu.year.split(/[-–]/).pop() || "0") : null;
                const inProgress = endYear && endYear > currentYear;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                        {inProgress ? (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">🔄 In Progress</span>
                        ) : endYear ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✅ Completed</span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{edu.institution}{edu.year ? ` • ${edu.year}` : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {experienceEntries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💼</span>
              <h2 className="font-semibold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-5">
              {experienceEntries.map((exp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    {exp.title && <p className="font-medium text-gray-900">{exp.title}</p>}
                    {exp.company && <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>}
                    {exp.period && <p className="text-xs text-gray-400 mt-0.5">📅 {exp.period}</p>}
                    {exp.details && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.details.slice(0, 300)}{exp.details.length > 300 ? "..." : ""}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certificates.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏆</span>
              <h2 className="font-semibold text-gray-900">Certifications</h2>
            </div>
            <div className="space-y-2">
              {certificates.map((cert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Societies & Leadership */}
        {leadership.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏅</span>
              <h2 className="font-semibold text-gray-900">Societies & Leadership</h2>
            </div>
            <div className="space-y-2">
              {leadership.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer with live clock */}
        <div className="mt-2 bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>🕐</span>
            <span>{currentTime.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <span className="font-mono text-indigo-600 font-semibold text-lg">
            {currentTime.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>

      </div>
    </div>
  );
}