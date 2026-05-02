// src/components/AdminView.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const SUBJECT_COLORS = {
  Mathematics: "#f59e0b",
  Science: "#10b981",
  English: "#3b82f6",
  "Social Studies": "#8b5cf6",
  Hindi: "#ef4444",
  "Computer Science": "#06b6d4",
  Physics: "#f97316",
  Chemistry: "#84cc16",
  Biology: "#14b8a6",
  History: "#a78bfa",
  Geography: "#fb7185",
  Other: "#94a3b8",
};

function timeAgo(ts) {
  if (!ts) return "just now";
  const seconds = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminView() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "doubts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDoubts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doubt?")) return;
    await deleteDoc(doc(db, "doubts", id));
  };

  const subjects = ["All", ...Array.from(new Set(doubts.map((d) => d.subject))).filter(Boolean)];
  const classes = ["All", ...Array.from(new Set(doubts.map((d) => d.classLevel))).filter(Boolean)].sort();

  const filtered = doubts.filter((d) => {
    const subOk = filter === "All" || d.subject === filter;
    const clsOk = classFilter === "All" || d.classLevel === classFilter;
    return subOk && clsOk;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">🥷 Admin Dashboard</h1>
          <p className="admin-subtitle">All student doubts — live feed</p>
        </div>
        <div className="stats-badge">
          <span className="live-dot" />
          <span>{doubts.length} total doubts</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Subject:</span>
          {subjects.map((s) => (
            <button
              key={s}
              className={`filter-chip ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Class:</span>
          <select
            className="class-select"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to live feed…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No doubts yet{filter !== "All" ? ` for ${filter}` : ""}.</p>
        </div>
      ) : (
        <div className="doubts-grid">
          {filtered.map((d, i) => (
            <div
              key={d.id}
              className="doubt-card"
              style={{ "--accent": SUBJECT_COLORS[d.subject] || "#94a3b8", animationDelay: `${i * 40}ms` }}
            >
              <div className="doubt-card-top">
                <span className="subject-tag" style={{ background: SUBJECT_COLORS[d.subject] || "#94a3b8" }}>
                  {d.subject}
                </span>
                <span className="class-tag">{d.classLevel}</span>
                <button className="delete-btn" onClick={() => handleDelete(d.id)} title="Delete">×</button>
              </div>
              <p className="doubt-text">{d.doubt}</p>
              <div className="doubt-footer">
                <span className="time-ago">{timeAgo(d.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
