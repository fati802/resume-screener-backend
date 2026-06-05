"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "How do I upload a resume?",
    a: "Go to Upload Resume from the dashboard. You can upload PDF or DOCX files up to 10MB."
  },
  {
    q: "How does candidate ranking work?",
    a: "The system compares candidate skills, experience, education, and semantic similarity against job requirements."
  },
  {
    q: "Can I upload multiple resumes at once?",
    a: "Currently, resumes are uploaded individually. Bulk upload support is planned."
  },
  {
    q: "How do I create a job posting?",
    a: "Navigate to Jobs and click 'Post New Job'. Fill in the required details and submit."
  },
  {
    q: "What file formats are supported?",
    a: "PDF and DOCX files are supported."
  },
  {
    q: "How is the match score calculated?",
    a: "The score is based on skills, experience, education, and semantic matching between the resume and job description."
  },
  {
    q: "Can I delete a candidate?",
    a: "Yes. Open the candidate profile and click Delete."
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is protected and only accessible through your account."
  }
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    faq =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Help & Support
        </h1>
        <p className="text-gray-500 mt-2">
          Find answers to common questions and learn how to use ResumeScreener.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="w-full flex justify-between items-center px-6 py-5 text-left"
            >
              <span className="font-medium text-gray-800">
                {faq.q}
              </span>

              <span className="text-xl text-gray-500">
                {open === index ? "−" : "+"}
              </span>
            </button>

            {open === index && (
              <div className="px-6 pb-5 text-sm text-gray-600 border-t border-gray-100">
                <div className="pt-4">
                  {faq.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Card */}
      <div className="mt-10 bg-indigo-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Still Need Help?
        </h2>

        <p className="text-gray-600 mb-5">
          Our support team is here to assist you.
        </p>

        <Link
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}