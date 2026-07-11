"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Search, TrendingUp, ShieldCheck, Newspaper } from "lucide-react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const analyzeCompany = async () => {
    if (!company.trim()) {
      alert("Please enter a company name.");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      const data = await response.json();
      setReport(data);
    } catch (error) {
      setReport({
        financial: "",
        news: "",
        risks: "Unable to analyze.",
        recommendation: "Something went wrong.",
        confidence: "--",
      });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">AI Investment Agent</h1>
      </nav>

      {/* HERO */}
      <section className="text-center mt-20 px-8">
        <h1 className="text-6xl font-extrabold">AI Investment <span className="text-cyan-400">Research Agent</span></h1>
        <div className="flex justify-center mt-12">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Microsoft, Tesla, Apple..."
            className="bg-[#111827] w-[550px] p-4 rounded-l-xl border border-gray-700 outline-none"
          />
          <button onClick={analyzeCompany} className="bg-cyan-500 px-8 rounded-r-xl hover:bg-cyan-600 transition">
            {loading ? "Analyzing..." : "Analyze Company"}
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-4 gap-6 px-12 mt-24">
        <Feature icon={<TrendingUp />} title="Financial Analysis" />
        <Feature icon={<Newspaper />} title="Market News" />
        <Feature icon={<ShieldCheck />} title="Risk Assessment" />
        <Feature icon={<Search />} title="AI Recommendation" />
      </section>

      {/* RESULT */}
      {report && (
        <section className="max-w-6xl mx-auto mt-16 px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div id="ai-investment-report" className="bg-[#111827] p-6 rounded-xl border border-cyan-500">
              <h2 className="text-cyan-400 text-xl font-bold mb-3"> AI Investment Report</h2>
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>{report.recommendation}</ReactMarkdown>
              </div>
            </div>

            <div id="financial-analysis" className="bg-[#111827] p-6 rounded-xl">
              <h2 className="text-green-400 text-xl font-bold mb-3"> Financial Analysis</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{report.financial}</p>
            </div>

            <div id="risk-assessment" className="bg-[#111827] p-6 rounded-xl">
              <h2 className="text-yellow-400 text-xl font-bold mb-3">Risk Assessment</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{report.risks}</p>
            </div>

            <div id="market-news" className="bg-[#111827] p-6 rounded-xl">
              <h2 className="text-blue-400 text-xl font-bold mb-3"> Market News</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{report.news}</p>
            </div>

            <div id="ai-recommendation" className="bg-[#111827] p-6 rounded-xl">
              <h2 className="text-purple-400 text-xl font-bold mb-3"> Recommendation</h2>
              <p className="text-green-400 font-bold whitespace-pre-wrap">{report.recommendation}</p>
            </div>

            <div id="confidence" className="bg-[#111827] p-6 rounded-xl">
              <h2 className="text-pink-400 text-xl font-bold mb-3">Confidence</h2>
              <p className="text-pink-400 text-2xl font-bold">{report.confidence}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  const handleClick = () => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button onClick={handleClick} className="w-full bg-[#111827] border border-gray-700 rounded-2xl p-6 hover:border-cyan-500 transition-all text-left">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">Click to view {title}</p>
    </button>
  );
}