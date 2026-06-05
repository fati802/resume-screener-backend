"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RankingPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/?page=1&page_size=20");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRank = async () => {
    if (!selectedJob) return;
    setRankingLoading(true);
    setError("");
    setRanking(null);
    try {
      const res = await api.post("/ranking/rank", { job_id: selectedJob });
      setRanking(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ranking failed.");
    } finally {
      setRankingLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload Resume</Link>
            <Link href="/ranking" className="text-sm text-indigo-600 font-medium">Ranking</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Candidate Ranking</h1>
          <p className="text-gray-500 mt-1">Select a job to rank all candidates against it.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a job...</option>
              {jobs.map((job: any) => (
                <option key={job.id} value={job.id}>
                  {job.title} {job.company ? `— ${job.company}` : ""}
                </option>
              ))}
            </select>
            <button
              onClick={handleRank}
              disabled={!selectedJob || rankingLoading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {rankingLoading ? "Ranking..." : "Rank Candidates"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {ranking && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-lg">
                Results for: {ranking.job_title}
              </h2>
              <span className="text-sm text-gray-500">{ranking.total_candidates} candidates ranked</span>
            </div>
            <div className="space-y-4">
              {ranking.ranked_candidates.map((candidate: any) => (
                <div key={candidate.candidate_id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">#{candidate.rank}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{candidate.full_name}</h3>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(candidate.scores.overall_score)}`}>
                      {candidate.scores.overall_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Skill Match</p>
                      <p className="font-semibold text-gray-900">{candidate.scores.skill_match_score.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Semantic</p>
                      <p className="font-semibold text-gray-900">{candidate.scores.semantic_score.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-900">{candidate.scores.experience_score.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Education</p>
                      <p className="font-semibold text-gray-900">{candidate.scores.education_score.toFixed(1)}%</p>
                    </div>
                  </div>
                  {candidate.skill_gap.missing_required.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Missing Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skill_gap.missing_required.map((skill: string) => (
                          <span key={skill} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}