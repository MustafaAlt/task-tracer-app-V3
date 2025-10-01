import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
        <Link to="/" style={{marginRight:12}}>Task Tracker</Link>
        <Link to="/login" style={{marginRight:12}}>Giriş</Link>
        <Link to="/register">Kayıt</Link>
      </nav>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Tasks />} />
        </Route>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </>
  );
}
