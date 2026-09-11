import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ksnuiqfegfhtgtayogsh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9uNPKFP0AJ7Lfc0hRU3Ug_iFr1ixZO";

export { SUPABASE_URL };
export const SB_AKTIF = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/* Sebagian browser (mode privat ketat, setelan tertentu, atau beberapa
   in-app browser/HP) BISA menolak akses ke localStorage dan lempar error
   pas dipakai — kalau ini kejadian pas Supabase lagi nyoba baca/simpan
   sesi login, dulu SELURUH aplikasi gagal total render (layar putih
   polos, tanpa pesan error apapun kelihatan — ini yang bikin kasus siswa
   di Mesir kemarin susah didiagnosis). Fungsi di bawah ini nge-tes
   localStorage LEBIH DULU sebelum dipakai beneran, dan kalau ternyata
   nggak bisa diakses, otomatis pindah ke penyimpanan sementara di memori
   sebagai gantinya — sesi login nggak akan "nempel" antar reload halaman
   buat kasus itu, tapi minimal aplikasinya tetap kebuka & bisa dipakai,
   nggak lagi putih total. */
function buatPenyimpananAman() {
  try {
    const kunciTes = "__cek_localstorage__";
    window.localStorage.setItem(kunciTes, "1");
    window.localStorage.removeItem(kunciTes);
    return window.localStorage; // aman dipakai langsung
  } catch (e) {
    console.warn("localStorage nggak bisa diakses, pakai penyimpanan sementara di memori sebagai gantinya.", e);
    const memori = new Map();
    return {
      getItem: (k) => (memori.has(k) ? memori.get(k) : null),
      setItem: (k, v) => memori.set(k, v),
      removeItem: (k) => memori.delete(k),
    };
  }
}

/* detectSessionInUrl: wajib nyala — abis proses login Google, halaman ini
   didarati dengan token nempel di alamat (#access_token=...), dan inilah
   yang bikin Supabase otomatis "nangkep" token itu jadi sesi aktif.
   persistSession: sesi login disimpan di storage (lihat catatan di atas),
   jadi tetap "nyantol" walau browser/tab ditutup lalu dibuka lagi — siswa
   nggak perlu login ulang tiap buka ruang belajar, selama belum klik
   "Keluar" secara eksplisit atau sesi Google-nya expired.
   autoRefreshToken: token login diperpanjang otomatis di background
   sebelum kadaluarsa, jadi sesi nggak putus sendiri meski dibiarkan
   lama-lama terbuka. */
let sbClient = null;
try {
  sbClient = SB_AKTIF
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
          storage: buatPenyimpananAman(),
        },
      })
    : null;
} catch (e) {
  // Kalau bahkan ini masih gagal (sangat jarang), jangan sampai
  // ngeblok seluruh aplikasi — biarkan sb jadi null, halaman tetap
  // kebuka (walau fitur yang butuh Supabase nggak akan berfungsi).
  console.error("Gagal membuat Supabase client:", e);
  sbClient = null;
}
export const sb = sbClient;
