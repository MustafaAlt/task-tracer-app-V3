import { useEffect, useState } from "react";
import { type Task, listTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { useAuth } from "../auth/AuthContext";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [dueDate, setDue] = useState<string>("");
  const [err, setErr] = useState("");
  const { logout } = useAuth();

  const load = async () => {
    try {
      setTasks(await listTasks());
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Liste alınamadı");
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const t = await createTask({
        title,
        description,
        status: "TODO",
        dueDate: dueDate || null
      });
      setTasks([t, ...tasks]);
      setTitle(""); setDesc(""); setDue("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Oluşturulamadı");
    }
  };

  const toggle = async (t: Task) => {
    const next: Task["status"] =
      t.status === "TODO" ? "IN_PROGRESS" : t.status === "IN_PROGRESS" ? "DONE" : "TODO";
    const upd = await updateTask(t.id!, { status: next });
    setTasks(tasks.map(x => x.id === t.id ? upd : x));
  };

  const remove = async (t: Task) => {
    await deleteTask(t.id!);
    setTasks(tasks.filter(x => x.id !== t.id));
  };

  return (
    <div style={{maxWidth:800, margin:"40px auto", padding:16}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2>Görevler</h2>
        <button onClick={logout}>Çıkış</button>
      </header>

      <form onSubmit={add} style={{display:"grid", gap:8, gridTemplateColumns:"1fr 2fr 200px 120px"}}>
        <input placeholder="başlık" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
        <input placeholder="açıklama" value={description} onChange={(e)=>setDesc(e.target.value)}/>
        <input type="date" value={dueDate} onChange={(e)=>setDue(e.target.value)}/>
        <button type="submit">Ekle</button>
      </form>

      {err && <div style={{color:"crimson", marginTop:10}}>{err}</div>}

      <ul style={{marginTop:16, padding:0, listStyle:"none"}}>
        {tasks.map(t => (
          <li key={t.id} style={{display:"grid", gridTemplateColumns:"1fr 2fr 160px 160px", gap:8, padding:"10px 0", borderBottom:"1px solid #eee"}}>
            <div><b>{t.title}</b><div style={{fontSize:12, color:"#666"}}>{t.description}</div></div>
            <div>Due: {t.dueDate ?? "-"}</div>
            <div>Status: {t.status}</div>
            <div style={{display:"flex", gap:8}}>
              <button onClick={()=>toggle(t)}>Durum Değiştir</button>
              <button onClick={()=>remove(t)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
