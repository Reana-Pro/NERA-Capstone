import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const projectionData = [
  { month: "Mar", you: 22000, avg: 38000, efficient: 25000 },
  { month: "Apr", you: 18000, avg: 42000, efficient: 22000 },
  { month: "May", you: 15000, avg: 36000, efficient: 20000 },
  { month: "Jun", you: 14000, avg: 40000, efficient: 18000 },
  { month: "Jul", you: 16000, avg: 37000, efficient: 21000 },
  { month: "Aug", you: 28000, avg: 39000, efficient: 19000 },
];

const categoryScores = [
  { label: "Safety", score: 73 },
  { label: "Housing", score: 78 },
  { label: "Employment", score: 84 },
  { label: "Education", score: 68 },
];

function ScoreBar({ score }) {
  const color = score >= 80 ? "#2a7d4f" : score >= 70 ? "#2a4f8f" : "#b45a1a";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: "#e0e7f0", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a6e", minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function isValidAddress(input) {
  const zipPattern = /^\d{5}$/;
  const addressPattern = /\d+\s+\w+/;
  return zipPattern.test(input.trim()) || addressPattern.test(input.trim());
}

// Now accepts address and onBack as props
export default function OverviewPage({ address = "45 Harvard Ave, Irvine, CA 92608", onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAddress, setCurrentAddress] = useState(address);
  const [searchError, setSearchError] = useState("");

  const handleNewSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter an address.");
      return;
    }
    if (!isValidAddress(searchQuery)) {
      setSearchError(`Try something like "42 Elm St" or "90210".`);
      return;
    }
    setSearchError("");
    setCurrentAddress(searchQuery.trim());
    setSearchQuery("");
  };

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      background: "#1a1a2e",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>

      {/* Top label */}
      <div style={{ background: "#1a1a2e", padding: "8px 20px" }}>
        <span style={{ color: "#8899aa", fontSize: 13, fontFamily: "sans-serif" }}>Overview</span>
      </div>

      {/* Main card */}
      <div style={{
        margin: "0 32px 32px",
        background: "#e8edf4",
        borderRadius: 6,
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Navy Header with back button */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a6e 0%, #2a4f8f 100%)",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          gap: 20
        }}>
          <span style={{ fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: 3, fontFamily: "'Georgia', serif" }}>NERA</span>
          <span style={{ fontSize: 24, color: "#e8eef8", fontWeight: 400, fontFamily: "'Georgia', serif" }}>From Address to Insights</span>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              marginLeft: "auto",
              padding: "8px 18px",
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.5)",
              borderRadius: 4,
              color: "#fff",
              fontFamily: "sans-serif",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            ← New Search
          </button>
        </div>

        {/* Search bar with error */}
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 4,
            border: `1.5px solid ${searchError ? "#1e3a6e" : "#d0daea"}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            overflow: "hidden",
            maxWidth: 700
          }}>
            <input
              type="text"
              placeholder="Enter a Different Address or Zip Code"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (searchError) setSearchError(""); }}
              onKeyDown={e => e.key === "Enter" && handleNewSearch()}
              style={{
                flex: 1, border: "none", outline: "none",
                padding: "13px 18px", fontSize: 15,
                color: "#2a4f8f", background: "transparent", fontFamily: "sans-serif"
              }}
            />
            <button onClick={handleNewSearch} style={{ padding: "12px 18px", background: "transparent", border: "none", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
          {searchError && (
            <div style={{
              marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1px solid #c8d8ee", borderLeft: "4px solid #1e3a6e",
              borderRadius: 4, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 13, color: "#1e3a6e"
            }}>
              🔎 {searchError}
            </div>
          )}
        </div>

        {/* Address + tabs row */}
        <div style={{ padding: "20px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            {/* Shows the actual searched address */}
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a2a4a", margin: "0 0 4px", fontFamily: "'Georgia', serif" }}>{currentAddress}</h2>
            <p style={{ margin: 0, fontSize: 14, fontFamily: "sans-serif", color: "#2a4f8f" }}>
              <strong>Confidence:</strong> High
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["overview", "map"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "9px 24px",
                  borderRadius: 999,
                  border: "1.5px solid #1e3a6e",
                  background: activeTab === tab ? "#1e3a6e" : "#fff",
                  color: activeTab === tab ? "#fff" : "#1e3a6e",
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: "16px 40px 0", height: 1, background: "#c8d4e4" }} />

        {/* Body */}
        <div style={{ padding: "24px 40px 40px", display: "flex", gap: 40, flexWrap: "wrap", flex: 1 }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a2a4a", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px", fontFamily: "sans-serif" }}>
                Real Estate Prices & Overview
              </h3>
              <div style={{ borderTop: "2px dotted #aabbd0", width: "100%" }} />
            </div>

            <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 32 }}>
              <div style={{
                background: "linear-gradient(135deg, #1e3a6e, #2a5fa0)",
                borderRadius: 4, padding: "16px 24px",
                textAlign: "center", minWidth: 90,
                boxShadow: "0 4px 16px rgba(30,58,110,0.25)"
              }}>
                <div style={{ fontSize: 12, color: "#a8c0e0", fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 4 }}>Score</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: "#fff", fontFamily: "'Georgia', serif", lineHeight: 1 }}>85</div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", marginBottom: 12 }}>Category Score</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {categoryScores.map(({ label, score }) => (
                    <div key={label}>
                      <div style={{ marginBottom: 3 }}>
                        <span style={{ fontSize: 13, color: "#2c3e5e", fontFamily: "sans-serif" }}>{label}</span>
                      </div>
                      <ScoreBar score={score} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", margin: "0 0 4px" }}>Projections</h3>
              <div style={{
                background: "#fff", borderRadius: 4,
                border: "1px solid #d0daea", padding: "16px 12px 8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
              }}>
                <div style={{ fontSize: 12, color: "#1e3a6e", fontFamily: "sans-serif", fontWeight: 600, marginBottom: 8 }}>
                  Neighbor comparison over time
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={projectionData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "sans-serif" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => `${v.toLocaleString()} kWh`} contentStyle={{ fontSize: 12, fontFamily: "sans-serif" }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "sans-serif" }} />
                    <Line type="monotone" dataKey="you" stroke="#1e3a6e" strokeWidth={2} dot={{ r: 3 }} name="You" />
                    <Line type="monotone" dataKey="avg" stroke="#888" strokeWidth={2} dot={{ r: 3 }} name="Average Neighbors" strokeDasharray="4 2" />
                    <Line type="monotone" dataKey="efficient" stroke="#3aaa6a" strokeWidth={2} dot={{ r: 3 }} name="Efficient Neighbors" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Map */}
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", margin: "0 0 12px" }}>Map Overview</h3>
            <div style={{
              borderRadius: 4, overflow: "hidden",
              border: "1px solid #c8d4e4",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              height: 320, background: "#dce8f0"
            }}>
              <iframe
                title="Neighborhood Map"
                width="100%" height="100%"
                frameBorder="0" scrolling="no"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-118.05%2C33.55%2C-117.65%2C33.80&layer=mapnik&marker=33.6846%2C-117.8265"
                style={{ border: "none", display: "block" }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#6a80a0", fontFamily: "sans-serif", textAlign: "right" }}>
              Map data © <a href="https://openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: "#2a6ab5" }}>OpenStreetMap</a> contributors
            </div>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Median Home Price", value: "$892,000" },
                { label: "Avg Rent / mo", value: "$2,840" },
                { label: "Price Change YoY", value: "+4.2%" },
                { label: "Days on Market", value: "18 days" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: "#fff", borderRadius: 4,
                  padding: "12px 16px", border: "1px solid #d0daea",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ fontSize: 11, color: "#6a80a0", fontFamily: "sans-serif", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1e3a6e", fontFamily: "'Georgia', serif" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
