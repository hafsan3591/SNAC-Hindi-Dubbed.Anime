// i18n.js — SNAC ANIME Multi-Language Engine
(function () {
  "use strict";

  const LANG_KEY = "snac_lang";
  const SUPPORTED = ["bn", "en", "hi"];
  const DEFAULT_LANG = "bn";

  const translations = {
    bn: {
      "nav.home": "হোম", "nav.all": "সব Anime", "nav.categories": "ক্যাটাগরি",
      "nav.about": "সম্পর্কে", "nav.privacy": "Privacy Policy", "nav.disclaimer": "Disclaimer",
      "nav.admin": "Admin Panel", "nav.telegram": "✈️ Telegram", "nav.search": "Anime খুঁজুন...",
      "hero.badge": "Hindi Dubbed Anime Collection", "hero.title1": "আপনার প্রিয়",
      "hero.title2": "Anime", "hero.title3": "এখন এক জায়গায়।",
      "hero.desc": "SNAC ANIME-এ পাবেন Trending, Latest এবং বাছাই করা হিন্দি ডাব Anime-এর সম্পূর্ণ কালেকশন। সুন্দরভাবে সাজানো, দ্রুত সার্চ, আর এক ক্লিকে Telegram-এ।",
      "hero.explore": "🚀 Explore Anime", "hero.join": "✈️ Telegram-এ যোগ দিন",
      "sec.trending": "Trending Anime", "sec.trendingSub": "জনপ্রিয় এবং সর্বাধিক দেখা Anime",
      "sec.latest": "Latest Anime", "sec.latestSub": "নতুন যোগ হওয়া Anime",
      "sec.all": "সব Anime", "sec.allSub": "সার্চ, জেনার এবং ভাষা দিয়ে ফিল্টার করুন",
      "sec.categories": "Anime Categories", "sec.categoriesSub": "আপনার পছন্দের জেনার বেছে নিন",
      "sec.viewAll": "সব দেখুন →",
      "filter.search": "সার্চ", "filter.searchPh": "Anime-এর নাম...",
      "filter.genre": "জেনার", "filter.language": "ভাষা", "filter.sort": "সাজান",
      "filter.section": "সেকশন", "filter.all": "সব", "filter.trending": "Trending", "filter.latest": "Latest",
      "filter.sortLatest": "নতুন আগে", "filter.sortOldest": "পুরনো আগে",
      "filter.sortAz": "A → Z", "filter.sortZa": "Z → A", "filter.sortRating": "রেটিং",
      "filter.reset": "রিসেট", "filter.count": "মোট {n} টি Anime",
      "card.details": "Details", "card.telegram": "Telegram",
      "card.empty": "কিছু পাওয়া যায়নি", "card.emptyDesc": "অন্য কিছু লিখে আবার চেষ্টা করুন।",
      "card.noTrending": "কোনো Trending Anime নেই।", "card.noLatest": "কোনো Latest Anime নেই।",
      "card.noSearch": "আপনার সার্চের সাথে কোনো Anime মেলেনি।",
      "card.countGenre": "{n} টি Anime",
      "modal.watch": "✈️ Telegram-এ দেখুন", "modal.close": "বন্ধ করুন",
      "tg.title": "📢 SNAC Telegram-এ যোগ দিন",
      "tg.desc": "সবচেয়ে আগে নতুন Anime আপডেট, রিলিজ নোটিফিকেশন এবং একচেটিয়া কনটেন্ট পেতে আমাদের Telegram চ্যানেলে যোগ দিন।",
      "tg.join": "✈️ Join Telegram",
      "footer.desc": "আপনার প্রিয় Hindi Dubbed Anime এক জায়গায়। Premium, দ্রুত এবং সম্পূর্ণ ফ্রি।",
      "footer.nav": "নেভিগেশন", "footer.legal": "লিগ্যাল", "footer.contact": "যোগাযোগ",
      "footer.tgChannel": "✈️ Telegram Channel", "footer.email": "📧 Email",
      "footer.rights": "All rights reserved. Made with ❤️ for Anime fans.",
      "lang.label": "ভাষা"
    },
    en: {
      "nav.home": "Home", "nav.all": "All Anime", "nav.categories": "Categories",
      "nav.about": "About", "nav.privacy": "Privacy Policy", "nav.disclaimer": "Disclaimer",
      "nav.admin": "Admin Panel", "nav.telegram": "✈️ Telegram", "nav.search": "Search anime...",
      "hero.badge": "Hindi Dubbed Anime Collection", "hero.title1": "Your favorite",
      "hero.title2": "Anime", "hero.title3": "now in one place.",
      "hero.desc": "SNAC ANIME brings you a complete collection of Trending, Latest, and hand-picked Hindi Dubbed Anime — beautifully organized, blazing-fast search, and one-click access to Telegram.",
      "hero.explore": "🚀 Explore Anime", "hero.join": "✈️ Join Telegram",
      "sec.trending": "Trending Anime", "sec.trendingSub": "Popular and most-watched anime",
      "sec.latest": "Latest Anime", "sec.latestSub": "Recently added anime",
      "sec.all": "All Anime", "sec.allSub": "Search, filter by genre and language",
      "sec.categories": "Anime Categories", "sec.categoriesSub": "Pick your favorite genre",
      "sec.viewAll": "View all →",
      "filter.search": "Search", "filter.searchPh": "Anime title...",
      "filter.genre": "Genre", "filter.language": "Language", "filter.sort": "Sort",
      "filter.section": "Section", "filter.all": "All", "filter.trending": "Trending", "filter.latest": "Latest",
      "filter.sortLatest": "Newest first", "filter.sortOldest": "Oldest first",
      "filter.sortAz": "A → Z", "filter.sortZa": "Z → A", "filter.sortRating": "Rating",
      "filter.reset": "Reset", "filter.count": "Total {n} anime",
      "card.details": "Details", "card.telegram": "Telegram",
      "card.empty": "Nothing found", "card.emptyDesc": "Try a different search.",
      "card.noTrending": "No trending anime yet.", "card.noLatest": "No latest anime yet.",
      "card.noSearch": "No anime matched your search.",
      "card.countGenre": "{n} anime",
      "modal.watch": "✈️ Watch on Telegram", "modal.close": "Close",
      "tg.title": "📢 Join SNAC on Telegram",
      "tg.desc": "Get the earliest anime updates, release notifications, and exclusive content by joining our Telegram channel.",
      "tg.join": "✈️ Join Telegram",
      "footer.desc": "Your favorite Hindi Dubbed Anime in one place. Premium, fast, and completely free.",
      "footer.nav": "Navigation", "footer.legal": "Legal", "footer.contact": "Contact",
      "footer.tgChannel": "✈️ Telegram Channel", "footer.email": "📧 Email",
      "footer.rights": "All rights reserved. Made with ❤️ for Anime fans.",
      "lang.label": "Language"
    },
    hi: {
      "nav.home": "होम", "nav.all": "सभी Anime", "nav.categories": "श्रेणियाँ",
      "nav.about": "हमारे बारे में", "nav.privacy": "Privacy Policy", "nav.disclaimer": "Disclaimer",
      "nav.admin": "Admin Panel", "nav.telegram": "✈️ Telegram", "nav.search": "Anime खोजें...",
      "hero.badge": "Hindi Dubbed Anime Collection", "hero.title1": "आपका पसंदीदा",
      "hero.title2": "Anime", "hero.title3": "अब एक जगह।",
      "hero.desc": "SNAC ANIME में Trending, Latest और चुनिंदा Hindi Dubbed Anime का पूरा कलेक्शन — खूबसूरती से व्यवस्थित, तेज़ सर्च और एक क्लिक में Telegram तक।",
      "hero.explore": "🚀 Explore Anime", "hero.join": "✈️ Telegram से जुड़ें",
      "sec.trending": "Trending Anime", "sec.trendingSub": "लोकप्रिय और सबसे ज़्यादा देखे गए Anime",
      "sec.latest": "Latest Anime", "sec.latestSub": "नए जोड़े गए Anime",
      "sec.all": "सभी Anime", "sec.allSub": "सर्च करें, जॉनर और भाषा से फ़िल्टर करें",
      "sec.categories": "Anime Categories", "sec.categoriesSub": "अपना पसंदीदा जॉनर चुनें",
      "sec.viewAll": "सब देखें →",
      "filter.search": "सर्च", "filter.searchPh": "Anime का नाम...",
      "filter.genre": "जॉनर", "filter.language": "भाषा", "filter.sort": "क्रम",
      "filter.section": "सेक्शन", "filter.all": "सभी", "filter.trending": "Trending", "filter.latest": "Latest",
      "filter.sortLatest": "नए पहले", "filter.sortOldest": "पुराने पहले",
      "filter.sortAz": "A → Z", "filter.sortZa": "Z → A", "filter.sortRating": "रेटिंग",
      "filter.reset": "रीसेट", "filter.count": "कुल {n} Anime",
      "card.details": "Details", "card.telegram": "Telegram",
      "card.empty": "कुछ नहीं मिला", "card.emptyDesc": "कुछ और लिखकर कोशिश करें।",
      "card.noTrending": "कोई Trending Anime नहीं।", "card.noLatest": "कोई Latest Anime नहीं।",
      "card.noSearch": "आपकी सर्च से कोई Anime नहीं मिला।",
      "card.countGenre": "{n} Anime",
      "modal.watch": "✈️ Telegram पर देखें", "modal.close": "बंद करें",
      "tg.title": "📢 SNAC Telegram से जुड़ें",
      "tg.desc": "सबसे पहले नए Anime अपडेट, रिलीज़ नोटिफिकेशन और एक्सक्लूसिव कंटेंट पाने के लिए हमारे Telegram चैनल से जुड़ें।",
      "tg.join": "✈️ Join Telegram",
      "footer.desc": "आपका पसंदीदा Hindi Dubbed Anime एक जगह। Premium, तेज़ और पूरी तरह फ्री।",
      "footer.nav": "नेविगेशन", "footer.legal": "लीगल", "footer.contact": "संपर्क",
      "footer.tgChannel": "✈️ Telegram Channel", "footer.email": "📧 Email",
      "footer.rights": "All rights reserved. Made with ❤️ for Anime fans.",
      "lang.label": "भाषा"
    }
  };

  const LANG_NAMES = { bn: "বাংলা", en: "English", hi: "हिन्दी" };
  const LANG_FLAGS = { bn: "🇧🇩", en: "🇬🇧", hi: "🇮🇳" };

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    apply();
    window.dispatchEvent(new CustomEvent("snac:langchange", { detail: { lang } }));
  }

  function t(key, vars) {
    const lang = getLang();
    let str = (translations[lang] && translations[lang][key]) || (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return str;
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.children.length > 0) {
        let textNode = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (textNode) textNode.textContent = " " + val + " ";
        else el.appendChild(document.createTextNode(val));
      } else {
        el.textContent = val;
      }
    });
    root.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    root.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    const currentName = LANG_NAMES[getLang()] || LANG_NAMES[DEFAULT_LANG];
    root.querySelectorAll("[data-lang-current]").forEach((el) => { el.textContent = currentName; });
    root.querySelectorAll("[data-lang-flag]").forEach((el) => { el.textContent = LANG_FLAGS[getLang()]; });
  }

  window.i18n = { t, getLang, setLang, apply, SUPPORTED, NAMES: LANG_NAMES, FLAGS: LANG_FLAGS };

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = getLang();
    apply();
  });
})();