// src/pages/AdminPage.jsx
import AdminView from "../components/AdminView";
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="page admin-page">
      <nav className="nav nav-dark">
        <Link to="/" className="nav-logo">🥷 NotesNinja</Link>
        <Link to="/" className="nav-link">Student Form →</Link>
      </nav>
      <main className="page-main">
        <AdminView />
      </main>
    </div>
  );
}
