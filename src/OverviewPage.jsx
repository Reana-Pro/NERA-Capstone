import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function isValidAddress(input) {
  const zipPattern = /^\d{5}$/;
  const addressPattern = /\d+\s+\w+/;
  return zipPattern.test(input.trim()) || addressPattern.test(input.trim());
}

function calculateCategoryScores(attributes) {
  if (!attributes || attributes.length === 0) return [];

  const latest = attributes.filter(a => a.data_year === 2024 && a.metric_type === "percent");

  const avg = (label) => {
    const items = latest.filter(a => a.label === label);
    if (!items.length) return null;
    const val = items.reduce((s, a) => s + a.estimate, 0) / items.length;
    return Math.min(99, Math.round(val * 2.5));
  };

  const avgAny = (...labels) => {
    for (const label of labels) {
      const result = avg(label);
      if (result !== null) return result;
    }
    return null;
  };

  const scores = [
    { label: "Housing", score: avgAny("Home value") },
    { label: "Income", score: avgAny("Income by household", "Median household income") },
    { label: "Education", score: avgAny("Education levels attained", "Bachelor's degree or higher") },
    { label: "Age Diversity", score: avgAny("Age") },
  ].filter(s => s.score !== null);

  return scores;
}

function buildTrendData(attributes) {
  if (!attributes) return [];
  const years = [2014, 2019, 2024];
  return years.map(year => {
    const items = attributes.filter(a => a.data_year === year && a.metric_type === "percent");
    const avg = (label) => {
      const arr = items.filter(a => a.label === label);
      return arr.length ? Math.round(arr.reduce((s, a) => s + a.estimate, 0) / arr.length) : 0;
    };
    return {
      year: year.toString(),
      Housing: avg("Home value"),
      Income: avg("Income by household"),
      Education: avg("Education levels attained"),
    };
  });
}

function ScoreBar({ score }) {
  const color = "#1e3a6e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: "#e0e7f0", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a6e", minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
}

export default function OverviewPage({ address = "1 Turtle Rock Irvine CA", neighborhoodData, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAddress, setCurrentAddress] = useState(address);
  const [searchError, setSearchError] = useState("");
  const [currentData, setCurrentData] = useState(neighborhoodData);
  const [loading, setLoading] = useState(false);

  const neighborhood = currentData?.Neighborhood || "—";
  const attributes = currentData?.Attributes || null;
  const lat = currentData?.latitude || 33.6846;
  const lng = currentData?.longitude || -117.8265;
  const categoryScores = calculateCategoryScores(attributes);
  const trendData = buildTrendData(attributes);

  // Build OSM embed URL dynamically from real coordinates
  const delta = 0.05;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleNewSearch = async () => {
    if (!searchQuery.trim()) { setSearchError("Please enter an address."); return; }
    if (!isValidAddress(searchQuery)) { setSearchError(`Try something like "42 Elm St" or "90210".`); return; }
    setSearchError("");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/input_location?address=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        const err = await res.json();
        setSearchError(err.detail || "Address not found.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCurrentData(data);
      setCurrentAddress(searchQuery.trim());
      setSearchQuery("");
    } catch (e) {
      setCurrentAddress(searchQuery.trim());
      setSearchQuery("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      width: "100vw",
      margin: 0, padding: 0,
      background: "#e8edf4",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      overflowY: "auto",
      overflowX: "hidden"
    }}>

      {/* Navy Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a6e 0%, #2a4f8f 100%)",
        padding: "20px 40px",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 26, padding: "0 4px 0 0", lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: 3, fontFamily: "'Georgia', serif" }}>NERA</span>
        <span style={{ fontSize: 24, color: "#e8eef8", fontWeight: 400, fontFamily: "'Georgia', serif" }}>From Address to Insights</span>
      </div>

      {/* Search bar */}
      <div style={{ padding: "20px 40px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", background: "#fff",
          borderRadius: 4, border: `1.5px solid ${searchError ? "#cc2222" : "#d0daea"}`,
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden", maxWidth: 700
        }}>
          <input
            type="text" placeholder="Enter a Different Address or Zip Code"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); if (searchError) setSearchError(""); }}
            onKeyDown={e => e.key === "Enter" && handleNewSearch()}
            disabled={loading}
            style={{ flex: 1, border: "none", outline: "none", padding: "13px 18px", fontSize: 15, color: "#2a4f8f", background: "transparent", fontFamily: "sans-serif" }}
          />
          <button onClick={handleNewSearch} disabled={loading} style={{ padding: "12px 18px", background: "transparent", border: "none", cursor: "pointer" }}>
            {loading ? <span style={{ fontSize: 14, color: "#1e3a6e" }}>...</span> : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>
        {searchError && (
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #f0c8c8", borderLeft: "4px solid #cc2222", borderRadius: 4, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 13, color: "#cc2222" }}>
            {searchError}
          </div>
        )}
      </div>

      {/* Address + tabs */}
      <div style={{ padding: "16px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a2a4a", margin: "0 0 4px", fontFamily: "'Georgia', serif" }}>{currentAddress}</h2>
          <p style={{ margin: 0, fontSize: 14, fontFamily: "sans-serif", color: "#2a4f8f" }}>
            <strong>Confidence:</strong> High &nbsp;|&nbsp; <strong>Neighborhood:</strong> {neighborhood}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {["overview", "map"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "9px 24px", borderRadius: 999,
              border: "1.5px solid #1e3a6e",
              background: activeTab === tab ? "#1e3a6e" : "#fff",
              color: activeTab === tab ? "#fff" : "#1e3a6e",
              fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s"
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: "16px 40px 0", height: 1, background: "#c8d4e4" }} />

      {/* MAP TAB */}
      {activeTab === "map" && (
        <div style={{ padding: "24px 40px 40px", height: "calc(100vh - 280px)" }}>
          <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #c8d4e4", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%", background: "#dce8f0" }}>
            <iframe title="Neighborhood Map" width="100%" height="100%" frameBorder="0" scrolling="no"
              src={mapSrc}
              style={{ border: "none", display: "block" }}
            />
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ padding: "24px 40px 40px", display: "flex", gap: 40, flexWrap: "wrap" }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>

            {/* Section title */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a2a4a", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px", fontFamily: "sans-serif" }}>
                Real Estate Prices & Overview
              </h3>
              <div style={{ borderTop: "2px dotted #aabbd0", width: "100%" }} />
            </div>

            {/* Category Scores */}
            {categoryScores.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", marginBottom: 14 }}>Category Score</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {categoryScores.map(({ label, score }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: "#2c3e5e", fontFamily: "sans-serif" }}>{label}</span>
                      </div>
                      <ScoreBar score={score} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trend Chart */}
            {trendData.length > 0 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", margin: "0 0 4px" }}>
                  Market Trend Projections (3/5/7 Years)
                </h3>
                <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #d0daea", padding: "16px 12px 8px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 12, color: "#1e3a6e", fontFamily: "sans-serif", fontWeight: 600, marginBottom: 8 }}>
                    Neighbor comparison over time
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                      <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "sans-serif" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontFamily: "sans-serif" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, fontFamily: "sans-serif" }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "sans-serif" }} />
                      <Line type="monotone" dataKey="Housing" stroke="#1e3a6e" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Income" stroke="#3aaa6a" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Education" stroke="#e07b2a" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Map */}
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", margin: "0 0 12px" }}>Map Overview</h3>
            <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #c8d4e4", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: 380, background: "#dce8f0" }}>
              <iframe title="Neighborhood Map" width="100%" height="100%" frameBorder="0" scrolling="no"
                src={mapSrc}
                style={{ border: "none", display: "block" }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#6a80a0", fontFamily: "sans-serif", textAlign: "right" }}>
              Map data © <a href="https://openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: "#2a6ab5" }}>OpenStreetMap</a> contributors
            </div>
          </div>

        </div>
      )}
    </div>
  );
}