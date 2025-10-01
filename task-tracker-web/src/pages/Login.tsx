import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { setToken } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await login(username, password);
      setToken(token);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Giriş başarısız");
    }
  };

  return (
    <div style={{maxWidth:420, margin:"60px auto", padding:24, border:"1px solid #eee", borderRadius:12}}>
      <h2>Giriş</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="kullanıcı adı" value={username} onChange={(e)=>setU(e.target.value)} style={{width:"100%",padding:10,margin:"8px 0"}}/>
        <input placeholder="şifre" type="password" value={password} onChange={(e)=>setP(e.target.value)} style={{width:"100%",padding:10,margin:"8px 0"}}/>
        {err && <div style={{color:"crimson"}}>{err}</div>}
        <button type="submit" style={{width:"100%",padding:10,marginTop:8}}>Giriş yap</button>
      </form>
      <div style={{marginTop:8}}>Hesabın yok mu? <Link to="/register">Kayıt ol</Link></div>
    </div>
  );
}
