// anime-data.js — SNAC ANIME Database
// ★ এখানে যা anime থাকবে, সবাই ওয়েবসাইটে দেখতে পাবে ★
//
// নিয়ম:
// - Admin panel থেকে anime add করুন → Export করুন → সেই কোড এখানে paste করুন
// - প্রতিটা anime এর পরে কমা (,) দিতে ভুলবেন না
// - শেষ anime এর পরে কমা দিবেন না

const DEFAULT_TELEGRAM = "https://t.me/SNAC_hindi_anime";

const animeList = [
  // ★ এখানে আপনার anime যোগ করুন ★
  // উদাহরণ:
  // {
  //   id: "solo-leveling",
  //   title: "Solo Leveling",
  //   titleBn: "সোলো লেভেলিং",
  //   genre: ["Action", "Fantasy"],
  //   year: 2024,
  //   language: "Hindi Dubbed",
  //   status: "Ongoing",
  //   rating: 8.4,
  //   trending: true,
  //   latest: true,
  //   poster: "https://i.imgur.com/abc123.jpg",
  //   description: "বর্ণনা...",
  //   telegramUrl: "https://t.me/SNAC_hindi_anime/7"
  // },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { animeList, DEFAULT_TELEGRAM };
}