"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 600);
  };

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
          <Link href="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link>
          <Link href="/contact" className="text-white text-sm font-medium">Contact</Link>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Dashboard</Link>
        </div>
      </nav>

      <div className="bg-[#0f0f1a] px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 text-lg">We'd love to hear from you.</p>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          {sent ? (
            <div className="bg-green-50 text-green-700 px-6 py-8 rounded-2xl text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold text-lg mb-1">Message Sent!</h3>
              <p className="text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us more..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Contact Info</h2>
          {[
            { icon: "📧", label: "Email", value: "fatihasheikh235@gmail.com" },
            { icon: "📍", label: "Location", value: "NUST, H-12, Islamabad, Pakistan" },
            { icon: "🕐", label: "Response Time", value: "Within 24 hours" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="font-medium text-gray-800 text-sm">{item.value}</p>
              </div>
            </div>
          ))}
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