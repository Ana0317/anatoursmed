/* ==========================================================================
   Ana María — Bookings backend (Google Apps Script)
   --------------------------------------------------------------------------
   SETUP (see BOOKING-SETUP.md for screenshots-style steps):
   1) Create a new Google Sheet (sheets.new).
   2) Extensions → Apps Script. Delete any code, paste ALL of this.
   3) Change ADMIN_PASSCODE below to a private password for Ana.
   4) Deploy → New deployment → type "Web app".
        - Execute as: Me
        - Who has access: Anyone
      Click Deploy, authorize, and COPY the Web app URL.
   5) Paste that URL into booking-config.js  ->  GAS_URL: "https://script.google.com/.../exec"
   ========================================================================== */

const SHEET_NAME = 'Bookings';
const CAPACITY = 7;                       // must match booking-config.js CAPACITY
const ADMIN_PASSCODE = 'CAMBIA_ESTA_CLAVE'; // <-- CHANGE THIS to Ana's private password

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Timestamp', 'Tour', 'Date', 'Time', 'People', 'Name', 'Email', 'Phone', 'Allergies', 'Notes']);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function rows_() {
  const sh = sheet_();
  const data = sh.getDataRange().getValues();
  data.shift(); // remove header
  return data.map(function (r) {
    return {
      timestamp: r[0], tour: r[1], date: String(r[2]), time: String(r[3]),
      people: Number(r[4]) || 0, name: r[5], email: r[6], phone: r[7],
      allergies: r[8], notes: r[9]
    };
  });
}

function doGet(e) {
  const p = (e && e.parameter) || {};

  // ---- Admin: full data, only with the correct passcode ----
  if (p.action === 'admin') {
    if (p.key !== ADMIN_PASSCODE) return json_({ ok: false, error: 'bad_key' });
    return json_({ ok: true, capacity: CAPACITY, bookings: rows_() });
  }

  const all = rows_();

  // ---- Availability for one slot (public: no personal data) ----
  if (p.date && p.time) {
    const inSlot = all.filter(function (b) { return b.date === p.date && b.time === p.time; });
    const taken = inSlot.reduce(function (s, b) { return s + b.people; }, 0);
    const tours = {};
    inSlot.forEach(function (b) { tours[b.tour] = (tours[b.tour] || 0) + b.people; });
    return json_({ ok: true, capacity: CAPACITY, taken: taken, remaining: Math.max(0, CAPACITY - taken), tours: tours });
  }

  // ---- Public summary of every slot (counts only) ----
  const slots = {};
  all.forEach(function (b) {
    const k = b.date + '|' + b.time;
    if (!slots[k]) slots[k] = { date: b.date, time: b.time, taken: 0, tours: {} };
    slots[k].taken += b.people;
    slots[k].tours[b.tour] = (slots[k].tours[b.tour] || 0) + b.people;
  });
  return json_({ ok: true, capacity: CAPACITY, slots: Object.keys(slots).map(function (k) { return slots[k]; }) });
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    const date = String(b.date || ''), time = String(b.time || ''), people = Number(b.people) || 0;
    if (!date || !time || people < 1 || !b.name) return json_({ ok: false, error: 'missing' });

    // Server-side capacity check
    const inSlot = rows_().filter(function (x) { return x.date === date && x.time === time; });
    const taken = inSlot.reduce(function (s, x) { return s + x.people; }, 0);
    if (taken + people > CAPACITY) {
      return json_({ ok: false, error: 'full', remaining: Math.max(0, CAPACITY - taken) });
    }

    sheet_().appendRow([
      new Date(), b.tour || '', date, time, people,
      b.name || '', b.email || '', b.phone || '', b.allergies || '', b.notes || ''
    ]);
    return json_({ ok: true, remaining: Math.max(0, CAPACITY - (taken + people)) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
