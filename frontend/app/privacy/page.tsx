"use client";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0f0f1a] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">RS</span>
          </div>
          <span className="text-white font-bold">ResumeScreener</span>
        </div>
        <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: June 2025</p>

        {[
          { title: "1. Information We Collect", body: "We collect information you provide when registering (name, email, company) and resumes you upload for screening. We do not share this data with third parties." },
          { title: "2. How We Use Your Data", body: "Your data is used solely to provide resume screening and candidate ranking features. Resumes are parsed locally and stored securely in your account." },
          { title: "3. Data Storage", body: "All data is stored in a secure local database. Resume files are stored on the server that hosts your instance. You can delete your data at any time." },
          { title: "4. Authentication", body: "We use JWT (JSON Web Tokens) for secure authentication. Passwords are hashed using bcrypt and never stored in plain text." },
          { title: "5. Your Rights", body: "You can delete your account and all associated data at any time by contacting us. You have the right to access, correct, or delete your personal information." },
          { title: "6. Contact", body: "For privacy concerns, contact us at fatihasheikh235@gmail.com." },
        ].map(section => (
          <div key={section.title} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{section.body}</p>
          </div>
        ))}
      </div>

      <footer className="bg-[#0f0f1a] text-gray-400 px-8 py-8 text-center text-xs">
        <div className="flex justify-center gap-8 mb-4">
          {[["About", "/about"], ["Careers", "/careers"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]].map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-white">{label}</Link>
          ))}
        </div>
        © {new Date().getFullYear()} ResumeScreener. All rights reserved.
      </footer>
    </div>
  );
}