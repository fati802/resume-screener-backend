"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/resume/?page=1&page_size=50");
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s resume? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/resume/${id}`);
      setCandidates(candidates.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-500 mt-1">{candidates.length} resume{candidates.length !== 1 ? "s" : ""} uploaded</p>
          </div>
          <Link href="/upload" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
            + Upload Resume
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-400 text-center py-20">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-semibold text-gray-900 mb-2">No candidates yet</h3>
            <p className="text-gray-500 mb-6">Upload resumes to start screening candidates.</p>
            <Link href="/upload" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">File</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Experience</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Skills</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/candidates/${c.id}`} className="font-medium text-gray-900 hover:text-indigo-600">{c.full_name}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.original_filename}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.total_experience_years} yrs</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {c.skills?.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {c.skills?.length > 3 && (
                          <span className="text-xs text-gray-400">+{c.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(c.id, c.full_name)}
                        disabled={deleting === c.id}
                        className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        {deleting === c.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}