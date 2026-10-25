// admin.js — SNAC ANIME Admin Panel
(function () {
  "use strict";

  const ADMIN_KEY = "snac_admin_auth";
  const CUSTOM_KEY = "snac_custom_anime";
  const POSTER_OVERRIDE_KEY = "snac_poster_overrides";
  const DEFAULT_PASS = "HM-385-MH";

  const $ = (s) => document.querySelector(s);

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function getCustom() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]"); }
    catch { return []; }
  }
  function setCustom(list) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); }
  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(POSTER_OVERRIDE_KEY) || "{}"); }
    catch { return {}; }
  }
  function setOverrides(o) { localStorage.setItem(POSTER_OVERRIDE_KEY, JSON.stringify(o)); }

  function getAll() {
    const base = typeof animeList !== "undefined" ? animeList : [];
    const custom = getCustom();
    const ov = getOverrides();
    const map = new Map();
    base.forEach((a) => map.set(a.id, { ...a, _source: "base" }));
    custom.forEach((a) => {
      if (a._deleted) map.delete(a.id);
      else map.set(a.id, { ...a, _source: "custom" });
    });
    return Array.from(map.values()).map((a) => ov[a.id] ? { ...a, poster: ov[a.id] } : a);
  }

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove("show"), 2200);
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
    $("#formTitle").textContent = "✏️ এডিট: " + a.title;
    $("#saveBtn").textContent = "💾 আপডেট করুন";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    $("#animeForm").reset();
    $("#editId").value = "";
    $("#fId").disabled = false;
    $("#formTitle").textContent = "➕ নতুন Anime যোগ করুন";
    $("#saveBtn").textContent = "💾 সেভ করুন";
    $("#formMsg").textContent = "";
    $("#formMsg").className = "msg";
  }

  function validate(a) {
    if (!a.id) return "ID দিন";
    if (!/^[a-z0-9-]+$/.test(a.id)) return "ID শুধু ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন হতে পারে";
    if (!a.title) return "Title দিন";
    if (!a.genre.length) return "কমপক্ষে একটি Genre দিন";
    if (!a.year) return "Year দিন";
    if (a.telegramUrl && !/^https?:\/\/t\.me\//i.test(a.telegramUrl)) return "Telegram URL সঠিক নয় (https://t.me/...)";
    if (a.poster && !/^https?:\/\//i.test(a.poster)) return "Poster URL সঠিক নয় (http/https দিয়ে শুরু হতে হবে)";
    return "";
  }

  function saveAnime(e) {
    e.preventDefault();
    const msg = $("#formMsg");
    const a = readForm();
    const editId = $("#editId").value;
    const err = validate(a);
    if (err) { msg.textContent = "⚠️ " + err; msg.className = "msg err"; return; }

    let custom = getCustom();
    const overrides = getOverrides();

    if (editId) {
      const isBase = typeof animeList !== "undefined" && animeList.some((x) => x.id === editId);
      const idx = custom.findIndex((x) => x.id === editId);
      if (idx >= 0) custom[idx] = { ...custom[idx], ...a, id: editId };
      else if (isBase) custom.push({ ...a, id: editId });
      else custom.push(a);
      overrides[editId] = a.poster || "";
      setOverrides(overrides);
      msg.textContent = "✅ আপডেট হয়েছে!";
    } else {
      if (typeof animeList !== "undefined" && animeList.some((x) => x.id === a.id)) {
        msg.textContent = "⚠️ এই ID বেস ডেটায় আছে। অন্য ID দিন বা এডিট করুন।";
        msg.className = "msg err";
        return;
      }
      const exists = custom.findIndex((x) => x.id === a.id);
      if (exists >= 0) custom[exists] = a;
      else custom.push(a);
      if (a.poster) { overrides[a.id] = a.poster; setOverrides(overrides); }
      msg.textContent = "✅ যোগ হয়েছে!";
    }

    setCustom(custom);
    msg.className = "msg ok";
    resetForm();
    renderList();
    setTimeout(() => { msg.textContent = ""; }, 2500);
  }

  function deleteAnime(id, source) {
    if (!confirm("এই Anime মুছে ফেলবেন?")) return;
    let custom = getCustom();
    const overrides = getOverrides();
    if (source === "custom") {
      custom = custom.filter((x) => x.id !== id);
      if (typeof animeList !== "undefined" && animeList.some((x) => x.id === id)) {
        custom.push({ id, _deleted: true });
      }
    } else {
      const exists = custom.find((x) => x.id === id);
      if (exists) custom = custom.filter((x) => x.id !== id);
      const base = (typeof animeList !== "undefined" ? animeList : []).find((x) => x.id === id);
      if (base) custom.push({ id, _deleted: true });
    }
    delete overrides[id];
    setOverrides(overrides);
    setCustom(custom);
    renderList();
    toast("🗑 ডিলিট হয়েছে");
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
      listEl.innerHTML = `<div style="text-align:center;color:var(--text-soft);padding:20px;">কোনো Anime নেই</div>`;
      return;
    }
    all.forEach((a) => {
      const item = document.createElement("div");
      item.className = "admin-item";
      const isCustom = a._source === "custom";
      item.innerHTML = `<span class="ai-badge ${isCustom ? "custom" : "base"}">${isCustom ? "Custom" : "Base"}</span><div style="flex:1;min-width:0;"><div class="ai-title">${escapeHtml(a.title)}</div><div class="ai-meta">${escapeHtml(a.id)} • ${a.year} • ${escapeHtml(a.status || "")}${a.poster ? " 🖼️" : ""}</div></div><button class="btn btn-ghost" data-act="edit" title="এডিট">✏️</button><button class="btn btn-ghost" data-act="del" style="color:#f87171;" title="ডিলিট">🗑</button>`;
      item.querySelector('[data-act="edit"]').addEventListener("click", () => fillForm(a));
      item.querySelector('[data-act="del"]').addEventListener("click", () => deleteAnime(a.id, a._source));
      listEl.appendChild(item);
    });
  }

  function exportJson() {
    const data = { anime: getCustom(), posterOverrides: getOverrides() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "snac-data-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(url);
    toast("⬇ এক্সপোর্ট হয়েছে");
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let parsed = JSON.parse(e.target.result);
        let animeArr = Array.isArray(parsed) ? parsed : parsed.anime || [];
        let ov = Array.isArray(parsed) ? {} : parsed.posterOverrides || {};
        if (!Array.isArray(animeArr)) throw new Error("Invalid format");
        const existing = getCustom();
        const map = new Map(existing.map((x) => [x.id, x]));
        animeArr.forEach((x) => { if (x.id) map.set(x.id, x); });
        setCustom(Array.from(map.values()));
        const merged = { ...getOverrides(), ...ov };
        setOverrides(merged);
        renderList();
        $("#listMsg").textContent = "✅ ইমপোর্ট সফল";
        $("#listMsg").className = "msg ok";
        toast("✅ ইমপোর্ট সফল");
      } catch (err) {
        $("#listMsg").textContent = "⚠️ ইমপোর্ট ব্যর্থ: " + err.message;
        $("#listMsg").className = "msg err";
      }
    };
    reader.readAsText(file);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isAuthed()) showPanel();
    $("#loginBtn").addEventListener("click", () => {
      const pass = $("#adminPass").value;
      if (login(pass)) showPanel();
      else { $("#loginMsg").textContent = "❌ ভুল পাসওয়ার্ড"; $("#loginMsg").className = "msg err"; }
    });
    $("#adminPass").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#loginBtn").click(); });
    $("#animeForm").addEventListener("submit", saveAnime);
    $("#resetBtn").addEventListener("click", resetForm);
    $("#logoutBtn").addEventListener("click", logout);
    $("#exportBtn").addEventListener("click", exportJson);
    $("#importBtn").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => {
      if (e.target.files[0]) importJson(e.target.files[0]);
      e.target.value = "";
    });
    $("#adminSearch").addEventListener("input", renderList);
    $("#clearCustomBtn").addEventListener("click", () => {
      if (confirm("সব কাস্টম Anime আর ছবির override মুছে ফেলবেন?")) {
        localStorage.removeItem(CUSTOM_KEY);
        localStorage.removeItem(POSTER_OVERRIDE_KEY);
        renderList();
        toast("🗑 সব ডেটা মুছে ফেলা হয়েছে");
      }
    });
  });
})();