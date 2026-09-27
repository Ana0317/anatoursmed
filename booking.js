/* ============================================================
   Ana María — Booking widget (visitor side)
   Works in DEMO mode (localStorage) until GAS_URL is set,
   then talks to the Google Apps Script backend.
   ============================================================ */
(function () {
  const CFG = window.BOOKING || {};
  const LIVE = !!(CFG.GAS_URL && CFG.GAS_URL.trim());
  const LS_KEY = "am_bookings_demo";
  const $ = (s, c = document) => c.querySelector(s);

  const form = $("[data-booking-form]");
  if (!form) return;

  const tourSel = form.querySelector('[name="tour"]');
  const timeSel = form.querySelector('[name="time"]');
  const dateInp = form.querySelector('[name="date"]');
  const peopleInp = form.querySelector('[name="people"]');
  const allergyToggle = $("[data-allergy-toggle]");
  const allergyWrap = $("[data-allergy-wrap]");
  const availBox = $("[data-availability]");
  const msgBox = $("[data-booking-msg]");
  const demoBanner = $("[data-demo-banner]");

  /* ---- populate selects ---- */
  (CFG.TOURS || []).forEach((t) => {
    const o = document.createElement("option");
    o.value = t.id; o.textContent = t.name; tourSel.appendChild(o);
  });
  (CFG.TIMES || []).forEach((t) => {
    const o = document.createElement("option");
    o.value = t.v; o.textContent = t.label; timeSel.appendChild(o);
  });
  peopleInp.max = CFG.CAPACITY || 7;

  // min date = today
  const today = new Date().toISOString().slice(0, 10);
  if (dateInp) dateInp.min = today;

  if (demoBanner && !LIVE) demoBanner.hidden = false;

  const tourName = (id) => ((CFG.TOURS || []).find((t) => t.id === id) || {}).name || id;

  /* ---- data layer ---- */
  const demoAll = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (e) { return []; } };
  const demoSave = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

  async function availability(date, time) {
    if (LIVE) {
      const url = CFG.GAS_URL + "?date=" + encodeURIComponent(date) + "&time=" + encodeURIComponent(time);
      const r = await fetch(url);
      return await r.json();
    }
    const inSlot = demoAll().filter((b) => b.date === date && b.time === time);
    const taken = inSlot.reduce((s, b) => s + Number(b.people || 0), 0);
    const tours = {};
    inSlot.forEach((b) => { tours[b.tour] = (tours[b.tour] || 0) + Number(b.people || 0); });
    return { ok: true, capacity: CFG.CAPACITY, taken, remaining: Math.max(0, (CFG.CAPACITY || 7) - taken), tours };
  }

  async function book(payload) {
    if (LIVE) {
      const r = await fetch(CFG.GAS_URL, { method: "POST", body: JSON.stringify(payload) });
      return await r.json();
    }
    const all = demoAll();
    const inSlot = all.filter((b) => b.date === payload.date && b.time === payload.time);
    const taken = inSlot.reduce((s, b) => s + Number(b.people || 0), 0);
    if (taken + Number(payload.people) > (CFG.CAPACITY || 7)) {
      return { ok: false, error: "full", remaining: Math.max(0, (CFG.CAPACITY || 7) - taken) };
    }
    all.push(Object.assign({ timestamp: new Date().toISOString() }, payload));
    demoSave(all);
    return { ok: true, remaining: Math.max(0, (CFG.CAPACITY || 7) - (taken + Number(payload.people))) };
  }

  /* ---- availability panel ---- */
  async function refreshAvailability() {
    const date = dateInp.value, time = timeSel.value;
    if (!date || !time) { availBox.innerHTML = '<p class="av-hint">Pick a date and time to see live availability.</p>'; return; }
    availBox.innerHTML = '<p class="av-hint">Checking availability…</p>';
    try {
      const a = await availability(date, time);
      const cap = a.capacity || CFG.CAPACITY || 7;
      const remaining = a.remaining != null ? a.remaining : cap - (a.taken || 0);
      const taken = a.taken || (cap - remaining);
      const pct = Math.min(100, Math.round((taken / cap) * 100));
      let toursHtml = "";
      const tours = a.tours || {};
      const keys = Object.keys(tours);
      if (keys.length) {
        toursHtml = '<ul class="av-tours">' + keys.map((k) =>
          '<li><span>' + tourName(k) + '</span><b>' + tours[k] + '</b></li>').join("") + "</ul>";
      } else {
        toursHtml = '<p class="av-hint">No one booked yet for this slot — you could be first!</p>';
      }
      availBox.innerHTML =
        '<div class="av-top"><div><span class="av-num">' + taken + '</span><span class="av-cap"> / ' + cap + ' spots taken</span></div>' +
        '<div class="av-left">' + remaining + ' left</div></div>' +
        '<div class="av-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="av-tours-title">Booked in this slot</div>' + toursHtml;
      peopleInp.max = Math.max(1, remaining);
    } catch (e) {
      availBox.innerHTML = '<p class="av-hint">Could not load availability. Please try again.</p>';
    }
  }

  dateInp && dateInp.addEventListener("change", refreshAvailability);
  timeSel && timeSel.addEventListener("change", refreshAvailability);

  /* ---- allergy toggle ---- */
  if (allergyToggle && allergyWrap) {
    allergyToggle.addEventListener("change", () => {
      allergyWrap.hidden = !allergyToggle.checked;
      if (allergyToggle.checked) allergyWrap.querySelector("textarea").focus();
    });
  }

  /* ---- quick-select from tour cards ---- */
  document.querySelectorAll("[data-book-tour]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-book-tour");
      if (id) tourSel.value = id;
    });
  });

  /* ---- submit ---- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgBox.hidden = true;
    const data = new FormData(form);
    const payload = {
      tour: data.get("tour"),
      date: data.get("date"),
      time: data.get("time"),
      people: Number(data.get("people")) || 1,
      name: (data.get("name") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      phone: (data.get("phone") || "").toString().trim(),
      allergies: allergyToggle && allergyToggle.checked ? (data.get("allergies") || "").toString().trim() : ""
    };
    if (!payload.date || !payload.time || !payload.name || !payload.phone) {
      return showMsg("Please fill in your name, phone, date and time.", false);
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true; const label = btn.textContent; btn.textContent = "Booking…";
    try {
      const res = await book(payload);
      if (res.ok) {
        showMsg("✅ Booked! Ana María will confirm on WhatsApp. " +
          (res.remaining != null ? res.remaining + " spot(s) left in this slot." : ""), true);
        form.reset();
        if (allergyWrap) allergyWrap.hidden = true;
        refreshAvailability();
      } else if (res.error === "full") {
        showMsg("Sorry, that slot is full (" + (res.remaining || 0) + " left). Try another time or day, or message Ana María to open a new slot.", false);
        refreshAvailability();
      } else {
        showMsg("Something went wrong. Please try again or book on WhatsApp.", false);
      }
    } catch (err) {
      showMsg("Could not reach the booking service. Please try again or book on WhatsApp.", false);
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });

  function showMsg(text, ok) {
    msgBox.hidden = false;
    msgBox.textContent = text;
    msgBox.className = "booking-msg " + (ok ? "ok" : "err");
  }
})();
