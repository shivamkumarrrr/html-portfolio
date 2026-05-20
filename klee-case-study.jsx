import { useState, useEffect, useRef } from "react";

// ─── THEME DEFINITIONS ───
const themes = {
  wiese: {
    name: "Wiese",
    sub: "Cream UI, Instrument Serif Font, Organisch",
    bg: "#F5F0E8", surface: "#FFFFFF", surfaceAlt: "#EBE6DC",
    card: "#2D5A27", cardGrad: "linear-gradient(135deg, #3A7233, #2D5A27)",
    accent: "#2D5A27", accentSoft: "rgba(45,90,39,0.08)",
    poppy: "#D4654A", positive: "#2D5A27", negative: "#D4654A",
    text: "#1A1A18", textMuted: "#8A8880", textOnCard: "#FFFFFF",
    border: "#DDD8CE", sidebarBg: "#2D5A27", sidebarText: "#FFFFFF",
    sidebarActive: "rgba(255,255,255,0.15)", sidebarMuted: "rgba(255,255,255,0.6)",
    font: "'Instrument Serif', Georgia, serif", monoFont: "'DM Mono', monospace",
    navActiveBg: "#2D5A27", navActiveText: "#fff",
    badgeBg: "#2D5A27", badgeText: "#fff",
    goalColors: ["#D4654A", "#4A7AC7", "#2D5A27", "#7B61FF"],
    kpiCards: ["#E8E3D9", "#E8E3D9", "#E8E3D9", "#E8E3D9"],
  },
  mitternacht: {
    name: "Mitternacht",
    sub: "Dark Mode, JetBrains Mono, Code-Layout",
    bg: "#111318", surface: "#1A1D24", surfaceAlt: "#22252E",
    card: "#1E2128", cardGrad: "linear-gradient(135deg, #1E2128, #282C35)",
    accent: "#C8F04A", accentSoft: "rgba(200,240,74,0.08)",
    poppy: "#FF6B8A", positive: "#C8F04A", negative: "#FF6B8A",
    text: "#E8E9ED", textMuted: "#6A6D76", textOnCard: "#E8E9ED",
    border: "rgba(255,255,255,0.08)", sidebarBg: "#0D0F14", sidebarText: "#E8E9ED",
    sidebarActive: "rgba(200,240,74,0.12)", sidebarMuted: "#5A5D66",
    font: "'JetBrains Mono', monospace", monoFont: "'JetBrains Mono', monospace",
    navActiveBg: "rgba(200,240,74,0.12)", navActiveText: "#C8F04A",
    badgeBg: "#C8F04A", badgeText: "#111318",
    goalColors: ["#C8F04A", "#7B8EFF", "#2DDBA6", "#FF6B8A"],
    kpiCards: ["#1A1D24", "#1A1D24", "#1A1D24", "#1A1D24"],
  },
  konfetti: {
    name: "Konfetti",
    sub: "Playful RGB, Toronto/Riso, Pop",
    bg: "#F5F0E8", surface: "#FFFFFF", surfaceAlt: "#F0EBE1",
    card: "#5B7BF5", cardGrad: "linear-gradient(135deg, #5B7BF5, #7B8EFF)",
    accent: "#E84C30", accentSoft: "rgba(232,76,48,0.08)",
    poppy: "#E84C30", positive: "#2DB87A", negative: "#E84C30",
    text: "#1A1A18", textMuted: "#8A8880", textOnCard: "#FFFFFF",
    border: "#1A1A18", sidebarBg: "#F5D442", sidebarText: "#1A1A18",
    sidebarActive: "rgba(26,26,24,0.1)", sidebarMuted: "rgba(26,26,24,0.5)",
    font: "'Instrument Serif', Georgia, serif", monoFont: "'DM Mono', monospace",
    navActiveBg: "#F5D442", navActiveText: "#1A1A18",
    badgeBg: "#E84C30", badgeText: "#fff",
    goalColors: ["#E84C30", "#5B7BF5", "#2DB87A", "#C7A0E8"],
    kpiCards: ["#2DB87A", "#E84C30", "#5B7BF5", "#C7A0E8"],
  },
};

const transactions = [
  { icon: "🛒", name: "REWE Supermarkt", cat: "Lebensmittel", time: "Heute · 14:02", amount: -42.18 },
  { icon: "💰", name: "Gehalt · Werkstudent", cat: "Einkommen", time: "Heute · 09:00", amount: 812.0 },
  { icon: "🎵", name: "Spotify Premium", cat: "Abos", time: "Gestern", amount: -10.99 },
  { icon: "❤️", name: "Techniker", cat: "Krankenkasse", time: "Mo · 08:15", amount: -141.0 },
  { icon: "🍔", name: "Five Guys", cat: "Restaurants", time: "So · 20:31", amount: -18.40 },
  { icon: "👫", name: "Aryan", cat: "Freunde", time: "Sa · 22:11", amount: 12.50 },
];

const goals = [
  { emoji: "🏛", name: "Rom im Herbst", saved: 482, target: 900 },
  { emoji: "💻", name: "Neues MacBook", saved: 1240, target: 2200 },
  { emoji: "🛟", name: "Sparpuffer", saved: 1875, target: 3000 },
  { emoji: "🔑", name: "WG-Kaution", saved: 240, target: 1200 },
];

const spendCats = [
  { name: "Lebensmittel", amount: 248, color: "#2D5A27" },
  { name: "Restaurants", amount: 142, color: "#D4654A" },
  { name: "Mobilität", amount: 49, color: "#E8A840" },
  { name: "Abos", amount: 38, color: "#5B7BF5" },
  { name: "Bücher & Kurse", amount: 89, color: "#9B7BCC" },
  { name: "Freizeit", amount: 64, color: "#2DB87A" },
];

const friends = [
  { init: "LS", name: "Lina", color: "#E8A0A0" },
  { init: "JM", name: "Jonas", color: "#A0D4A0" },
  { init: "MK", name: "Mert", color: "#E8A040" },
  { init: "AB", name: "Aylin", color: "#A0C8E0" },
  { init: "TW", name: "Tobi", color: "#C8A0E0" },
];

// ─── ANIMATED NUMBER ───
const AnimNum = ({ value, prefix = "", suffix = "" }) => {
  const [cur, setCur] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const from = cur;
    const anim = (now) => {
      const p = Math.min((now - start) / 800, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCur(from + (value - from) * e);
      if (p < 1) raf.current = requestAnimationFrame(anim);
    };
    raf.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  const formatted = cur.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return <span>{prefix}{formatted}{suffix}</span>;
};

// ─── KLEE ICON SVG ───
const KleeIcon = ({ size = 24, color = "#2D5A27" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="11" cy="11" r="7" fill={color} opacity="0.7"/>
    <circle cx="21" cy="11" r="7" fill={color} opacity="0.5"/>
    <circle cx="11" cy="21" r="7" fill={color} opacity="0.6"/>
    <circle cx="21" cy="21" r="7" fill={color} opacity="0.4"/>
    <circle cx="16" cy="16" r="3" fill={color}/>
  </svg>
);

// ─── MAIN APP ───
export default function KleeCaseStudy() {
  const [theme, setTheme] = useState("wiese");
  const [screen, setScreen] = useState("overview");
  const [balance, setBalance] = useState(2791.78);
  const [streak, setStreak] = useState(14);
  const [mounted, setMounted] = useState(false);
  const t = themes[theme];

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const isDark = theme === "mitternacht";
  const isKonfetti = theme === "konfetti";

  const stagger = (i) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`,
  });

  const navItems = [
    { id: "overview", icon: "⬡", label: theme === "mitternacht" ? "Dashboard" : "Übersicht" },
    { id: "transactions", icon: "≡", label: theme === "mitternacht" ? "Aktivität" : "Verlauf", badge: 12 },
    { id: "goals", icon: "◎", label: theme === "mitternacht" ? "Ziele" : isKonfetti ? "Träume" : "Sparziele" },
    { id: "cards", icon: "▭", label: "Karten" },
    { id: "insights", icon: "◫", label: theme === "mitternacht" ? "Analyse" : "Einblicke" },
    { id: "send", icon: "↗", label: "Senden" },
  ];

  const screenHeaders = {
    overview: { sub: theme === "mitternacht" ? "12. JAN · 21:14" : "MITTWOCH · 12. JAN", title: `Hallo Shivam` },
    transactions: { sub: theme === "mitternacht" ? "JAN · 247 BUCHUNGEN" : "ALLE BUCHUNGEN · JAN", title: theme === "mitternacht" ? "Aktivität" : "Transaktionen" },
    goals: { sub: "DEINE WIESE WÄCHST", title: isKonfetti ? "Träume" : "Sparziele" },
    cards: { sub: "PHYSISCH · VIRTUELL · LIMITS", title: "Karten" },
    insights: { sub: "WOHIN GEHT DEIN GELD?", title: theme === "mitternacht" ? "Analyse" : "Einblicke" },
    send: { sub: theme === "mitternacht" ? "KLEE-ZU-KLEE · IBAN · SEPA-INSTANT" : "AN FREUNDE · IBAN · KLEE-TAG", title: "Geld senden" },
  };

  const cs = (base, override = {}) => ({ ...base, ...override });

  // ─── RENDER SCREENS ───
  const renderScreen = () => {
    const cardStyle = {
      background: isDark ? t.surface : t.surface,
      border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
      borderRadius: isKonfetti ? 16 : 14,
      padding: "16px 18px",
      boxShadow: isKonfetti ? "4px 4px 0 rgba(0,0,0,0.08)" : "none",
    };

    switch (screen) {
      case "overview":
        return (
          <>
            {/* Balance Card */}
            <div style={{
              background: t.cardGrad, borderRadius: isKonfetti ? 18 : 16,
              padding: "20px", color: t.textOnCard, position: "relative", overflow: "hidden",
              border: isKonfetti ? "2px solid #1A1A18" : "none",
              boxShadow: isKonfetti ? "5px 5px 0 rgba(0,0,0,0.1)" : "none",
            }}>
              {isKonfetti && <KleeIcon size={120} color="rgba(255,255,255,0.08)" />}
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 10px" }}>
                  Hauptkonto · DE89 …4419
                </span>
                <span style={{ fontSize: 10, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 10px" }}>
                  ↑ +4,2 % Wachstum
                </span>
              </div>
              <div style={{ fontFamily: t.font, fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                <AnimNum value={balance} /><span style={{ fontSize: 20, marginLeft: 2 }}>€</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>+124,40 € diese Woche</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {["Senden", "Aufladen", isKonfetti ? "Auto-Spar" : "Karte einfrieren"].map((label, i) => (
                  <button key={i} style={{
                    background: i === 0 ? (isDark ? t.accent : "rgba(255,255,255,0.95)") : "rgba(255,255,255,0.12)",
                    color: i === 0 ? (isDark ? "#111" : t.accent) : "rgba(255,255,255,0.9)",
                    border: i === 0 && isKonfetti ? "2px solid #1A1A18" : "none",
                    borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Streak */}
            <div style={{
              ...cardStyle, marginTop: 12,
              background: isDark ? "rgba(200,240,74,0.06)" : isKonfetti ? "#2DB87A" : "rgba(45,90,39,0.06)",
              border: `1px solid ${isDark ? "rgba(200,240,74,0.15)" : isKonfetti ? "#1A1A18" : "rgba(45,90,39,0.15)"}`,
              color: isKonfetti ? "#fff" : t.text,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <KleeIcon size={18} color={isKonfetti ? "#fff" : t.accent} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: isKonfetti ? "#fff" : t.accent, letterSpacing: "0.06em" }}>GLÜCK-SERIE</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: t.monoFont }}>{streak} Tage</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} style={{
                    width: 14, height: 14, borderRadius: 4,
                    background: i < streak ? (isDark ? t.accent : isKonfetti ? "rgba(255,255,255,0.3)" : t.accent) : "rgba(128,128,128,0.15)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            </div>

            {/* Goals mini */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, fontFamily: t.font, color: t.text }}>{isKonfetti ? "Träume" : "Sparziele"}</span>
                <span style={{ fontSize: 11, color: t.accent, cursor: "pointer" }}>Alle ansehen</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {goals.map((g, i) => (
                  <div key={i} style={{
                    ...cardStyle, padding: "12px 14px",
                    background: isKonfetti ? t.goalColors[i] + "18" : cardStyle.background,
                    border: isKonfetti ? `2px solid ${t.goalColors[i]}40` : cardStyle.border,
                  }}>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>{g.emoji} <span style={{ fontWeight: 600, color: t.text }}>{g.name}</span></div>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: t.monoFont, color: t.text }}>{g.saved.toLocaleString("de-DE")},00 €</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>von {g.target.toLocaleString("de-DE")},00 €</div>
                    <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.06)" : "#E8E3D9", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: t.goalColors[i], width: `${(g.saved / g.target) * 100}%`, borderRadius: 2, transition: "width 0.8s" }} />
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{Math.round((g.saved / g.target) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, fontFamily: t.font, color: t.text }}>Letzte Aktivität</span>
                <span style={{ fontSize: 11, color: t.accent, cursor: "pointer" }}>Alle ansehen</span>
              </div>
              {transactions.slice(0, 2).map((tx, i) => (
                <div key={i} style={{
                  ...cardStyle, marginBottom: 6, padding: "12px 14px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: isDark ? "rgba(255,255,255,0.06)" : t.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{tx.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tx.name}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{tx.cat} · {tx.time}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: t.monoFont, color: tx.amount > 0 ? t.positive : t.negative }}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2).replace(".", ",")} €
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "transactions":
        return (
          <>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {["Alle · 247", "Ausgaben", "Einkommen", "Abos", "Geteilt"].map((f, i) => (
                <button key={i} style={{
                  background: i === 0 ? t.accent : "transparent",
                  color: i === 0 ? (isDark ? "#111" : "#fff") : t.textMuted,
                  border: `1px solid ${i === 0 ? t.accent : t.border}`,
                  borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: i === 0 ? 600 : 400,
                }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "EINGÄNGE", val: "+1.412,50", col: t.positive },
                { label: "AUSGABEN", val: "−832,17", col: t.negative },
              ].map((k, i) => (
                <div key={i} style={{
                  background: isKonfetti ? t.kpiCards[i] : isDark ? t.surface : "#F8F5EE",
                  border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
                  borderRadius: isKonfetti ? 14 : 12, padding: 14,
                  color: isKonfetti ? "#fff" : t.text,
                }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.08em", opacity: 0.6, marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: t.monoFont, color: isKonfetti ? "#fff" : k.col }}>{k.val} €</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: "0.1em", marginBottom: 8 }}>HEUTE</div>
            {transactions.map((tx, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderBottom: `1px ${isKonfetti ? "dashed" : "solid"} ${t.border}20`,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: isKonfetti ? 20 : 9, background: isDark ? "rgba(255,255,255,0.05)" : t.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: isKonfetti ? `1.5px solid ${t.border}` : "none" }}>{tx.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tx.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{tx.cat} · {tx.time}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: t.monoFont, color: tx.amount > 0 ? t.positive : t.negative }}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2).replace(".", ",")} €
                </div>
              </div>
            ))}
          </>
        );

      case "goals":
        return (
          <>
            {/* Main Goal */}
            <div style={{
              background: isKonfetti ? "#E84C30" : t.cardGrad,
              borderRadius: isKonfetti ? 18 : 16, padding: 20, color: "#fff", marginBottom: 12,
              border: isKonfetti ? "2px solid #1A1A18" : "none",
              boxShadow: isKonfetti ? "5px 5px 0 rgba(0,0,0,0.1)" : "none",
            }}>
              <span style={{ fontSize: 10, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "3px 10px" }}>Hauptziel · 54 % erreicht</span>
              <div style={{ fontFamily: t.font, fontSize: 28, marginTop: 12, lineHeight: 1.1 }}>Rom im Herbst</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>3 Tage · Flug + Pension · Shivam & Ariane</div>
              <div style={{ fontFamily: t.monoFont, fontSize: 28, marginTop: 14 }}>479 <span style={{ fontSize: 14 }}>€ von 900 €</span></div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 10 }}>
                <div style={{ height: "100%", background: "#fff", borderRadius: 2, width: "54%" }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button style={{ background: "rgba(255,255,255,0.9)", color: t.accent, border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Einzahlen</button>
                <button style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>Auto-Sparen anpassen</button>
              </div>
            </div>

            {/* Streak */}
            <div style={{
              background: isKonfetti ? "#2DB87A" : isDark ? "rgba(200,240,74,0.06)" : t.surface,
              border: `${isKonfetti ? "2px" : "1px"} solid ${isKonfetti ? "#1A1A18" : t.border}`,
              borderRadius: 14, padding: 16, marginBottom: 12,
              color: isKonfetti ? "#fff" : t.text,
            }}>
              <div style={{ fontFamily: t.font, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Glück-Serie · {streak} Tage</div>
              <div style={{ fontSize: 12, color: isKonfetti ? "rgba(255,255,255,0.7)" : t.textMuted }}>Du sparst seit zwei Wochen jeden Tag.</div>
              <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: isDark ? t.accent : isKonfetti ? "rgba(255,255,255,0.3)" : t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: isDark ? "#111" : "#fff", fontWeight: 600 }}>{i + 1}</div>
                ))}
              </div>
              <div style={{ fontSize: 11, marginTop: 8, color: isKonfetti ? "rgba(255,255,255,0.8)" : t.textMuted }}>Bei 21 Tagen: <strong>+0,5 % Bonuszins</strong></div>
            </div>

            {/* Other goals */}
            {goals.slice(1).map((g, i) => (
              <div key={i} style={{
                background: isKonfetti ? t.goalColors[i + 1] + "12" : isDark ? t.surface : t.surface,
                border: `${isKonfetti ? "2px" : "1px"} solid ${isKonfetti ? t.goalColors[i + 1] + "40" : t.border}`,
                borderRadius: 14, padding: 14, marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: t.text }}>{g.emoji} <strong>{g.name}</strong></span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: t.monoFont, color: t.text }}>{g.saved.toLocaleString("de-DE")},00 €</span>
                </div>
                <div style={{ fontSize: 10, color: t.textMuted }}>Ziel: {g.target.toLocaleString("de-DE")},00 €</div>
                <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.06)" : "#E8E3D9", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: t.goalColors[i + 1], width: `${(g.saved / g.target) * 100}%`, borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: t.textMuted }}>{Math.round((g.saved / g.target) * 100)}%</span>
                  <span style={{ fontSize: 10, color: t.textMuted }}>noch {(g.target - g.saved).toLocaleString("de-DE")},00 €</span>
                </div>
              </div>
            ))}
          </>
        );

      case "cards":
        return (
          <>
            <div style={{
              background: isDark ? "linear-gradient(135deg, #1E2520, #2A3530)" : isKonfetti ? "linear-gradient(135deg, #E8A040, #E84C30)" : "linear-gradient(135deg, #3A7233, #2D5A27)",
              borderRadius: 18, padding: 22, color: "#fff", marginBottom: 12,
              border: isKonfetti ? "2px solid #1A1A18" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <KleeIcon size={20} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{isKonfetti ? "Klee" : isDark ? "klee." : "Klee"}</span>
                </div>
                <span style={{ fontSize: 10, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 10px" }}>{isDark ? "METAL" : isKonfetti ? "CLASSIC" : "Standard"}</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, letterSpacing: "0.12em", opacity: 0.8 }}>•• 4242 •• 1331 •• 4419</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <span style={{ fontSize: 12 }}>Shivam Kumar</span>
                <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>09/29</span>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: t.font, color: t.text, marginBottom: 10 }}>Kontrolle</div>
            {[
              { label: "Karte einfrieren", desc: "Mit einem Tipp pausieren", on: false },
              { label: "Online-Käufe", desc: "Stripe, Amazon, etc.", on: true },
              { label: "Bargeldabhebung", desc: "EU-weit kostenfrei", on: true },
            ].map((ctrl, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", marginBottom: 6,
                background: isDark ? t.surface : t.surface,
                border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
                borderRadius: 12,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{ctrl.label}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{ctrl.desc}</div>
                </div>
                <div style={{
                  width: 36, height: 20, borderRadius: 10, cursor: "pointer",
                  background: ctrl.on ? t.accent : (isDark ? "rgba(255,255,255,0.1)" : "#D0D0D0"),
                  position: "relative", transition: "background 0.2s",
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 2, left: ctrl.on ? 18 : 2, transition: "left 0.2s",
                  }} />
                </div>
              </div>
            ))}
          </>
        );

      case "insights":
        const maxA = Math.max(...spendCats.map(c => c.amount));
        return (
          <>
            <div style={{
              background: isDark ? t.surface : t.surface,
              border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
              borderRadius: 14, padding: 16, marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: t.font, fontSize: 15, fontWeight: 600, color: t.text }}>Jan 2026</span>
                <span style={{ fontSize: 10, color: t.textMuted, background: isDark ? "rgba(255,255,255,0.06)" : t.surfaceAlt, borderRadius: 8, padding: "3px 8px" }}>−12 % vs. Dezember</span>
              </div>
              {/* Mini donut */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  {(() => {
                    const total = spendCats.reduce((s, c) => s + c.amount, 0);
                    let offset = 0;
                    return spendCats.map((c, i) => {
                      const pct = c.amount / total;
                      const dash = pct * 220;
                      const el = <circle key={i} cx="50" cy="50" r="35" fill="none" stroke={c.color} strokeWidth="18" strokeDasharray={`${dash} ${220 - dash}`} strokeDashoffset={-offset} />;
                      offset += dash;
                      return el;
                    });
                  })()}
                  <text x="50" y="46" textAnchor="middle" fontSize="8" fill={t.textMuted}>TOTAL</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill={t.text} fontFamily={t.monoFont}>626</text>
                </svg>
              </div>
              {spendCats.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: t.text }}>{c.name}</span>
                  <span style={{ fontSize: 12, fontFamily: t.monoFont, fontWeight: 500, color: t.text }}>{c.amount},00 €</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: t.font, fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>Klee bemerkt…</div>
            {[
              { text: "Spotify · Familienabo spart 5 €/Monat", tag: "Tipp", col: t.positive },
              { text: "Bäckerei-Ausgaben +28 %", tag: "Trend", col: isDark ? "#FF6B8A" : t.poppy },
            ].map((h, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 6,
                background: isDark ? t.surface : t.surface,
                border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
                borderRadius: 12,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: isKonfetti ? "#C8F04A20" : t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <KleeIcon size={16} color={t.accent} />
                </div>
                <span style={{ flex: 1, fontSize: 12, color: t.text }}>{h.text}</span>
                <span style={{ fontSize: 10, background: h.col + "18", color: h.col, borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>{h.tag}</span>
              </div>
            ))}
          </>
        );

      case "send":
        return (
          <>
            <div style={{
              background: isKonfetti ? "#C7A0E8" : isDark ? t.surface : t.surface,
              border: `${isKonfetti ? "2px" : "1px"} solid ${t.border}`,
              borderRadius: 16, padding: 20, marginBottom: 12,
              color: isKonfetti ? "#1A1A18" : t.text,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E8A0A0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>LS</div>
                <div>
                  <div style={{ fontSize: 10, color: isKonfetti ? "rgba(0,0,0,0.5)" : t.textMuted }}>AN</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Lina Schubert <span style={{ color: t.accent }}>@lina_s</span></div>
                </div>
              </div>
              <div style={{ fontFamily: t.font, fontSize: 42, textAlign: "center", lineHeight: 1, margin: "10px 0" }}>18,00<span style={{ fontSize: 18 }}>€</span></div>
              <div style={{ textAlign: "center", fontSize: 11, color: isKonfetti ? "rgba(0,0,0,0.5)" : t.textMuted, marginBottom: 14 }}>Verfügbar: 2.843,27 €</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
                {[5, 10, 18, 25, 50].map((v) => (
                  <button key={v} style={{
                    background: v === 18 ? (isDark ? t.accent : isKonfetti ? "#1A1A18" : t.accent) : "transparent",
                    color: v === 18 ? (isDark ? "#111" : "#fff") : (isKonfetti ? "#1A1A18" : t.textMuted),
                    border: `1px solid ${v === 18 ? "transparent" : t.border}`,
                    borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: v === 18 ? 700 : 400,
                  }}>{v} €</button>
                ))}
              </div>
              <div style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 14,
              }}>
                <div style={{ fontSize: 9, letterSpacing: "0.08em", color: isKonfetti ? "rgba(0,0,0,0.4)" : t.textMuted, marginBottom: 3 }}>VERWENDUNGSZWECK</div>
                <div style={{ fontSize: 13 }}>🍝 Pasta-Abend bei Mert</div>
              </div>
              <button style={{
                width: "100%", background: isDark ? t.accent : isKonfetti ? "#E84C30" : t.accent,
                color: isDark ? "#111" : "#fff", border: isKonfetti ? "2px solid #1A1A18" : "none",
                borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>↗ Sofort senden</button>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: t.font, color: t.text, marginBottom: 10 }}>Häufig</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {friends.map((f, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", border: isKonfetti ? "2px solid #1A1A18" : "none" }}>{f.init}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{f.name}</div>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ─── LEFT PANEL: CASE STUDY ─── */}
      <div style={{ width: 380, padding: "32px 28px", overflowY: "auto", background: "#F5F0E8", borderRight: "1px solid #DDD8CE", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ ...stagger(0), display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <KleeIcon size={32} color="#2D5A27" />
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: "#1A1A18" }}>Klee</span>
          <span style={{ fontSize: 10, color: "#8A8880", letterSpacing: "0.1em", marginLeft: "auto" }}>UI/UX CASE STUDY · 2026</span>
        </div>

        {/* Hero */}
        <div style={stagger(1)}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, color: "#1A1A18", lineHeight: 1.05, marginBottom: 6, fontWeight: 400 }}>
            Geld, das<br /><em style={{ color: "#2D5A27" }}>Glück bringt.</em>
          </h1>
          <p style={{ fontSize: 13, color: "#6A6A60", lineHeight: 1.6, marginBottom: 28 }}>
            Klee ist eine Banking-App für Werkstudent:innen und junge Berufseinsteiger:innen. Verspielt, ehrlich, voller kleiner Belohnungen für gute Gewohnheiten.
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #DDD8CE", margin: "20px 0" }} />

        {/* Approach */}
        <div style={stagger(2)}>
          {[
            { num: "01", label: "PROBLEM", title: "Werkstudent-Geld ist klein — aber komplex.", desc: "Mehrere Quellen, unklare Budgets, vergessene Abos." },
            { num: "02", label: "WER", title: "Shivam · 21 · Werkstudent in Saarbrücken.", desc: "Verdient ~812 €/Monat, spart auf einen Rom-Trip." },
            { num: "03", label: "HYPOTHESE", title: "Ein bisschen Glück, ein bisschen Struktur.", desc: "Klare Zahlen mit verspielten Belohnungen." },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #DDD8CE", borderRadius: 12, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: i === 0 ? "#D4654A" : i === 1 ? "#2D5A27" : "#E8A040", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{s.num}</span>
                <span style={{ fontSize: 10, color: "#8A8880", letterSpacing: "0.08em" }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: "#1A1A18", lineHeight: 1.3, marginBottom: 4 }}>{s.title}</div>
              <p style={{ fontSize: 12, color: "#8A8880", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ ...stagger(3), display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "16px 0" }}>
          {[{ n: "3", l: "Richtungen" }, { n: "18", l: "Screens" }, { n: "24", l: "Komponenten" }, { n: "12+", l: "Micro-Interactions" }].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #DDD8CE", borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A18" }}>{s.n}</div>
              <div style={{ fontSize: 9, color: "#8A8880", letterSpacing: "0.04em" }}>{s.l}</div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #DDD8CE", margin: "20px 0" }} />

        {/* DESIGN DIRECTION SWITCHER */}
        <div style={stagger(4)}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#8A8880", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>DESIGN-SYSTEM RICHTUNGEN</div>
          <p style={{ fontSize: 13, color: "#6A6A60", marginBottom: 14 }}>Wähle eine Richtung, um den interaktiven App-Prototypen rechts anzupassen:</p>
          {Object.entries(themes).map(([key, th]) => (
            <button key={key} onClick={() => { setTheme(key); setMounted(false); setTimeout(() => setMounted(true), 50); }} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "14px 16px", marginBottom: 6,
              background: theme === key ? "#1A1A18" : key === "mitternacht" ? "#22252E" : key === "konfetti" ? "#F5D442" : "transparent",
              border: `1.5px solid ${theme === key ? "#1A1A18" : "#DDD8CE"}`,
              borderRadius: 12, cursor: "pointer", textAlign: "left",
              color: theme === key ? "#fff" : key === "mitternacht" ? "#C8F04A" : key === "konfetti" ? "#1A1A18" : "#1A1A18",
              transition: "all 0.25s",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                  {key === "wiese" ? "01. Wiese." : key === "mitternacht" ? "02. Mitternacht." : "03. Konfetti."}
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{th.sub}</div>
              </div>
              {theme === key && <span style={{ fontSize: 10, color: th.accent, fontWeight: 700, letterSpacing: "0.08em" }}>● AKTIV</span>}
            </button>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #DDD8CE", margin: "20px 0" }} />

        {/* SIMULATOR CONTROLS */}
        <div style={stagger(5)}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🎛</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1A1A18", letterSpacing: "0.06em" }}>SIMULATOR-STEUERUNG</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6A6A60" }}>Konto-Kontingent anpassen (€)</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#1A1A18" }}>{balance.toFixed(2).replace(".", ",")} €</span>
            </div>
            <input type="range" min="0" max="10000" step="10" value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#2D5A27", cursor: "pointer" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6A6A60" }}>Glück-Serie (Tage)</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#1A1A18" }}>{streak}</span>
            </div>
            <input type="range" min="0" max="30" step="1" value={streak}
              onChange={(e) => setStreak(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#2D5A27", cursor: "pointer" }} />
          </div>
        </div>

        {/* Contact */}
        <hr style={{ border: "none", borderTop: "1px solid #DDD8CE", margin: "20px 0" }} />
        <div style={stagger(6)}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, color: "#D4654A", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>🎯 WAS ICH MITBRINGE</div>
              <div style={{ fontSize: 10, color: "#D4654A", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4, marginTop: 8 }}>📐 DESIGN FORSCHUNG</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#8A8880", letterSpacing: "0.08em", marginBottom: 4 }}>KONTAKT & NETZWERKE</div>
              <div style={{ fontSize: 11, color: "#2D5A27" }}>✉ shiivamkumarr2517@gmail.com</div>
              <div style={{ fontSize: 11, color: "#2D5A27", marginTop: 2 }}>🌐 shivamkumarrrrdun.vercel.app</div>
              <div style={{ fontSize: 11, color: "#2D5A27", marginTop: 2 }}>in linkedin.com/in/shiiiivam</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: LIVE APP PROTOTYPE ─── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: isDark ? "#08090E" : "#E8E3D9", transition: "background 0.4s" }}>
        <div style={{ width: "100%", maxWidth: 820, transition: "all 0.4s" }}>
          {/* Desktop frame */}
          <div style={{
            background: t.bg, borderRadius: 20, overflow: "hidden",
            border: `1px solid ${t.border}`, transition: "all 0.4s",
            boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.5)" : "0 24px 80px rgba(0,0,0,0.08)",
            display: "flex", minHeight: 560,
          }}>
            {/* Sidebar */}
            <div style={{
              width: 200, background: t.sidebarBg, padding: "20px 10px",
              display: "flex", flexDirection: "column", transition: "all 0.4s",
              borderRight: isKonfetti ? "2px solid #1A1A18" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", marginBottom: 28 }}>
                <KleeIcon size={24} color={isDark ? t.accent : isKonfetti ? "#1A1A18" : "#fff"} />
                <span style={{ fontWeight: 600, fontSize: 16, color: t.sidebarText }}>{isDark ? "klee." : "Klee"}</span>
                {isDark && <span style={{ fontSize: 9, color: t.textMuted, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "2px 6px" }}>v2</span>}
              </div>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setScreen(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 9, padding: "10px 14px",
                  borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2,
                  background: screen === item.id ? t.sidebarActive : "transparent",
                  color: screen === item.id ? (isDark ? t.accent : t.sidebarText) : t.sidebarMuted,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  fontWeight: screen === item.id ? 600 : 400,
                  transition: "all 0.2s", width: "100%", textAlign: "left",
                }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span style={{
                      marginLeft: "auto", background: screen === item.id ? (isDark ? t.accent : "rgba(255,255,255,0.25)") : "rgba(128,128,128,0.2)",
                      color: screen === item.id ? (isDark ? "#111" : "#fff") : t.sidebarMuted,
                      fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "1px 7px",
                    }}>{item.badge}</span>
                  )}
                </button>
              ))}

              {/* Streak widget in sidebar */}
              <div style={{
                marginTop: "auto", borderRadius: 12, padding: 14,
                background: isDark ? "rgba(200,240,74,0.06)" : isKonfetti ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
                border: `1px solid ${isDark ? "rgba(200,240,74,0.12)" : isKonfetti ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <KleeIcon size={14} color={isDark ? t.accent : isKonfetti ? "#1A1A18" : "#fff"} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? t.accent : isKonfetti ? "#1A1A18" : "#fff", letterSpacing: "0.06em" }}>GLÜCK-SERIE</span>
                </div>
                <div style={{ fontFamily: t.font, fontSize: 22, color: t.sidebarText, fontWeight: 400, marginTop: 4 }}>{streak} Tage</div>
                <div style={{ fontSize: 10, color: t.sidebarMuted, marginTop: 2 }}>im Sparplan – weiter so!</div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", transition: "all 0.4s" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: "0.08em", marginBottom: 4 }}>{screenHeaders[screen].sub}</div>
                  <h2 style={{ fontFamily: t.font, fontSize: 28, fontWeight: 400, color: t.text, lineHeight: 1.1 }}>{screenHeaders[screen].title}</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : t.surfaceAlt,
                    border: `1px solid ${t.border}`, borderRadius: 10, padding: "7px 14px",
                    fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6,
                  }}>🔍 Suchen… <span style={{ fontSize: 10, opacity: 0.5 }}>⌘K</span></div>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: isDark ? t.accent : isKonfetti ? "#E8A040" : "#2D5A27",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 12, color: isDark ? "#111" : "#fff",
                  }}>SK</div>
                </div>
              </div>

              {/* Screen content */}
              <div key={screen + theme} style={{ animation: "fadeUp 0.4s ease" }}>
                {renderScreen()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
