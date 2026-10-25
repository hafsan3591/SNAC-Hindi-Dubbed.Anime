// script.js — SNAC ANIME core logic
(function () {
  "use strict";

  const CUSTOM_KEY = "snac_custom_anime";
  const POSTER_OVERRIDE_KEY = "snac_poster_overrides";
  const state = { search: "", genre: "all", language: "all", sort: "latest", section: "all" };
  const GENRES = ["Action", "Adventure", "Fantasy", "Romance", "Comedy", "Supernatural"];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (t) => t.split(/\s+/).filter(Boolean).slice(0, 3).map((w) => w[0].toUpperCase()).join("");
  const safeTelegram = (url) => typeof url === "string" && /^https?:\/\/t\.me\//i.test(url) ? url : (typeof DEFAULT_TELEGRAM !== "undefined" ? DEFAULT_TELEGRAM : "https://t.me/SNAC_hindi_anime");
  const animeUrl = (a) => safeTelegram(a.telegramUrl);
  const t = (key, vars) => window.i18n ? i18n.t(key, vars) : key;

  function getPosterOverrides() {
    try { return JSON.parse(localStorage.getItem(POSTER_OVERRIDE_KEY) || "{}"); }
    catch { return {}; }
  }
  function applyPosterOverride(a) {
    const ov = getPosterOverrides();
    if (ov[a.id]) return { ...a, poster: ov[a.id] };
    return a;
  }
  function getCustomAnime() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]"); }
    catch { return []; }
  }

  let _cache = null;
  function getAllAnime() {
    if (_cache) return _cache;
    const base = typeof animeList !== "undefined" ? animeList : [];
    const custom = getCustomAnime();
    const map = new Map();
    base.forEach((a) => map.set(a.id, { ...a }));
    custom.forEach((a) => {
      if (a._deleted) map.delete(a.id);
      else map.set(a.id, { ...a });
    });
    _cache = Array.from(map.values()).map(applyPosterOverride);
    return _cache;
  }
  function invalidateCache() { _cache = null; }

  function buildPoster(a) {
    const wrapper = document.createElement("div");
    wrapper.className = "poster";
    const badges = document.createElement("div");
    badges.className = "poster-badges";
    if (a.language) badges.appendChild(pill(a.language, "pill-lang"));
    if (a.status) badges.appendChild(pill(a.status, "pill-status"));
    wrapper.appendChild(badges);
    if (a.rating) {
      const r = document.createElement("span");
      r.className = "pill pill-rating";
      r.textContent = "★ " + a.rating;
      wrapper.appendChild(r);
    }
    const poster = (a.poster || "").trim();
    if (poster && /^https?:\/\//i.test(poster)) {
      const img = document.createElement("img");
      img.alt = a.title + " poster";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = poster;
      let errored = false;
      img.addEventListener("load", () => img.classList.add("loaded"));
      img.addEventListener("error", () => {
        if (errored) return;
        errored = true;
        img.remove();
        wrapper.appendChild(fallback(a));
      });
      wrapper.appendChild(img);
    } else {
      wrapper.appendChild(fallback(a));
    }
    return wrapper;
  }

  function pill(text, cls) {
    const p = document.createElement("span");
    p.className = "pill " + cls;
    p.textContent = text;
    return p;
  }

  function fallback(a) {
    const fb = document.createElement("div");
    fb.className = "poster-fallback";
    const init = document.createElement("div");
    init.className = "initials";
    init.textContent = initials(a.title);
    const sub = document.createElement("div");
    sub.className = "sub";
    sub.textContent = (a.year || "") + (a.status === "Movie" ? " • Movie" : "");
    fb.appendChild(init);
    fb.appendChild(sub);
    return fb;
  }

  function buildCard(a, idx = 0) {
    const card = document.createElement("article");
    card.className = "anime-card";
    card.dataset.id = a.id;
    card.style.animationDelay = Math.min(idx * 30, 300) + "ms";
    card.appendChild(buildPoster(a));
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = a.title;
    body.appendChild(title);
    const meta = document.createElement("div");
    meta.className = "card-meta";
    const genreSpan = document.createElement("span");
    genreSpan.className = "genre";
    genreSpan.textContent = (a.genre || []).join(" • ");
    meta.appendChild(genreSpan);
    if (a.year) {
      const y = document.createElement("span");
      y.textContent = "• " + a.year;
      meta.appendChild(y);
    }
    body.appendChild(meta);
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const details = document.createElement("button");
    details.className = "btn btn-details";
    details.type = "button";
    details.textContent = t("card.details") || "Details";
    details.addEventListener("click", () => openModal(a.id));
    actions.appendChild(details);
    const tg = document.createElement("a");
    tg.className = "btn btn-tg";
    tg.href = animeUrl(a);
    tg.target = "_blank";
    tg.rel = "noopener noreferrer";
    tg.textContent = t("card.telegram") || "Telegram";
    actions.appendChild(tg);
    body.appendChild(actions);
    card.appendChild(body);
    return card;
  }

  function filteredList() {
    let list = getAllAnime();
    if (state.section === "trending") list = list.filter((a) => a.trending);
    if (state.section === "latest") list = list.filter((a) => a.latest);
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || (a.titleBn || "").toLowerCase().includes(q) || (a.genre || []).some((g) => g.toLowerCase().includes(q)));
    }
    if (state.genre !== "all") list = list.filter((a) => (a.genre || []).includes(state.genre));
    if (state.language !== "all") list = list.filter((a) => (a.language || "").toLowerCase() === state.language.toLowerCase());
    const sorters = {
      latest: (a, b) => (b.year || 0) - (a.year || 0),
      oldest: (a, b) => (a.year || 0) - (b.year || 0),
      az: (a, b) => a.title.localeCompare(b.title),
      za: (a, b) => b.title.localeCompare(a.title),
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
    };
    list.sort(sorters[state.sort] || sorters.latest);
    return list;
  }

  function renderSection(containerId, list, emptyMsg) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    if (!list.length) {
      el.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="emoji">🔍</div><h3>${t("card.empty") || "কিছু পাওয়া যায়নি"}</h3><p>${escapeHtml(emptyMsg || t("card.emptyDesc") || "অন্য কিছু লিখে আবার চেষ্টা করুন।")}</p></div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach((a, i) => frag.appendChild(buildCard(a, i)));
    el.appendChild(frag);
  }

  function renderAll() {
    invalidateCache();
    const all = getAllAnime();
    const trending = all.filter((a) => a.trending).slice(0, 8);
    const latest = all.filter((a) => a.latest).sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 8);
    renderSection("trendingGrid", trending, t("card.noTrending") || "কোনো Trending Anime নেই।");
    renderSection("latestGrid", latest, t("card.noLatest") || "কোনো Latest Anime নেই।");
    renderSection("allGrid", filteredList(), t("card.noSearch") || "আপনার সার্চের সাথে কোনো Anime মেলেনি।");
    updateCount();
    renderCategories();
  }

  function updateCount() {
    const c = document.getElementById("filterCount");
    if (c) {
      const n = filteredList().length;
      c.textContent = t("filter.count", { n }) || ("মোট " + n + " টি Anime");
    }
  }

  function renderCategories() {
    const grid = document.getElementById("catGrid");
    if (!grid) return;
    const icons = { Action: "⚔️", Adventure: "🗺️", Fantasy: "✨", Romance: "💖", Comedy: "😂", Supernatural: "👻" };
    const all = getAllAnime();
    grid.innerHTML = "";
    GENRES.forEach((g) => {
      const count = all.filter((a) => (a.genre || []).includes(g)).length;
      const countText = t("card.countGenre", { n: count }) || (count + " টি Anime");
      const card = document.createElement("div");
      card.className = "cat-card";
      card.innerHTML = `<div class="cat-icon">${icons[g] || "🎬"}</div><div class="cat-name">${g}</div><div class="cat-count">${countText}</div>`;
      card.addEventListener("click", () => {
        state.genre = g;
        const gs = document.getElementById("genreSelect");
        if (gs) gs.value = g;
        renderAll();
        document.getElementById("all-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.appendChild(card);
    });
  }

  function openModal(id) {
    const a = getAllAnime().find((x) => x.id === id);
    if (!a) return;
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;
    overlay.innerHTML = "";
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    const close = document.createElement("button");
    close.className = "modal-close";
    close.type = "button";
    close.setAttribute("aria-label", t("modal.close") || "বন্ধ করুন");
    close.textContent = "✕";
    close.addEventListener("click", closeModal);
    modal.appendChild(close);
    const posterWrap = document.createElement("div");
    posterWrap.className = "modal-poster";
    posterWrap.appendChild(buildPoster(a));
    modal.appendChild(posterWrap);
    const body = document.createElement("div");
    body.className = "modal-body";
    body.innerHTML = `<h2>${escapeHtml(a.title)}</h2>${a.titleBn ? `<div class="sub-title">${escapeHtml(a.titleBn)}</div>` : ""}<div class="modal-tags">${(a.genre || []).map((g) => `<span class="tag">${escapeHtml(g)}</span>`).join("")}${a.year ? `<span class="tag">${a.year}</span>` : ""}${a.language ? `<span class="tag">${escapeHtml(a.language)}</span>` : ""}${a.status ? `<span class="tag">${escapeHtml(a.status)}</span>` : ""}${a.rating ? `<span class="tag">★ ${a.rating}</span>` : ""}</div><p class="desc">${escapeHtml(a.description || "")}</p><a class="btn btn-tg" href="${escapeHtml(animeUrl(a))}" target="_blank" rel="noopener noreferrer">${t("modal.watch") || "✈️ Telegram-এ দেখুন"}</a>`;
    modal.appendChild(body);
    overlay.appendChild(modal);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    close.focus();
  }

  function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.innerHTML = "";
    document.body.style.overflow = "";
  }

  function setupMobileMenu() {
    const btn = document.getElementById("hamburger");
    const menu = document.getElementById("mobileMenu");
    if (!btn || !menu) return;
    menu.style.display = "none";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.style.display !== "none";
      menu.style.display = isOpen ? "none" : "flex";
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
    $$("a, button", menu).forEach((a) => a.addEventListener("click", () => (menu.style.display = "none")));
    document.addEventListener("click", (e) => {
      if (menu.style.display !== "none" && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupFilters() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", (e) => { state[key] = e.target.value; renderAll(); });
    };
    bind("genreSelect", "genre");
    bind("languageSelect", "language");
    bind("sortSelect", "sort");
    bind("sectionSelect", "section");
    const search = document.getElementById("filterSearch");
    if (search) {
      let tm;
      search.addEventListener("input", (e) => {
        clearTimeout(tm);
        tm = setTimeout(() => { state.search = e.target.value; renderAll(); }, 120);
      });
    }
    const clearBtn = document.getElementById("clearFilters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        Object.assign(state, { search: "", genre: "all", language: "all", sort: "latest", section: "all" });
        ["genreSelect", "languageSelect", "sortSelect", "sectionSelect"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = id === "sortSelect" ? "latest" : "all";
        });
        ["filterSearch", "navSearch", "mobileSearch"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
        renderAll();
      });
    }
  }

  function setupNavSearch() {
    const navSearch = document.getElementById("navSearch");
    const filterSearch = document.getElementById("filterSearch");
    const mSearch = document.getElementById("mobileSearch");
    const section = document.getElementById("all-section");
    const apply = (v) => {
      state.search = v;
      if (filterSearch) filterSearch.value = v;
      if (navSearch) navSearch.value = v;
      if (mSearch) mSearch.value = v;
      renderAll();
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    let tm;
    const debounced = (e) => {
      clearTimeout(tm);
      tm = setTimeout(() => apply(e.target.value), 180);
    };
    if (navSearch) navSearch.addEventListener("input", debounced);
    if (mSearch) mSearch.addEventListener("input", debounced);
    const explore = document.getElementById("exploreBtn");
    if (explore) {
      explore.addEventListener("click", (e) => {
        e.preventDefault();
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function setupToTop() {
    const btn = document.getElementById("toTop");
    if (!btn) return;
    window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function setupModalEvents() {
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  function setupLanguageSwitcher() {
    if (!window.i18n) return;
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (btn && menu) {
      btn.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("open"); });
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove("open");
      });
      menu.querySelectorAll("[data-lang]").forEach((b) => {
        b.addEventListener("click", () => { i18n.setLang(b.dataset.lang); menu.classList.remove("open"); });
      });
    }
    document.querySelectorAll(".m-lang-options [data-lang]").forEach((b) => {
      b.addEventListener("click", () => i18n.setLang(b.dataset.lang));
    });
    const markActive = () => {
      const cur = i18n.getLang();
      document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("active", b.dataset.lang === cur));
    };
    markActive();
    window.addEventListener("snac:langchange", markActive);
  }

  window.addEventListener("storage", (e) => {
    if (e.key === CUSTOM_KEY || e.key === POSTER_OVERRIDE_KEY) {
      invalidateCache();
      renderAll();
    }
  });

  window.addEventListener("snac:langchange", () => {
    invalidateCache();
    renderAll();
  });

  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    setupFilters();
    setupNavSearch();
    setupMobileMenu();
    setupToTop();
    setupModalEvents();
    setupLanguageSwitcher();
  });

  window.SNAC = { openModal, closeModal, renderAll, invalidateCache };
})();