"use client";
import Link from "next/link";

const openings = [
  { title: "Frontend Developer", type: "Remote", dept: "Engineering", desc: "Build beautiful, fast React/Next.js interfaces for our platform." },
  { title: "ML Engineer", type: "Remote", dept: "AI & Data", desc: "Improve our candidate ranking models and NLP pipeline." },
  { title: "HR Product Specialist", type: "Hybrid", dept: "Product", desc: "Help shape product features based on recruiter needs." },
  { title: "Backend Developer", type: "Remote", dept: "Engineering", desc: "Expand our FastAPI backend with new features and integrations." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0f0f1a] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">RS</span>
          </div>
          <span className="text-white font-bold">ResumeScreener</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-gray-400 hover:text-white text-sm">About</Link>
          <Link href="/careers" className="text-white text-sm font-medium">Careers</Link>
          <Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Dashboard</Link>
        </div>
      </nav>

      <div className="bg-[#0f0f1a] px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Join Our Team</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">We're building the future of hiring. Come build it with us.</p>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{job.dept}</span>
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{job.type}</span>
                </div>
                <p className="text-gray-500 text-sm">{job.desc}</p>
              </div>
              <Link href="/contact" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors ml-6 flex-shrink-0">
                Apply
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-indigo-50 rounded-2xl p-8 text-center">
          <p className="font-semibold text-gray-900 mb-2">Don't see your role?</p>
          <p className="text-gray-500 text-sm mb-4">Send us your CV anyway — we'd love to hear from you.</p>
          <Link href="/contact" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700">
            Send an Open Application
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#0f0f1a] text-gray-400 px-8 py-8 text-center text-xs">
      <div className="flex justify-center gap-8 mb-4">
        {[["About", "/about"], ["Careers", "/careers"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]].map(([label, href]) => (
          <Link key={label} href={href} className="hover:text-white">{label}</Link>
        ))}
      </div>
      © {new Date().getFullYear()} ResumeScreener. All rights reserved.
    </footer>
  );
}