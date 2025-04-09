import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { decryptLog } from "@/utils/crypto";
import LogFilters from "@/pages/LogFilters";
import { saveAs } from "file-saver";
import pako from "pako";
import CryptoJS from "crypto-js";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [webhookResponse, setWebhookResponse] = useState("");
  const [logHash, setLogHash] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("admin_log");
    if (stored) {
      try {
        const decrypted = decryptLog(stored);
        setLogs(JSON.parse(decrypted));
      } catch {
        setLogs(["[ERROR: DECRYPTION FAILED]"]);
      }
    }
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      const raw = JSON.stringify(logs);
      const hash = CryptoJS.SHA256(raw).toString();
      setLogHash(hash);
    }
  }, [logs]);

  const getImageAsBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const getFilteredLogs = () => {
    return logs.filter((log) => {
      const lower = log.toLowerCase();
      return (
        (!filterUser || lower.includes(filterUser.toLowerCase())) &&
        (!filterDate || lower.includes(filterDate.toLowerCase())) &&
        (!filterKeyword || lower.includes(filterKeyword.toLowerCase()))
      );
    });
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    const imgData = await getImageAsBase64("/usdtz-logo.png");

    doc.addImage(imgData, "PNG", 14, 10, 20, 20);
    doc.setFontSize(16);
    doc.text("Admin Session Log Report", 38, 20);
    doc.setFontSize(10);
    doc.text(`Generated at ${new Date().toLocaleString()}`, 38, 26);

    const filtered = getFilteredLogs();
    const rows = filtered.map((entry, i) => [i + 1, entry]);

    doc.autoTable({
      startY: 35,
      head: [["#", "Log Entry"]],
      body: rows,
    });

    // Digital hash signature
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Signature Hash: ${logHash.slice(0, 32)}...`, 14, doc.internal.pageSize.height - 10);

    doc.save("filtered_session_logs.pdf");
  };

  const exportLogz = () => {
    const filtered = getFilteredLogs();
    const jsonStr = JSON.stringify(filtered);
    const compressed = pako.gzip(jsonStr);
    const blob = new Blob([compressed], { type: "application/gzip" });
    saveAs(blob, "filtered_logs.logz");
  };

  const importLogz = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const decompressed = pako.ungzip(buffer, { to: "string" });
    const parsed = JSON.parse(decompressed);
    setLogs(parsed);
  };

  const sendLogsToWebhook = async () => {
    const filtered = getFilteredLogs();
    try {
      const response = await fetch("https://example.com/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logs: filtered,
          sentAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send logs");
      setWebhookResponse("Logs sent successfully.");
    } catch (err) {
      console.error(err);
      setWebhookResponse("Failed to send logs.");
    }
  };

  const filteredLogs = getFilteredLogs();

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6">🔐 Encrypted Session Logs</h1>

      <LogFilters
        filterUser={filterUser}
        setFilterUser={setFilterUser}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterKeyword={filterKeyword}
        setFilterKeyword={setFilterKeyword}
      />

      <input
        type="file"
        accept=".logz"
        onChange={importLogz}
        className="mb-4 block text-sm text-zinc-400"
      />

      {webhookResponse && (
        <div className="text-sm text-yellow-400 mb-4">{webhookResponse}</div>
      )}

      {logHash && (
        <div className="text-sm text-zinc-500 mb-2">
          SHA-256 Log Hash: <span className="break-all">{logHash}</span>
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <p className="text-zinc-400">No log data matches the filters.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-zinc-800 rounded-lg p-4 mb-6">
            <table className="w-full text-sm text-zinc-300">
              <thead>
                <tr className="text-left border-b border-zinc-600">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2">Log Entry</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((entry, i) => (
                  <tr key={i} className="border-b border-zinc-700">
                    <td className="py-1 pr-4">{i + 1}</td>
                    <td className="py-1">{entry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={exportPDF}
            className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded mb-4 mr-2"
          >
            Export to PDF
          </button>

          <button
            onClick={exportLogz}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded mb-4 mr-2"
          >
            Export .logz (gzip)
          </button>

          <button
            onClick={sendLogsToWebhook}
            className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded mb-6"
          >
            Send Logs to Webhook
          </button>

          {filterUser === "" && filterDate === "" && filterKeyword === "" && (
            <pre className="text-green-500 text-xs leading-none mt-10">
              {`
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                ⠀(•_•)   SESSION COMPLETE
                ⠀<) )╯   DATA DUMPED
                ⠀/ ⎯⎯>  ⠀⠀⠀⠀⠀⠀
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                ⠀(⌐■_■)   PDF LOCKED
                ⠀(╯°□°）╯︵ ┻━┻ 
                ⠀┬──┬ ノ( ゜-゜ノ)
              `}
            </pre>
          )}
        </>
      )}
    </main>
  );
}