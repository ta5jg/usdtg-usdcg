import AdminPanel from "@/components/AdminPanel";
import SwapBotStatus from "@/components/SwapBotStatus";
import LogsPage from "@/pages/LogsPage";
import { useState, useEffect } from "react";
import { encryptLog, decryptLog } from "@/utils/crypto";

export default function AdminPage() {
  const [roadmap, setRoadmap] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [log, setLog] = useState([]);

  const USERS = [
    {
      name: "admin",
      password: import.meta.env.VITE_ADMIN_PASSWORD,
      role: "admin",
    },
    {
      name: "dev",
      password: import.meta.env.VITE_DEV_PASSWORD,
      role: "editor",
    },
    {
      name: "guest",
      password: import.meta.env.VITE_VIEWER_PASSWORD,
      role: "viewer",
    },
  ];

  const saveLogToStorage = (entries) => {
    const encrypted = encryptLog(JSON.stringify(entries));
    localStorage.setItem("admin_log", encrypted);
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin_log");
    if (stored) {
      try {
        const decrypted = decryptLog(stored);
        setLog(JSON.parse(decrypted));
      } catch {
        setLog(["[ERROR: UNABLE TO READ ENCRYPTED LOG]"]);
      }
    }

    const saved = sessionStorage.getItem("admin_auth");
    const savedRole = sessionStorage.getItem("admin_role");
    const savedUser = sessionStorage.getItem("admin_user");
    if (saved === "true" && savedRole) {
      setAuthorized(true);
      setUserRole(savedRole);
      setUsername(savedUser);
    }
  }, []);

  const exportRoadmapToJSON = () => {
    const dataStr = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 mb-3 rounded bg-zinc-800 border border-zinc-600 text-white block"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-4 rounded bg-zinc-800 border border-zinc-600 text-white block"
        />
        <button
          onClick={() => {
            const found = USERS.find(
              (u) => u.name === username && u.password === password
            );
            if (found) {
              setAuthorized(true);
              setUserRole(found.role);
              sessionStorage.setItem("admin_auth", "true");
              sessionStorage.setItem("admin_role", found.role);
              sessionStorage.setItem("admin_user", found.name);
              const updatedLog = [
                ...log,
                `User ${found.name} (${found.role}) logged in at ${new Date().toLocaleTimeString()}`,
              ];
              setLog(updatedLog);
              saveLogToStorage(updatedLog);
            } else {
              alert("Invalid credentials");
            }
          }}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Login
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4 text-sm text-zinc-400">
        <strong>Logged in as:</strong> {username} ({userRole})
      </div>

      <button
        onClick={() => {
          sessionStorage.clear();
          setAuthorized(false);
          setUserRole(null);
          setUsername("");
        }}
        className="mb-4 px-4 py-2 rounded bg-red-600 hover:bg-red-500"
      >
        Logout
      </button>

      <button
        onClick={exportRoadmapToJSON}
        className="mb-4 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
      >
        Export Roadmap JSON
      </button>

      <AdminPanel roadmap={roadmap} setRoadmap={setRoadmap} role={userRole} />

      <div className="mt-8">
        <SwapBotStatus />
      </div>

      <div className="mt-8">
        <LogsPage />
      </div>

      <div className="mt-6 text-sm text-zinc-500">
        <strong>Session Log:</strong>
        <ul className="list-disc pl-4 mt-2 space-y-1">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}