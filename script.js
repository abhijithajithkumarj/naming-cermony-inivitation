/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG = {
  babyName: "",
  groomName: "Arjun",
  brideName: "Ajanya",
  groomAbout: "",
  brideAbout: "",

  story: [
    { when: "", title: "Our First Spark ", text: "It was love at first sight!" },
    { when: "", title: "We fell in love", text: "" },
    {
      when: "25-1-2026",
      title: "The Day We Became One Forever",
      text: "A beautiful beginning to our forever. Surrounded by love, we promised to stand by each other through every moment of life."
    },
    {
      when: "7-11-2026",
      title: "Our Little Miracle Arrived ",
      text: "The day our hearts found a new reason to beat. A tiny little hand, a lifetime of love, and the beginning of our most beautiful journey as parents. Our family is now complete! ",
      popper: true
    },
    {
      when: "auto",
      title: "A Name to Cherish Forever",
      text: "A special day filled with love, blessings, and happiness as we give our little one a beautiful name. A precious memory we will cherish forever, with our loved ones by our side."
    },
  ],
  city: "Thempammoodu",
  venue: "Thempammoodu",
  address: "Thempammoodu",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=8.68193,76.945892",                         // PASTE your Google Maps share link here (best). Leave "" to search by name instead.
  mapsQuery: "Thempammoodu",            // used only when mapsLink is empty, e.g. "Venue name, Town, Kerala"
  eventStart: "2026-11-15T11:00:00",
  durationHours: 3,
  revealAt: "auto",                     // baby name reveal: "auto" = ceremony start, or e.g. "2026-11-15T11:30:00"
  tArrival: "11.00 AM",
  tCeremony: "11.30 AM",
  tFeast: "12.30 PM",
  tFarewell: "",
  whatsappNumber: "9946698561"
};
/* =================================== */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, "0");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Fill text ---------- */
  $$("[data-bind]").forEach(el => { const v = CONFIG[el.dataset.bind]; if (el.dataset.bind !== "babyName" && el.dataset.bind in CONFIG) el.textContent = v; });

  const start = new Date(CONFIG.eventStart);
  const end = new Date(start.getTime() + CONFIG.durationHours * 3600000);
  $$(".dd").forEach(e => e.textContent = pad(start.getDate()));
  $$(".mon").forEach(e => e.textContent = start.toLocaleString("en", { month: "short" }).toUpperCase());
  $$(".yy").forEach(e => e.textContent = String(start.getFullYear()).slice(2));

  /* ---------- Baby name: hidden until the reveal time ---------- */
  const revealAt = CONFIG.revealAt === "auto" ? start : new Date(CONFIG.revealAt);
  const nameEls = $$('[data-bind="babyName"]'), nameNote = $("#nameNote");
  const forced = location.hash === "#reveal";            // add #reveal to the link to preview the name
  let nameShown = false;
  function showName(animate) {
    nameShown = true;
    nameEls.forEach(el => { el.textContent = CONFIG.babyName; el.classList.remove("secret"); if (animate && !reduceMotion) { el.classList.remove("revealed"); void el.offsetWidth; el.classList.add("revealed"); } });
    if (nameNote) nameNote.hidden = true;
  }
  function hideName() {
    nameEls.forEach(el => { el.textContent = "Name to be revealed"; el.classList.add("secret"); });
    if (nameNote) {
      nameNote.textContent = "Our little one's name will be revealed on " + revealAt.toLocaleString("en", { day: "numeric", month: "long", year: "numeric" }) +
        " at " + revealAt.toLocaleString("en", { hour: "numeric", minute: "2-digit" }) + ".";
      nameNote.hidden = false;
    }
  }
  if (forced || Date.now() >= revealAt) showName(false); else hideName();

  /* ---------- Week calendar with heart ---------- */
  const dow = (start.getDay() + 6) % 7;
  const week = $("#week");
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() - dow + i);
    const cell = document.createElement("span");
    cell.className = "day" + (i === dow ? " hit" : "");
    cell.innerHTML = (i === dow
      ? '<svg width="40" height="38" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C4 14 1 10 1 6.5A5.5 5.5 0 0112 4a5.5 5.5 0 0111 2.5C23 10 20 14 12 21z" fill="#C2D58A"/></svg>'
      : "") + `<span>${d.getDate()}</span>`;
    week.appendChild(cell);
  }

  /* ---------- Links ---------- */
  const stamp = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const mapQuery = (CONFIG.mapsQuery && !CONFIG.mapsQuery.includes("[")) ? CONFIG.mapsQuery : [CONFIG.venue, CONFIG.city].filter(Boolean).join(", ");
  $("#mapBtn").href = CONFIG.mapsLink || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapQuery));
  $("#calBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent("Child Naming Ceremony") + "&dates=" + stamp(start) + "/" + stamp(end) +
    "&location=" + encodeURIComponent(CONFIG.venue + ", " + CONFIG.address);
  $("#waBtn").href = `https://wa.me/${CONFIG.whatsappNumber}?text=` +
    encodeURIComponent("We will be attending the naming ceremony! Thank you for the invitation.");

  /* ---------- Countdown ---------- */
  function tick() {
    if (!nameShown && Date.now() >= revealAt) showName(true);   // reveals itself at the ceremony time
    const d = Math.max(0, start - Date.now());
    $("#cdD").textContent = Math.floor(d / 86400000);
    $("#cdH").textContent = pad(Math.floor(d / 3600000) % 24);
    $("#cdM").textContent = pad(Math.floor(d / 60000) % 60);
    $("#cdS").textContent = pad(Math.floor(d / 1000) % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    items.forEach(i => io.observe(i));
  }

  /* ---------- Floating hearts ---------- */
  function startHearts() {
    if (reduceMotion) return;
    const box = $("#hearts");
    for (let i = 0; i < 7; i++) {
      const s = 12 + Math.random() * 8;
      box.insertAdjacentHTML("beforeend",
        `<svg class="fh" width="${s}" height="${s * .94}" viewBox="0 0 24 22" style="left:${6 + i * 13}%;animation-duration:${11 + Math.random() * 6}s;animation-delay:${i * 1.6}s"><path d="M12 21C4 14 1 10 1 6.5A5.5 5.5 0 0112 4a5.5 5.5 0 0111 2.5C23 10 20 14 12 21z" fill="currentColor"/></svg>`);
    }
  }

  /* ---------- Background sound: your song, loops. It is stored inside song-data.js,
     so it works from any folder, Live Server, or a website. ---------- */
  function songUrl() {
    return window.SONG_B64 ? "data:audio/mpeg;base64," + window.SONG_B64 : "assets/song.mp3";   // fallback if song-data.js is missing
  }
  const songEl = new Audio(songUrl());
  songEl.loop = true; songEl.preload = "auto"; songEl.volume = 1;   // volume: 0 to 1
  const songBtn = $("#songBtn");
  let musicOn = false;

  function note(msg) {
    let n = $("#soundNote");
    if (!n) {
      n = document.createElement("div"); n.id = "soundNote";
      n.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99;background:#fff;color:#a00;border:1px solid #a00;border-radius:8px;padding:10px 12px;font:14px/1.3 sans-serif;text-align:center";
      document.body.appendChild(n);
    }
    n.textContent = msg;
  }
  songEl.addEventListener("error", () => {
    musicOn = false; songBtn.classList.remove("on");
    note(window.SONG_B64 ? "The song could not be played by this browser." : "song-data.js was not found. Put it in the same folder as index.html.");
  });

  function startMusic() {
    if (musicOn) return;
    musicOn = true; songBtn.classList.add("on");
    songEl.play().catch(() => { musicOn = false; songBtn.classList.remove("on"); });
  }
  function stopMusic() {
    musicOn = false; songBtn.classList.remove("on");
    songEl.pause();
  }
  songBtn.addEventListener("click", () => musicOn ? stopMusic() : startMusic());

  /* ---------- Our Story: scroll road map ---------- */
  const ROAD_W = 430, ROAD_H = 1700, MEET_Y = 520;
  const MILESTONE_Y = [520, 760, 1000, 1240, 1480];
  const ICON = {
    him:    '<svg class="line" viewBox="0 0 40 64"><circle cx="20" cy="10" r="7"/><path d="M20 17v24M20 22l-11 10M20 22l11 10M20 41l-8 20M20 41l8 20"/></svg>',
    her:    '<svg class="line" viewBox="0 0 40 64"><circle cx="20" cy="10" r="7"/><path d="M20 17l-11 30h22zM20 21l-9 10M20 21l9 10M15 47v14M25 47v14"/></svg>',
    couple: '<svg class="line" viewBox="0 0 64 64"><circle cx="16" cy="11" r="6"/><path d="M16 17v22M16 21l14 11M16 39l-5 19M16 39l5 19"/><circle cx="48" cy="11" r="6"/><path d="M48 17l-10 26h20zM48 21l-14 11M43 43v15M53 43v15M30 32h4"/></svg>',
    couplePreg: '<svg class="line" viewBox="0 0 64 64"><circle cx="16" cy="11" r="6"/><path d="M16 17v22M16 21l14 11M16 39l-5 19M16 39l5 19"/><circle cx="48" cy="11" r="6"/><path d="M48 17l-8 14q-6 7 0 13h16q6-6 0-13zM48 21l-14 11M43 44v14M53 44v14M30 32h4"/></svg>',
    coupleBaby: '<svg class="line" viewBox="0 0 64 64"><circle cx="16" cy="11" r="6"/><path d="M16 17v22M16 21l14 11M16 39l-5 19M16 39l5 19"/><circle cx="46" cy="11" r="6"/><path d="M46 17l-10 26h20zM46 21l-12 11M41 43v15M51 43v15M30 32h4M46 22l8 8"/><circle cx="58" cy="27" r="3"/><path d="M58 30c-5 1-5 8 0 8s5-7 0-8z"/></svg>',
    popper: '<svg class="line popper" viewBox="0 0 40 40"><path d="M4 36L14 10l16 16z"/><path d="M8 27l9 5M11 20l11 6"/><path d="M22 6l2-4M30 12l5-3M33 20l5 1M20 15c2-6 8-4 8-10"/><circle cx="36" cy="30" r="1.2"/><circle cx="28" cy="2" r="1.2"/></svg>',
    heart:  '<svg viewBox="0 0 24 22"><path d="M12 21C4 14 1 10 1 6.5A5.5 5.5 0 0112 4a5.5 5.5 0 0111 2.5C23 10 20 14 12 21z" fill="currentColor"/></svg>'
  };
  let storyReady = false, roadUpdate = () => {};

  function initStory() {
    if (storyReady) return; storyReady = true;
    const road = $("#road"), progG = $("#roadProg");
    const base = { g: $("#rbG"), b: $("#rbB"), m: $("#rbM") };
    const prog = {}, len = {};
    for (const k in base) {                       // progress line = copy of each base path
      const p = base[k].cloneNode(); p.removeAttribute("id"); p.setAttribute("pathLength", "1");
      progG.appendChild(p); prog[k] = p; len[k] = base[k].getTotalLength();
    }
    // all three paths go downwards only, so a point can be found from its height
    const lenAtY = (path, y) => {
      let lo = 0, hi = path.getTotalLength();
      for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).y < y) lo = mid; else hi = mid; }
      return lo;
    };
    const make = (cls, html) => { const d = document.createElement("div"); d.className = cls; if (html) d.innerHTML = html; road.appendChild(d); return d; };

    const heart = make("meetheart", ICON.heart);
    const him = make("walker", ICON.him), her = make("walker", ICON.her);
    const couple = make("walker couple", ICON.couple);
    couple.hidden = true;
    let stageNow = "couple", popped = false;

    const monthLong = start.toLocaleString("en", { month: "long" });
    const marks = CONFIG.story.slice(0, MILESTONE_Y.length).map((m, i) => {
      const y = MILESTONE_Y[i], p = base.m.getPointAtLength(lenAtY(base.m, y));
      const node = make("node"); node.style.top = y + "px"; node.style.left = (p.x / ROAD_W * 100) + "%";
      const card = make("mcard " + (i % 2 ? "l" : "r")); card.style.top = (y - 24) + "px";
      const cap = document.createElement("span"); cap.className = "cap";
      cap.textContent = m.when === "auto" ? start.getDate() + " " + monthLong + " " + start.getFullYear() : m.when;
      const b = document.createElement("b"); b.textContent = m.title;
      const d = document.createElement("span"); d.className = "d"; d.textContent = m.text;
      card.append(cap, b, d);
      if (m.popper) { const t = document.createElement("div"); t.innerHTML = ICON.popper; card.prepend(t.firstChild); }
      return { y, node, card, popper: !!m.popper };
    });

    const babyMark = marks.find(k => k.popper);
    const BABY_Y = babyMark ? babyMark.y : -1, PREGNANT_Y = BABY_Y - 180;

    function confetti() {                         // party popper burst around the baby stop
      if (reduceMotion || !babyMark) return;
      const colors = ["#E4EDC4", "#C2D58A", "#F6F1E3", "#E2B497", "#FFFFFF"];
      for (let i = 0; i < 36; i++) {
        const c = document.createElement("i"); c.className = "confetti";
        c.style.left = babyMark.node.style.left; c.style.top = babyMark.y + "px"; c.style.background = colors[i % colors.length];
        road.appendChild(c);
        const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.5, sp = 60 + Math.random() * 120;
        const dx = Math.cos(ang) * sp, dy = Math.sin(ang) * sp, rot = (Math.random() - .5) * 720;
        c.animate([
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 1, offset: .55 },
          { transform: `translate(${dx * 1.15}px,${dy + 110}px) rotate(${rot * 1.5}deg)`, opacity: 0 }
        ], { duration: 1400 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => c.remove();
      }
    }

    const put = (el, path, l, sx, sy) => { const pt = path.getPointAtLength(l); el.style.left = pt.x * sx + "px"; el.style.top = pt.y * sy + "px"; };

    roadUpdate = function () {
      const r = road.getBoundingClientRect();
      const sx = road.clientWidth / ROAD_W, sy = road.clientHeight / ROAD_H;
      // the walkers stay level with a line across the screen and move down as you scroll
      const wy = reduceMotion ? ROAD_H : Math.max(0, Math.min(ROAD_H, innerHeight * 0.55 - r.top));
      const lg = lenAtY(base.g, wy), lb = lenAtY(base.b, wy), lm = lenAtY(base.m, wy);
      prog.g.style.strokeDashoffset = 1 - lg / len.g;
      prog.b.style.strokeDashoffset = 1 - lb / len.b;
      prog.m.style.strokeDashoffset = 1 - lm / len.m;

      const merged = wy >= MEET_Y;
      him.hidden = her.hidden = merged;
      couple.hidden = !merged;
      heart.classList.toggle("on", merged);
      if (!merged) { put(him, base.g, lg, sx, sy); put(her, base.b, lb, sx, sy); }
      else put(couple, base.m, lm, sx, sy);

      // after the wedding the mother looks pregnant; after the baby stop the parents carry the baby
      const stage = !babyMark ? "couple" : wy >= BABY_Y ? "coupleBaby" : wy >= PREGNANT_Y ? "couplePreg" : "couple";
      if (stage !== stageNow) { stageNow = stage; couple.innerHTML = ICON[stage]; }
      if (babyMark) {
        if (wy >= BABY_Y && !popped) { popped = true; confetti(); }
        else if (wy < BABY_Y - 80) popped = false;
      }

      marks.forEach(k => { const on = wy >= k.y - 6; k.node.classList.toggle("on", on); k.card.classList.toggle("on", on); });
    };
    roadUpdate();
  }

  /* ---------- Scroll bar + scroll hint ---------- */
  const bar = $("#progress"), hint = $(".scrollhint");
  let frame = false;
  function onScroll() {
    if (frame) return; frame = true;
    requestAnimationFrame(() => {
      frame = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
      if (hint) hint.classList.toggle("gone", scrollY > 40);
      roadUpdate();
    });
  }

  /* ---------- Open invitation ---------- */
  $("#seal").addEventListener("click", () => {
    const cover = $("#cover");
    cover.classList.add("leaving");
    startMusic();                      // song starts right at the tap
    setTimeout(() => {
      cover.hidden = true;
      $("#main").hidden = false;
      songBtn.hidden = false;
      scrollTo(0, 0);
      initReveal(); startHearts();
      initStory(); bar.hidden = false;
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", () => { roadUpdate(); onScroll(); });
      onScroll();
    }, reduceMotion ? 0 : 800);
  });
})();
