import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/RuangBelajar.jsx";
import "./styles/index.css";

/* Lapisan pengaman PALING LUAR: kalau ada error yang kejadian SEBELUM
   React sempat jalan sama sekali (misal pas bikin koneksi Supabase di
   supabaseClient.js), ErrorBoundary React di bawah nggak akan nolong —
   React Error Boundary cuma nangkep error pas React LAGI render, bukan
   error yang kejadian sebelum itu. Ini jaring pengaman tambahan yang
   nangkep BENERAN semua error, sekalipun kejadian di titik paling awal. */
function tampilkanErrorMentah(pesan) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Poppins,sans-serif;background:#F7FDFF;text-align:center;">
      <div style="max-width:420px;">
        <div style="width:56px;height:56px;border-radius:16px;background:#FEE2E2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;">⚠️</div>
        <h1 style="font-size:18px;font-weight:700;color:#123B42;margin-bottom:8px;">Halaman gagal dimuat</h1>
        <p style="font-size:14px;color:#123B42AA;margin-bottom:16px;line-height:1.6;">
          Ada yang nggak beres pas nyiapin halaman ini. Coba muat ulang —
          kalau masih gagal, screenshot kotak abu-abu di bawah ini dan
          kirim ke admin ya, biar cepat dibantu.
        </p>
        <button onclick="window.location.reload()" style="background:#F89210;color:#fff;font-weight:600;border:none;border-radius:999px;padding:12px 28px;font-size:14px;cursor:pointer;margin-bottom:16px;">
          Muat Ulang Halaman
        </button>
        <pre style="background:#F1F5F9;border-radius:12px;padding:12px;font-size:11px;color:#475569;text-align:left;overflow:auto;max-height:160px;white-space:pre-wrap;word-break:break-word;">${pesan}</pre>
      </div>
    </div>`;
}
window.addEventListener("error", (e) => tampilkanErrorMentah(String(e.error?.message || e.message || e)));
window.addEventListener("unhandledrejection", (e) => tampilkanErrorMentah(String(e.reason?.message || e.reason || e)));

/* Jaring pengaman kedua: kalau ada ERROR pas aplikasi lagi render
   (bukan cuma soal Supabase/localStorage — bisa error apa aja), dulu
   hasilnya cuma LAYAR PUTIH POLOS tanpa keterangan apapun, susah banget
   didiagnosis dari jarak jauh (persis kasus siswa di Mesir). Sekarang,
   kalau ada error, yang muncul pesan yang jelas + tombol "Coba Lagi" —
   dan yang paling penting, siswa bisa SCREENSHOT pesan errornya buat
   dikirim ke admin, jadi masalahnya jadi jauh lebih gampang dilacak. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Aplikasi mengalami error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", fontFamily: "Poppins, sans-serif", background: "#F7FDFF", textAlign: "center",
        }}>
          <div style={{ maxWidth: "420px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px", background: "#FEE2E2",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              fontSize: "28px",
            }}>⚠️</div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#123B42", marginBottom: "8px" }}>
              Halaman gagal dimuat
            </h1>
            <p style={{ fontSize: "14px", color: "#123B42AA", marginBottom: "16px", lineHeight: 1.6 }}>
              Ada yang nggak beres pas nyiapin halaman ini. Coba muat ulang —
              kalau masih gagal, screenshot kotak abu-abu di bawah ini dan
              kirim ke admin ya, biar cepat dibantu.
            </p>
            <button onClick={() => window.location.reload()} style={{
              background: "#F89210", color: "#fff", fontWeight: 600, border: "none",
              borderRadius: "999px", padding: "12px 28px", fontSize: "14px", cursor: "pointer",
              marginBottom: "16px",
            }}>
              Muat Ulang Halaman
            </button>
            <pre style={{
              background: "#F1F5F9", borderRadius: "12px", padding: "12px", fontSize: "11px",
              color: "#475569", textAlign: "left", overflow: "auto", maxHeight: "160px",
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {String(this.state.error && this.state.error.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (e) {
  tampilkanErrorMentah(String(e && e.message || e));
}
