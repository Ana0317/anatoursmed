/* ============================================================
   Ana María — Booking configuration (edit this one file)
   ============================================================
   After deploying the Google Apps Script (see BOOKING-SETUP.md),
   paste its Web App URL between the quotes in GAS_URL.
   While GAS_URL is empty, the site runs in DEMO mode (bookings
   are saved only on the current device, for previewing).
*/
window.BOOKING = {
  // Paste your Google Apps Script Web App URL here (keep the quotes):
  GAS_URL: "",

  CAPACITY: 7,          // max people per time slot
  PRICE_USD: 40,
  DURATION: "2 h",

  // Time slots offered each day:
  TIMES: [
    { v: "09:00", label: "9:00 AM" },
    { v: "14:00", label: "2:00 PM" }
  ],

  // Tours (must match the brochure):
  TOURS: [
    { id: "fruit",    name: "Exotic Fruit Tasting" },
    { id: "claustro", name: "Claustro Comfama Visit" },
    { id: "metro",    name: "Metro, Tram & Cable Tour" },
    { id: "downtown", name: "Downtown Medellín Tour" }
  ]
};
