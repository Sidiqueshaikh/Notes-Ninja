// src/components/DoubtForm.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Hindi",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Other",
];

const CLASS_LEVELS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12",
];

export default function DoubtForm() {
  const [form, setForm] = useState({ doubt: "", subject: "", classLevel: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doubt.trim() || !form.subject || !form.classLevel) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      await addDoc(collection(db, "doubts"), {
        doubt: form.doubt.trim(),
        subject: form.subject,
        classLevel: form.classLevel,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm({ doubt: "", subject: "", classLevel: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <div className="ninja-icon">🥷</div>
        <h1 className="form-title">NotesNinja</h1>
        <p className="form-subtitle">Ask your doubt — get unstuck fast</p>
      </div>

      <form onSubmit={handleSubmit} className="doubt-form">
        <div className="field-group">
          <label htmlFor="doubt" className="field-label">
            Your Doubt
          </label>
          <textarea
            id="doubt"
            name="doubt"
            className="field-input field-textarea"
            placeholder="Describe what you're confused about..."
            value={form.doubt}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="subject" className="field-label">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="field-input field-select"
              value={form.subject}
              onChange={handleChange}
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="classLevel" className="field-label">
              Class
            </label>
            <select
              id="classLevel"
              name="classLevel"
              className="field-input field-select"
              value={form.classLevel}
              onChange={handleChange}
            >
              <option value="">Select class</option>
              {CLASS_LEVELS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button
          type="submit"
          className={`submit-btn ${status === "loading" ? "loading" : ""} ${status === "success" ? "success" : ""}`}
          disabled={status === "loading"}
        >
          {status === "loading" && <span className="spinner" />}
          {status === "success" ? "✓ Doubt Submitted!" : status === "loading" ? "Submitting…" : "Submit Doubt"}
        </button>
      </form>
    </div>
  );
}
