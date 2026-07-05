import { ImageResponse } from "next/og";
import { TOOLS as ALL_TOOLS } from "@/lib/tools";

export const runtime = "edge";
export const alt = "HowToUseMyAI - Find the Perfect AI Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DISPLAY_TOOLS = [
  { icon: "💬", name: "ChatGPT",    pricing: "Freemium" },
  { icon: "🎨", name: "Midjourney", pricing: "Paid" },
  { icon: "💻", name: "Cursor",     pricing: "Freemium" },
  { icon: "🎬", name: "HeyGen",     pricing: "Freemium" },
  { icon: "🔍", name: "Perplexity", pricing: "Freemium" },
  { icon: "🤖", name: "Claude",     pricing: "Freemium" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex",
        background: "#ffffff",
        fontFamily: "sans-serif",
      }}>
        {/* Left panel */}
        <div style={{
          width: 580,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 60px",
          borderRight: "1px solid #e4e6ea",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#1877F2",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontSize: 16, fontWeight: 800 }}>AI</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#1877F2" }}>
              HowToUseMyAI
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#1c1e21", lineHeight: 1.1, letterSpacing: "-1px" }}>
              Find the perfect
            </span>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#1877F2", lineHeight: 1.1, letterSpacing: "-1px" }}>
              AI tool
            </span>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#1c1e21", lineHeight: 1.1, letterSpacing: "-1px" }}>
              for any task.
            </span>
          </div>

          {/* Sub */}
          <div style={{ fontSize: 19, color: "#65676b", lineHeight: 1.55, marginBottom: 44, display: "flex" }}>
            Describe your goal and instantly get the best AI tool — with step-by-step instructions to get started.
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 0 }}>
            {[[`${ALL_TOOLS.length}+`, "AI Tools"], ["Free", "To Use"], [`${new Set(ALL_TOOLS.map((t) => t.category)).size}`, "Categories"]].map(([val, label], i) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column", gap: 3,
                paddingRight: 28, marginRight: 28,
                borderRight: i < 2 ? "1px solid #e4e6ea" : "none",
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#1877F2" }}>{val}</span>
                <span style={{ fontSize: 13, color: "#65676b", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — tool cards */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 44px",
          background: "#f7f8fa",
          gap: 14,
        }}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{
              background: "#E7F3FF", borderRadius: 100,
              padding: "4px 12px", display: "flex",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1877F2" }}>⭐ EDITOR&apos;S PICKS</span>
            </div>
          </div>

          {/* 2-col grid of cards */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {DISPLAY_TOOLS.slice(0, 3).map((t) => (
                <div key={t.name} style={{
                  background: "#ffffff",
                  border: "1px solid #e4e6ea",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "#f7f8fa", border: "1px solid #e4e6ea",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {t.icon}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1e21" }}>{t.name}</span>
                    <div style={{
                      background: "#E7F3FF", borderRadius: 100,
                      padding: "2px 8px", display: "flex", width: "fit-content",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1877F2" }}>{t.pricing.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {DISPLAY_TOOLS.slice(3, 6).map((t) => (
                <div key={t.name} style={{
                  background: "#ffffff",
                  border: "1px solid #e4e6ea",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "#f7f8fa", border: "1px solid #e4e6ea",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {t.icon}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1e21" }}>{t.name}</span>
                    <div style={{
                      background: "#E7F3FF", borderRadius: 100,
                      padding: "2px 8px", display: "flex", width: "fit-content",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1877F2" }}>{t.pricing.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            background: "#1877F2", borderRadius: 12,
            padding: "14px 20px", display: "flex",
            alignItems: "center", justifyContent: "center",
            marginTop: 4,
          }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
              Find My AI Tool — Free
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
