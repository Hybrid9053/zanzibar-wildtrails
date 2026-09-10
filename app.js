/* ============================================
   THEME TOGGLE
   Reads saved preference, falls back to system
   preference, applies before paint (see inline
   head script too - this handles the button).
   ============================================ */
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('.theme-toggle');
  if (toggleButtons.length === 0) return;

  toggleButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const isDark = document.documentElement.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
}

/* ============================================
   ITINERARY BUILDER
   Sample Zanzibar-only day-by-day itinerary.
   Edit the itineraryDays array to add/change days.
   ============================================ */
const itineraryDays = [
  {
    day: 1,
    title: "Stone Town Arrival",
    location: "Zanzibar Town, West Coast",
    mapQuery: "Stone Town, Zanzibar, Tanzania",
    description: "Land at the airport and get settled in Stone Town. Spend the afternoon walking the old streets and markets, then a welcome dinner.",
    highlights: [
      "Airport pickup and hotel transfer included",
      "Guided walk through Stone Town's old quarter",
      "Sunset at Forodhani Gardens waterfront",
      "Welcome dinner with local Swahili dishes"
    ]
  },
  {
    day: 2,
    title: "Spice Farm & Prison Island",
    location: "Dole Area & Offshore Stone Town",
    mapQuery: "Zanzibar Spice Farm, Zanzibar, Tanzania",
    description: "Morning spice farm visit with tastings of cloves, vanilla, and cinnamon. In the afternoon, a boat trip to Prison Island to see the giant tortoises.",
    highlights: [
      "Guided spice farm walk with tastings",
      "Traditional Swahili lunch included",
      "Boat transfer to Prison Island (Changuu)",
      "Snorkeling gear provided at the island reef"
    ]
  },
  {
    day: 3,
    title: "Jozani Forest & Kuza Cave",
    location: "Central-East Unguja Island",
    mapQuery: "Jozani Chwaka Bay National Park, Zanzibar, Tanzania",
    description: "Walk through Jozani Forest to spot the rare red colobus monkey, then cool off in the freshwater pool at Kuza Cave.",
    highlights: [
      "Guided walk through Jozani National Park",
      "Mangrove boardwalk included",
      "Swim in Kuza Cave's natural pool",
      "Traditional drumming demonstration"
    ]
  },
  {
    day: 4,
    title: "Nungwi Beach & Mnemba Snorkeling",
    location: "Northernmost Tip, North Coast",
    mapQuery: "Nungwi Beach, Zanzibar, Tanzania",
    description: "Head north to Nungwi for a full day at the beach, plus a snorkeling trip to the Mnemba reef, one of the best in the region.",
    highlights: [
      "Boat excursion to Mnemba Atoll",
      "Snorkeling gear and guide included",
      "Fresh seafood beach lunch",
      "Free evening to relax on Nungwi Beach"
    ]
  },
  {
    day: 5,
    title: "Departure Day",
    location: "Zanzibar International Airport",
    mapQuery: "Zanzibar Airport, Zanzibar, Tanzania",
    description: "A relaxed final morning with time for souvenir shopping in Stone Town, then a ride to the airport for your flight home.",
    highlights: [
      "Late check-out where available",
      "Time for souvenir shopping",
      "Private airport transfer included",
      "24/7 support until you fly out"
    ]
  }
];

function renderItineraryDetail(dayIndex) {
  const day = itineraryDays[dayIndex];
  const detailEl = document.getElementById('itineraryDetail');
  const mapEl = document.getElementById('itinerary-map');
  if (!detailEl || !day) return;

  const highlightsHtml = day.highlights.map(function(h) {
    return '<li>' + h + '</li>';
  }).join('');

  detailEl.innerHTML =
    '<h3>Day ' + day.day + ': ' + day.title + '</h3>' +
    '<p class="itinerary-location">📍 ' + day.location + '</p>' +
    '<p class="itinerary-desc">' + day.description + '</p>' +
    '<ul class="itinerary-highlights">' + highlightsHtml + '</ul>' +
    '<div class="itinerary-map-placeholder" id="itinerary-map" data-location="' + day.mapQuery + '">' +
      'Map for ' + day.title + '<br>(Leaflet.js map initializes here)' +
    '</div>';

  // Restart the fade-in animation
  detailEl.style.animation = 'none';
  void detailEl.offsetWidth;
  detailEl.style.animation = null;

  // --- Leaflet.js integration point ---
  // Once Leaflet is loaded, replace the placeholder div above with:
  //   const map = L.map('itinerary-map').setView([lat, lng], 13);
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  //   L.marker([lat, lng]).addTo(map);
  // Use day.mapQuery (or your own lat/lng lookup) to center the map per day.
}

function initItineraryBuilder() {
  const dayButtons = document.querySelectorAll('.day-tab');
  if (dayButtons.length === 0) return;

  dayButtons.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
      dayButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderItineraryDetail(index);
    });
  });

  // Show day 1 by default
  renderItineraryDetail(0);
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initItineraryBuilder();
});
