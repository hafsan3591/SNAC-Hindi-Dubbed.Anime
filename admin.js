// admin.js — SNAC ANIME Admin Panel
// ★ Export করলে সরাসরি anime-data.js এ paste করার মতো কোড পাবেন ★
(function () {
  "use strict";

  const ADMIN_KEY = "snac_admin_auth";
  const CUSTOM_KEY = "snac_custom_anime";
  const DEFAULT_PASS = "HM-385-MH";

  const $ = (s) => document.querySelector(s);
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function getCustom() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]"); }
    catch { return []; }
  }
  function setCustom(list) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); }

  function getAll() {
    const base = typeof animeList !== "undefined" ? animeList : [];
    const custom = getCustom();
    const map = new Map();
    base.forEach((a) => map.set(a.id, { ...a, _source: "base" }));
    custom.forEach((a) => {
      if (a._deleted) map.delete(a.id);
      else map.set(a.id, { ...a, _source: "custom" });
    });
    return Array.from(map.values());
  }

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.style.cssText = "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#00ffaa;color:#02110b;padding:12px 24px;border-radius:8px;font-family:monospace;font-weight:700;z-index:9999;transition:opacity .3s;opacity:1;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._tid);
    t._tid = setTimeout(() => { t.style.opacity = "0"; }, 2500);
  }

  const isAuthed = () => sessionStorage.getItem(ADMIN_KEY) === "1";
  function login(pass) {
    if (pass === DEFAULT_PASS) { sessionStorage.setItem(ADMIN_KEY, "1"); return true; }
    return false;
  }
  function logout() { sessionStorage.removeItem(ADMIN_KEY); location.reload(); }

  function showPanel() {
    $("#loginView").style.display = "none";
    $("#panelView").style.display = "block";
    renderList();
  }

  function readForm() {
    return {
      id: $("#fId").value.trim(),
      title: $("#fTitle").value.trim(),
      titleBn: $("#fTitleBn").value.trim(),
      genre: $("#fGenre").value.split(",").map((s) => s.trim()).filter(Boolean),
      year: parseInt($("#fYear").value, 10) || 0,
      language: $("#fLanguage").value,
      status: $("#fStatus").value,
      rating: parseFloat($("#fRating").value) || 0,
      poster: $("#fPoster").value.trim(),
      description: $("#fDesc").value.trim(),
      telegramUrl: $("#fTelegram").value.trim(),
      trending: $("#fTrending").checked,
      latest: $("#fLatest").checked,
    };
  }

  function fillForm(a) {
    $("#editId").value = a.id;
    $("#fId").value = a.id;
    $("#fId").disabled = true;
    $("#fTitle").value = a.title || "";
    $("#fTitleBn").value = a.titleBn || "";
    $("#fGenre").value = (a.genre || []).join(", ");
    $("#fYear").value = a.year || "";
    $("#fLanguage").value = a.language || "Hindi Dubbed";
    $("#fStatus").value = a.status || "Ongoing";
    $("#fRating").value = a.rating ?? "";
    $("#fPoster").value = a.poster || "";
    $("#fDesc").value = a.description || "";
    $("#fTelegram").value = a.telegramUrl || "";
    $("#fTrending").checked = !!a.trending;
    $("#fLatest").checked = !!a.latest;
    $("#formTitle").textContent = "✏ EDIT: " + a.title;
    $("#saveBtn").textContent = "💾 UPDATE";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    $("#animeForm").reset();
    $("#editId").value = "";
    $("#fId").disabled = false;
    $("#formTitle").textContent = "➕ NEW ANIME ENTRY";
    $("#saveBtn").textContent = "💾 SAVE";
    $("#formMsg").textContent = "";
    $("#formMsg").className = "hack-msg";
  }

  function validate(a) {
    if (!a.id) return "ID required";
    if (!/^[a-z0-9-]+$/.test(a.id)) return "ID must be lowercase letters, numbers, hyphens only";
    if (!a.title) return "Title required";
    if (!a.genre.length) return "At least one genre required";
    if (!a.year) return "Year required";
    if (a.telegramUrl && !/^https?:\/\/t\.me\//i.test(a.telegramUrl)) return "Invalid Telegram URL (must be https://t.me/...)";
    if (a.poster && !/^https?:\/\//i.test(a.poster)) return "Invalid Poster URL (must start http/https)";
    return "";
  }

  function saveAnime(e) {
    e.preventDefault();
    const msg = $("#formMsg");
    const a = readForm();
    const editId = $("#editId").value;
    const err = validate(a);
    if (err) { msg.textContent = "⚠ " + err; msg.className = "hack-msg err"; return; }

    let custom = getCustom();

    if (editId) {
      const idx = custom.findIndex((x) => x.id === editId);
      if (idx >= 0) custom[idx] = { ...custom[idx], ...a, id: editId, _deleted: false };
      else custom.push({ ...a, id: editId, _deleted: false });
      msg.textContent = "✓ UPDATED";
    } else {
      if (typeof animeList !== "undefined" && animeList.some((x) => x.id === a.id)) {
        msg.textContent = "⚠ ID exists in anime-data.js. Use another ID.";
        msg.className = "hack-msg err";
        return;
      }
      const exists = custom.findIndex((x) => x.id === a.id);
      if (exists >= 0) custom[exists] = { ...a, _deleted: false };
      else custom.push(a);
      msg.textContent = "✓ ENTRY ADDED";
    }

    setCustom(custom);
    msg.className = "hack-msg ok";
    resetForm();
    renderList();
    setTimeout(() => { msg.textContent = ""; }, 2500);
  }

  function deleteAnime(id, source) {
    if (!confirm("Delete this anime entry?")) return;
    let custom = getCustom();
    custom = custom.filter((x) => x.id !== id);
    if (typeof animeList !== "undefined" && animeList.some((x) => x.id === id)) {
      custom.push({ id, _deleted: true });
    }
    setCustom(custom);
    renderList();
    toast("🗑 DELETED");
  }

  function renderList() {
    const listEl = $("#adminList");
    if (!listEl) return;
    const q = ($("#adminSearch")?.value || "").toLowerCase().trim();
    let all = getAll();
    if (q) {
      all = all.filter((a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || (a.titleBn || "").toLowerCase().includes(q));
    }
    all.sort((a, b) => a.title.localeCompare(b.title));
    listEl.innerHTML = "";
    if (!all.length) {
      listEl.innerHTML = `<div style="text-align:center;color:var(--hack-dim);padding:20px;font-size:0.75rem;letter-spacing:1px;">// NO ENTRIES FOUND</div>`;
      return;
    }
    all.forEach((a) => {
      const item = document.createElement("div");
      item.className = "hack-item";
      const isCustom = a._source === "custom";
      item.innerHTML = `<span class="ai-badge ${isCustom ? "custom" : "base"}">${isCustom ? "CUSTOM" : "BASE"}</span><div style="flex:1;min-width:0;"><div class="ai-title">${escapeHtml(a.title)}</div><div class="ai-meta">${escapeHtml(a.id)} • ${a.year} • ${escapeHtml(a.status || "")}${a.poster ? " 🖼" : ""}</div></div><button data-act="edit" title="Edit">✏</button><button data-act="del" class="del" title="Delete">🗑</button>`;
      item.querySelector('[data-act="edit"]').addEventListener("click", () => fillForm(a));
      item.querySelector('[data-act="del"]').addEventListener("click", () => deleteAnime(a.id, a._source));
      listEl.appendChild(item);
    });
  }

  // ★★★ EXPORT: সরাসরি anime-data.js এ paste করার মতো ★★★
  function exportData() {
    const custom = getCustom().filter((x) => !x._deleted);
    if (!custom.length) {
      toast("⚠ No custom anime to export");
      return;
    }

    const lines = custom.map((a) => {
      const obj = {
        id: a.id,
        title: a.title,
        titleBn: a.titleBn || "",
        genre: a.genre || [],
        year: a.year,
        language: a.language || "Hindi Dubbed",
        status: a.status || "Ongoing",
        rating: a.rating || 0,
        trending: !!a.trending,
        latest: !!a.latest,
        poster: a.poster || "",
        description: a.description || "",
        telegramUrl: a.telegramUrl || "",
      };
      return "  " + JSON.stringify(obj, null, 2).replace(/\n/g, "\n  ");
    });
    const content = "const animeList = [\n" + lines.join(",\n") + "\n];\n";

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "anime-data-" + Date.now() + ".js";
    link.click();
    URL.revokeObjectURL(url);

    toast("⬇ EXPORTED — anime-data.js এ paste করুন");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isAuthed()) showPanel();
    $("#loginBtn").addEventListener("click", () => {
      const pass = $("#adminPass").value;
      if (login(pass)) showPanel();
      else { $("#loginMsg").textContent = "✗ ACCESS DENIED — WRONG KEY"; $("#loginMsg").className = "hack-msg err"; }
    });
    $("#adminPass").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#loginBtn").click(); });
    $("#animeForm").addEventListener("submit", saveAnime);
    $("#resetBtn").addEventListener("click", resetForm);
    $("#logoutBtn").addEventListener("click", logout);
    $("#exportBtn").addEventListener("click", exportData);
    $("#adminSearch").addEventListener("input", renderList);
    $("#clearCustomBtn").addEventListener("click", () => {
      if (confirm("Wipe ALL custom anime (localStorage)?")) {
        localStorage.removeItem(CUSTOM_KEY);
        renderList();
        toast("🗑 ALL DATA WIPED");
      }
    });
  });
})();