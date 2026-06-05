"use client";
import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: June 2025</p>

        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using ResumeScreener, you agree to be bound by these Terms of Service. If you disagree, please do not use the platform." },
          { title: "2. Use of the Platform", body: "You may use ResumeScreener for lawful purposes only. You must not upload harmful, malicious, or illegal content. You are responsible for all activity under your account." },
          { title: "3. Intellectual Property", body: "All platform code, design, and features are the intellectual property of the developer. You may not copy, modify, or redistribute any part of the platform without permission." },
          { title: "4. Data Responsibility", body: "You are responsible for the accuracy and legality of the resumes and job data you upload. We are not liable for decisions made based on the platform's screening results." },
          { title: "5. Limitation of Liability", body: "ResumeScreener is provided as-is. We are not liable for any damages arising from the use or inability to use the platform." },
          { title: "6. Changes to Terms", body: "We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms." },
          { title: "7. Contact", body: "For questions about these terms, contact fatihasheikh235@gmail.com." },
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