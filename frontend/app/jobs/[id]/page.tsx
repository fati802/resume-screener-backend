"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
      fetchRanking();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRanking = async () => {
    try {
      const res = await api.get(`/ranking/${jobId}`);
      setRanking(res.data);
    } catch (err) {
      // No ranking yet
    }
  };

  const handleRank = async () => {
    setRankingLoading(true);
    setError("");
    try {
      const res = await api.post("/ranking/rank", { job_id: jobId });
      setRanking(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ranking failed.");
    } finally {
      setRankingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      router.push("/jobs");
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );

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
            <Link href="/jobs" className="text-sm text-indigo-600 font-medium">Jobs</Link>
            <Link href="/candidates" className="text-sm text-gray-600 hover:text-gray-900">Candidates</Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload Resume</Link>
            <Link href="/ranking" className="text-sm text-gray-600 hover:text-gray-900">Ranking</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Job Header */}
        {job && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                {job.company && <p className="text-gray-500 mt-1">{job.company}</p>}
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>Min {job.min_experience_years} years exp</span>
                  <span>{job.candidate_count} candidates</span>
                  <span className={job.is_active ? "text-green-600" : "text-red-500"}>
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/jobs/${jobId}/edit`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-4 text-sm leading-relaxed">{job.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills?.map((skill: string) => (
                    <span key={skill} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Preferred Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.preferred_skills?.map((skill: string) => (
                    <span key={skill} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rank Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Candidate Rankings</h2>
          <button
            onClick={handleRank}
            disabled={rankingLoading}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
          >
            {rankingLoading ? "Ranking..." : "Rank Candidates"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {/* Rankings */}
        {ranking ? (
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
                        <span key={skill} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-500 mb-6">Click Rank Candidates to score and rank all uploaded resumes against this job.</p>
          </div>
        )}
      </div>
    </div>
  );
}