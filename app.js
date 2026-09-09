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
    description: "Land at Zanzibar Airport and settle into Stone Town. Spend the afternoon wandering the UNESCO-listed alleys, markets, and historic waterfront before a welcome dinner.",
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
    description: "Morning spice farm tour with tastings of cloves, vanilla, and cinnamon, followed by an afternoon boat trip to Prison Island to meet the giant Aldabra tortoises.",
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
    description: "Track the rare red colobus monkey through Jozani Forest's groundwater woodland, then cool off in the freshwater pool of Kuza Cave near Jambiani.",
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
    description: "Head north to Nungwi for a full day of white sand beach and a snorkeling excursion around the Mnemba Atoll reef, one of the best in the Indian Ocean.",
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
    description: "Enjoy a relaxed final morning, last-minute souvenir shopping in Stone Town, then transfer to the airport for your departure flight.",
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
   RESERVATION & DEPOSIT ENGINE
   Simple base-rate pricing model. Adjust the
   numbers in PRICING to match real rates.
   ============================================ */
const PRICING = {
  basePerPersonPerDay: 45,   // USD, adult base rate
  childDiscount: 0.5,        // children pay 50% of adult rate
  tierMultiplier: {
    budget: 1,
    comfort: 1.6,
    luxury: 2.4
  },
  depositRate: 0.20          // 20% secure commitment deposit
};

function calculateNights(arrivalStr, departureStr) {
  if (!arrivalStr || !departureStr) return 0;
  const arrival = new Date(arrivalStr);
  const departure = new Date(departureStr);
  const diffMs = departure - arrival;
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

function updatePriceSummary() {
  const arrival = document.getElementById('arrivalDate');
  const departure = document.getElementById('departureDate');
  const adults = document.getElementById('adultsCount');
  const children = document.getElementById('childrenCount');
  const tier = document.getElementById('packageTier');

  if (!arrival || !departure || !adults || !tier) return;

  const nights = calculateNights(arrival.value, departure.value);
  const adultCount = parseInt(adults.value, 10) || 0;
  const childCount = parseInt(children.value, 10) || 0;
  const tierRate = PRICING.tierMultiplier[tier.value] || 1;

  const adultCost = adultCount * PRICING.basePerPersonPerDay * tierRate * nights;
  const childCost = childCount * PRICING.basePerPersonPerDay * PRICING.childDiscount * tierRate * nights;
  const subtotal = adultCost + childCost;
  const deposit = subtotal * PRICING.depositRate;

  document.getElementById('summaryNights').textContent = nights;
  document.getElementById('summaryTravelers').textContent = adultCount + childCount;
  document.getElementById('summaryTotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('summaryDeposit').textContent = '$' + deposit.toFixed(2);
}

async function simulateCheckout(event) {
  event.preventDefault();
  const statusEl = document.getElementById('checkoutStatus');
  if (!statusEl) return;

  statusEl.textContent = 'Connecting to secure payment gateway...';
  statusEl.className = 'checkout-status processing';

  // --- Payment gateway integration point ---
  // Replace this placeholder with a real call to your payment
  // provider (Stripe, Zoho Checkout, or a mobile money / Lipa Namba
  // integration). This simulates a network request only.
  await new Promise(function(resolve) { setTimeout(resolve, 1800); });

  statusEl.textContent = '✓ Deposit request received - our team will confirm your booking by WhatsApp shortly.';
  statusEl.className = 'checkout-status success';
}

function initReservationWidget() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(function(input) {
    input.addEventListener('input', updatePriceSummary);
    input.addEventListener('change', updatePriceSummary);
  });

  form.addEventListener('submit', simulateCheckout);
  updatePriceSummary();
}

/* ============================================
   AMBIENT SOUNDSCAPE
   Stays muted until the user clicks play,
   in line with browser autoplay policies.
   ============================================ */
function initSoundscape() {
  const btn = document.getElementById('soundToggle');
  const audio = document.getElementById('ambientAudio');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', function() {
    if (!playing) {
      audio.muted = false;
      audio.play().catch(function() {
        // Autoplay blocked or file missing - fail silently
      });
      btn.querySelector('.icon-play').style.display = 'none';
      btn.querySelector('.icon-pause').style.display = 'block';
      playing = true;
    } else {
      audio.pause();
      btn.querySelector('.icon-play').style.display = 'block';
      btn.querySelector('.icon-pause').style.display = 'none';
      playing = false;
    }
  });
}

/* ============================================
   VIDEO STORY GRID
   Hover/focus plays the loop unmuted,
   leaving pauses it instantly.
   ============================================ */
function initVideoStoryGrid() {
  const cards = document.querySelectorAll('.video-story-card video');

  cards.forEach(function(video) {
    const card = video.closest('.video-story-card');

    function play() {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(function() {
        // Some browsers still block unmuted autoplay - retry muted
        video.muted = true;
        video.play().catch(function() {});
      });
    }

    function stop() {
      video.pause();
      video.currentTime = 0;
    }

    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', play);
    card.addEventListener('blur', stop);
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initItineraryBuilder();
  initReservationWidget();
  initSoundscape();
  initVideoStoryGrid();
});
