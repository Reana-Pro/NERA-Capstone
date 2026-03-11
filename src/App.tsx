import { useState } from "react";
import OverviewPage from "./OverviewPage";
const BG_IMAGE = "https://i.imgur.com/N6ov3sU.jpeg";

const mostSearched = ["45 Harvard Ave", "62 Culver Dr", "21 Kelvin Ave"];

function isValidAddress(input: string) {
  const zipPattern = /^\d{5}$/;
  const addressPattern = /\d+\s+\w+/;
  return zipPattern.test(input.trim()) || addressPattern.test(input.trim());
}

export default function App() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);

  const handleSearch = (value?: string) => {
    const input: string = value || query;
    if (!input.trim()) {
      setError("Please enter an address or zip code.");
      return;
    }
    if (!isValidAddress(input)) {
      setError(`That doesn't look like a valid address. Try something like "42 Elm St" or "90210".`);
      return;
    }
    setError("");
    setSubmittedAddress(input);
  };

  if (submittedAddress) {
    return <OverviewPage address={submittedAddress} onBack={() => setSubmittedAddress(null)} />;
  }

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>

      {/* Navy Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a6e 0%, #2a4f8f 100%)",
        padding: "22px 48px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <span style={{ fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: 3, fontFamily: "'Georgia', serif" }}>NERA</span>
        <span style={{ fontSize: 26, color: "#e8eef8", fontWeight: 400, fontFamily: "'Georgia', serif" }}>From Address to Insights</span>
      </div>

      {/* Hero */}
      <div style={{
        position: "relative",
        flex: 1,
        width: "100%",
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 90px)"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.45)" }} />

        <div style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px 40px 40px"
        }}>

          <div style={{ maxWidth: 560, marginBottom: 40, width: "100%" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a2a4a", margin: "0 0 14px" }}>What is NERA?</h2>
            <p style={{ fontSize: 17, color: "#2c3e5e", lineHeight: 1.65, margin: 0 }}>
              A neighborhood-level analysis that transforms public data into clear economic risk insights from a single address
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ width: "100%", maxWidth: 560 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 4,
              // Red border on error, normal border otherwise
              border: `1.5px solid ${error ? "#cc2222" : "#dde6f0"}`,
              boxShadow: error ? "0 2px 12px rgba(204,34,34,0.15)" : "0 2px 12px rgba(0,0,0,0.12)",
              overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}>
              <input
                type="text"
                placeholder="Enter Address or Zip Code"
                value={query}
                onChange={e => { setQuery(e.target.value); if (error) setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1, border: "none", outline: "none",
                  padding: "16px 20px", fontSize: 16,
                  color: "#2a4f8f", background: "transparent", fontFamily: "sans-serif"
                }}
              />
              <button
                onClick={() => handleSearch()}
                style={{ padding: "14px 20px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Inline error with red accent */}
            {error && (
              <div style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid #f0c8c8",
                borderLeft: "4px solid #cc2222",
                borderRadius: 4,
                padding: "10px 16px",
                fontFamily: "sans-serif",
                fontSize: 13,
                color: "#cc2222",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Most Searched */}
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a6e", fontFamily: "sans-serif", marginBottom: 10, letterSpacing: 0.5 }}>
              Most Searched Address
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {mostSearched.map((addr, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(addr); handleSearch(addr); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#2a6ab5", fontSize: 14, fontFamily: "sans-serif", padding: "2px 4px" }}
                >
                  [{addr}]
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}