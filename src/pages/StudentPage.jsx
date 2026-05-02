// src/pages/StudentPage.jsx
import DoubtForm from "../components/DoubtForm";
import { Link } from "react-router-dom";

export default function StudentPage() {
  return (
    <div className="page student-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">🥷 NotesNinja</Link>
        <Link to="/admin" className="nav-link">Admin View →</Link>
      </nav>
      <main className="page-main">
        <DoubtForm />
      </main>
    </div>
  );
}
