"use client";
import Link from "next/link";

export default function AboutPage() {
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
          <Link href="/about" className="text-white text-sm font-medium">About</Link>
          <Link href="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link>
          <Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#0f0f1a] px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">About ResumeScreener</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Built to help recruiters find the right talent faster — using smart parsing, semantic matching, and automated ranking.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 space-y-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            ResumeScreener was built to eliminate the pain of manual CV screening. We believe every candidate deserves a fair evaluation based on their actual skills and experience — not just keywords on a page. Our platform uses intelligent parsing and weighted scoring to give recruiters a clear, objective ranking of every applicant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Fast", desc: "Screen hundreds of CVs in seconds, not hours." },
            { icon: "🎯", title: "Accurate", desc: "Multi-factor scoring based on skills, experience, and semantic matching." },
            { icon: "🔒", title: "Secure", desc: "Your data stays private. JWT-secured, locally stored." },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">👩‍💻 Built By</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600">F</div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Fatiha Sheikh</p>
              <p className="text-gray-500 text-sm">Electrical Engineering Student, NUST Islamabad</p>
              <p className="text-gray-400 text-sm mt-1">Full-stack developer • ML enthusiast • Problem solver</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Get In Touch
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