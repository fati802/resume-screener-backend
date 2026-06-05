"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/?page=1&page_size=20");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <Link href="/jobs" className="text-sm text-indigo-600 font-medium">Jobs</Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload Resume</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-500 mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
          </div>
          <Link href="/jobs/create" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
            + Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-400 text-center py-20">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="font-semibold text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-gray-500 mb-6">Post your first job to start screening candidates.</p>
            <Link href="/jobs/create" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job: any) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {job.company && `${job.company} • `}
                    {job.min_experience_years} yrs exp •{" "}
                    {job.candidate_count} candidate{job.candidate_count !== 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.required_skills?.slice(0, 5).map((skill: string) => (
                      <span key={skill} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 ml-4">
                  <Link href={`/jobs/${job.id}`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}