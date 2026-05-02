// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
