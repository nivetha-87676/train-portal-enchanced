'use strict';

// ── Payment Box State & Functions ──
let selectedPayment = "Google Pay";

function selectPayment(element) {
  let options = document.querySelectorAll(".payment-option");
  options.forEach(option => {
    option.classList.remove("active");
  });
  element.classList.add("active");
  selectedPayment = element.innerText;
}

function makePayment() {
  const statusEl = document.getElementById("paymentStatus");
  if (statusEl) {
    statusEl.innerHTML = "Payment Successful using " + selectedPayment;
  }
}

// ── Main App State ──
let currentUser = JSON.parse(localStorage.getItem('ryUser') || 'null');
let trainTrackInterval = null;
let currentBookings = JSON.parse(localStorage.getItem('ryBookings') || '[]');

// ── Train data ──
const TRAINS = [
  { no: '12301', name: 'Howrah Rajdhani Express', from: 'NDLS', to: 'HWH', dep: '16:55', arr: '10:05', duration: '17h 10m', fare: 2450 },
  { no: '12951', name: 'Mumbai Rajdhani Express', from: 'NDLS', to: 'BCT', dep: '17:25', arr: '08:35', duration: '15h 10m', fare: 2300 },
  { no: '12002', name: 'Bhopal Shatabdi Express', from: 'NDLS', to: 'BPL', dep: '06:00', arr: '13:35', duration: '7h 35m', fare: 1100 },
  { no: '22691', name: 'Rajdhani Express South', from: 'NDLS', to: 'SBC', dep: '20:30', arr: '05:45', duration: '33h 15m', fare: 2800 },
  { no: '12050', name: 'Gatimaan Express', from: 'NDLS', to: 'AGC', dep: '08:10', arr: '09:50', duration: '1h 40m', fare: 750 },
  { no: '22439', name: 'Vande Bharat Express', from: 'NDLS', to: 'VSKP', dep: '06:05', arr: '20:05', duration: '14h 00m', fare: 1800 },
];

// ── On load ──
window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  animateStats();
  renderFeaturedTrains();
  renderPopularTrains();
  setDateMin();
  
  const form = document.getElementById('bookingForm');
  if (form) form.addEventListener('submit', handleBooking);
});

// ── Page Navigation ──
const showPage = (name) => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(`page-${name}`);
  if (targetPage) targetPage.classList.add('active');

  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'tracking') {
    renderPopularTrains();
    setTimeout(() => {
      initLeafletMap();
      if (leafletMap) leafletMap.setView([22.5, 80.0], 5);
    }, 80);
  }
  
  const mainNav = document.getElementById('mainNav');
  if (mainNav) mainNav.classList.remove('open');
};

const toggleNav = () => {
  const mainNav = document.getElementById('mainNav');
  if (mainNav) mainNav.classList.toggle('open');
};

// ── Auth ──
const checkAuth = () => {
  if (currentUser) {
    const guestNav = document.getElementById('guestNav');
    const userNav = document.getElementById('userNav');
    const userGreet = document.getElementById('userGreet');
    if (guestNav) guestNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    if (userGreet) userGreet.textContent = `👤 ${currentUser.name.split(' ')[0]}`;
  }
};

const handleSignup = () => {
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const mobile = document.getElementById('su-mobile').value.trim();
  const pass = document.getElementById('su-pass').value;

  let valid = true;
  const setErr = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('show', show);
    if (show) valid = false;
  };
  setErr('se-name', name.length < 2);
  setErr('se-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  setErr('se-mobile', !/^\d{10}$/.test(mobile));
  setErr('se-pass', pass.length < 8);
  if (!valid) return;

  const user = { name, email, mobile };
  localStorage.setItem('ryUser', JSON.stringify(user));
  currentUser = user;
  showToast(`✅ Welcome, ${name}! Account created.`, 'success');
  setTimeout(() => { checkAuth(); showPage('home'); }, 1200);
};

const handleLogin = () => {
  const email = document.getElementById('li-email').value.trim();
  const pass = document.getElementById('li-pass').value;
  let valid = true;
  const setErr = (id, show) => { 
    const el = document.getElementById(id);
    if (el) el.classList.toggle('show', show); 
    if (show) valid = false; 
  };
  setErr('le-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  setErr('le-pass', pass.length < 1);
  if (!valid) return;

  const saved = JSON.parse(localStorage.getItem('ryUser') || 'null');
  if (saved && saved.email === email) {
    currentUser = saved;
    showToast(`✅ Welcome back, ${saved.name.split(' ')[0]}!`, 'success');
  } else {
    const user = { name: email.split('@')[0], email };
    localStorage.setItem('ryUser', JSON.stringify(user));
    currentUser = user;
    showToast(`✅ Logged in as ${user.name}`, 'success');
  }
  setTimeout(() => { checkAuth(); showPage('home'); }, 1200);
};

const logout = () => {
  localStorage.removeItem('ryUser');
  currentUser = null;
  const guestNav = document.getElementById('guestNav');
  const userNav = document.getElementById('userNav');
  if (guestNav) guestNav.style.display = '';
  if (userNav) userNav.style.display = 'none';
  showToast('👋 Logged out successfully', 'info');
};

const socialLogin = (provider) => {
  const user = { name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` };
  localStorage.setItem('ryUser', JSON.stringify(user));
  currentUser = user;
  showToast(`✅ Signed in with ${provider}!`, 'success');
  setTimeout(() => { checkAuth(); showPage('home'); }, 1000);
};

const switchAuth = (tab) => {
  document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', (i===0&&tab==='signup')||(i===1&&tab==='login')));
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  if (signupForm) signupForm.classList.toggle('active', tab === 'signup');
  if (loginForm) loginForm.classList.toggle('active', tab === 'login');
};

const togglePwd = (id, btn) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
};

const checkStrength = (pass) => {
  const fill = document.getElementById('strengthFill');
  if (!fill) return;
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  const colors = ['#ef4444','#f97316','#eab308','#10b981'];
  const widths = ['25%','50%','75%','100%'];
  fill.style.width = pass ? (widths[score-1]||'10%') : '0%';
  fill.style.background = pass ? (colors[score-1]||'#ef4444') : '';
};

// ── Booking ──
const setDateMin = () => {
  const d = document.getElementById('f-date');
  if (d) d.min = new Date().toISOString().split('T')[0];
};

const handleBooking = (e) => {
  e.preventDefault();
  const fields = [
    { id: 'f-name', err: 'e-name', test: v => v.trim().length >= 2 },
    { id: 'f-email', err: 'e-email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'f-mobile', err: 'e-mobile', test: v => /^\d{10}$/.test(v) },
    { id: 'f-date', err: 'e-date', test: v => v !== '' },
    { id: 'f-source', err: 'e-source', test: v => v !== '' },
    { id: 'f-dest', err: 'e-dest', test: v => v !== '' },
    { id: 'f-train', err: 'e-train', test: v => v !== '' },
    { id: 'f-class', err: 'e-class', test: v => v !== '' },
    { id: 'f-pax', err: 'e-pax', test: v => v !== '' },
  ];

  let valid = true;
  fields.forEach(({ id, err, test }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(err);
    if (el && errEl) {
      const ok = test(el.value);
      el.classList.toggle('error-field', !ok);
      errEl.classList.toggle('show', !ok);
      if (!ok) valid = false;
    }
  });

  if (!valid) { showToast('❌ Please fill all required fields correctly', 'error'); return; }

  const sourceVal = document.getElementById('f-source').value;
  const destVal = document.getElementById('f-dest').value;
  if (sourceVal === destVal) {
    showToast('❌ Source and Destination cannot be the same', 'error');
    return;
  }

  const btn = document.getElementById('bookBtn');
  btn.innerHTML = '<span class="spinner"></span> Processing...';
  btn.disabled = true;

  setTimeout(() => {
    const booking = generateBooking();
    currentBookings.push(booking);
    localStorage.setItem('ryBookings', JSON.stringify(currentBookings));
    displayBookingCard(booking);
    btn.innerHTML = '🎫 Book Ticket Now';
    btn.disabled = false;
    showToast(`🎉 Ticket booked! PNR: ${booking.pnr}`, 'success');
  }, 1800);
};

const generateBooking = () => {
  const trainNo = document.getElementById('f-train').value;
  const train = TRAINS.find(t => t.no === trainNo) || TRAINS[0];
  const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const paxCount = parseInt(document.getElementById('f-pax').value) || 1;
  return {
    pnr,
    name: document.getElementById('f-name').value.trim(),
    email: document.getElementById('f-email').value.trim(),
    mobile: document.getElementById('f-mobile').value.trim(),
    date: document.getElementById('f-date').value,
    source: document.getElementById('f-source').value,
    dest: document.getElementById('f-dest').value,
    trainNo,
    trainName: train.name,
    classType: document.getElementById('f-class').value,
    pax: paxCount,
    fare: train.fare * paxCount,
    dep: train.dep,
    arr: train.arr,
    bookedAt: new Date().toISOString(),
  };
};

const displayBookingCard = (b) => {
  const card = document.getElementById('bookingCard');
  if (!card) return;
  const srcCode = b.source.match(/\(([^)]+)\)/)?.[1] || b.source.substring(0,3).toUpperCase();
  const dstCode = b.dest.match(/\(([^)]+)\)/)?.[1] || b.dest.substring(0,3).toUpperCase();
  card.innerHTML = `
    <div class="ticket-header">
      <div>
        <div class="ticket-title">🎫 Booking Confirmed!</div>
        <div class="ticket-pnr">PNR Number</div>
        <div class="pnr-code">${b.pnr}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:.8rem;color:rgba(255,255,255,.6);">Amount Paid</div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--gold);">₹${b.fare.toLocaleString('en-IN')}</div>
      </div>
    </div>
    <div class="ticket-route">
      <div class="station"><div class="station-code">${srcCode}</div><div class="station-name">${b.source}</div><div style="font-size:.85rem;margin-top:.3rem;">${b.dep}</div></div>
      <div class="route-line"><div style="margin-bottom:.3rem;">🚄</div><div class="route-arrow">────────▶</div><div style="font-size:.75rem;margin-top:.3rem;">${b.trainName}</div></div>
      <div class="station" style="text-align:right;"><div class="station-code">${dstCode}</div><div class="station-name">${b.dest}</div><div style="font-size:.85rem;margin-top:.3rem;">${b.arr}</div></div>
    </div>
    <div class="ticket-details">
      <div><div class="ticket-detail-label">Passenger</div><div class="ticket-detail-value">${b.name}</div></div>
      <div><div class="ticket-detail-label">Date</div><div class="ticket-detail-value">${formatDate(b.date)}</div></div>
      <div><div class="ticket-detail-label">Class</div><div class="ticket-detail-value">${b.classType}</div></div>
      <div><div class="ticket-detail-label">Passengers</div><div class="ticket-detail-value">${b.pax} Adult(s)</div></div>
      <div><div class="ticket-detail-label">Train No.</div><div class="ticket-detail-value">${b.trainNo}</div></div>
      <div><div class="ticket-detail-label">Status</div><div class="ticket-detail-value" style="color:var(--gold);">✅ CNF</div></div>
    </div>
    <div style="margin-top:1.2rem;padding:.8rem;background:rgba(0,0,0,.2);border-radius:8px;font-size:.8rem;color:rgba(255,255,255,.7);">
      📧 E-ticket sent to ${b.email} | 📱 SMS sent to ${b.mobile}
    </div>`;
  card.classList.add('show');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ── Live Tracking + Leaflet Map ──
const STATION_COORDS = {
  'New Delhi':        [28.6407, 77.2197],
  'Hazrat Nizamuddin':[28.5666, 77.2529],
  'Mathura':          [27.4924, 77.6737],
  'Agra Cantt':       [27.1592, 78.0513],
  'Agra':             [27.1767, 78.0081],
  'Kanpur Central':   [26.4499, 80.3319],
  'Allahabad':        [25.4358, 81.8463],
  'Gaya':             [24.7955, 85.0002],
  'Dhanbad':          [23.7957, 86.4304],
  'Howrah':           [22.5839, 88.3420],
  'Kota':             [25.1802, 75.8360],
  'Vadodara':         [22.3119, 73.1789],
  'Surat':            [21.2100, 72.8783],
  'Mumbai Central':   [18.9690, 72.8194],
  'Gwalior':          [26.2183, 78.1828],
  'Jhansi':           [25.4484, 78.5685],
  'Bhopal':           [23.2599, 77.4126],
  'Nagpur':           [21.1458, 79.0882],
  'Bengaluru':        [12.9784, 77.5709],
  'Vijayawada':       [16.5193, 80.6305],
  'Visakhapatnam':    [17.6868, 83.2185],
};

const TRAIN_ROUTES = {
  '12301': ['New Delhi','Kanpur Central','Allahabad','Gaya','Dhanbad','Howrah'],
  '12951': ['New Delhi','Kota','Vadodara','Surat','Mumbai Central'],
  '12002': ['New Delhi','Agra Cantt','Gwalior','Jhansi','Bhopal'],
  '22691': ['New Delhi','Agra','Gwalior','Bhopal','Nagpur','Bengaluru'],
  '12050': ['Hazrat Nizamuddin','Mathura','Agra Cantt'],
  '22439': ['New Delhi','Bhopal','Nagpur','Vijayawada','Visakhapatnam'],
};

let leafletMap = null;
let mapMarkers = [];
let mapPolylines = [];
let trainAnimMarker = null;
let animFrameId = null;
let animStep = 0;
let animPath = [];

const initLeafletMap = () => {
  const mapEl = document.getElementById('liveMap');
  if (!mapEl || leafletMap) return;
  leafletMap = L.map('liveMap', { zoomControl: true, scrollWheelZoom: true })
                .setView([22.5, 80.0], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | RailYatra',
    maxZoom: 18,
  }).addTo(leafletMap);

  leafletMap.getContainer().style.fontFamily = "'Rajdhani', sans-serif";
};

const clearMapLayers = () => {
  mapMarkers.forEach(m => m.remove());
  mapPolylines.forEach(p => p.remove());
  mapMarkers = [];
  mapPolylines = [];
  if (trainAnimMarker) { trainAnimMarker.remove(); trainAnimMarker = null; }
  if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
};

const makeIcon = (emoji, size = 36) => L.divIcon({
  html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));">${emoji}</div>`,
  iconSize: [size, size], iconAnchor: [size/2, size/2],
  className: '',
});

const drawTrainOnMap = (train, currentIdx) => {
  initLeafletMap();
  clearMapLayers();

  const stops = TRAIN_ROUTES[train.no] || Object.keys(STATION_COORDS).slice(0,4);
  const coords = stops.map(s => STATION_COORDS[s] || [20 + Math.random()*10, 75 + Math.random()*10]);

  const fullLine = L.polyline(coords, {
    color: '#aab4c0', weight: 3, dashArray: '8,6', opacity: 0.7
  }).addTo(leafletMap);
  mapPolylines.push(fullLine);

  if (currentIdx > 0) {
    const doneLine = L.polyline(coords.slice(0, currentIdx + 1), {
      color: '#8B1E3F', weight: 5, opacity: 0.9,
    }).addTo(leafletMap);
    mapPolylines.push(doneLine);
  }

  stops.forEach((name, i) => {
    const [lat, lng] = coords[i];
    const isPassed  = i < currentIdx;
    const isCurrent = i === currentIdx;
    const emoji = isCurrent ? '🔴' : isPassed ? '🟢' : '⚫';

    const marker = L.marker([lat, lng], { icon: makeIcon(emoji, isCurrent ? 32 : 24) })
      .addTo(leafletMap)
      .bindPopup(`
        <div style="font-family:'Rajdhani',sans-serif;min-width:160px;">
          <strong style="color:#8B1E3F;font-size:1rem;">${name}</strong><br>
          <span style="font-size:.82rem;color:#666;">
            ${isCurrent ? '🚂 Train is currently here' : isPassed ? '✅ Departed' : '⏳ Upcoming stop'}
          </span>
        </div>`, { maxWidth: 200 });
    if (isCurrent) marker.openPopup();
    mapMarkers.push(marker);
  });

  animPath = coords;
  animStep = currentIdx * 100;
  const totalSteps = (coords.length - 1) * 100;

  const trainIcon = makeIcon('🚂', 40);

  const getInterpolated = (step) => {
    const seg = Math.floor(step / 100);
    const t   = (step % 100) / 100;
    if (seg >= coords.length - 1) return coords[coords.length - 1];
    const [lat1, lng1] = coords[seg];
    const [lat2, lng2] = coords[seg + 1];
    return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t];
  };

  const startPos = getInterpolated(animStep);
  trainAnimMarker = L.marker(startPos, { icon: trainIcon, zIndexOffset: 1000 })
    .addTo(leafletMap)
    .bindPopup(`<div style="font-family:'Rajdhani',sans-serif;"><strong style="color:#8B1E3F;">${train.no} — ${train.name}</strong><br><span style="font-size:.82rem;">🚂 Live position</span></div>`);

  let lastTime = null;
  const animate = (ts) => {
    if (!lastTime) lastTime = ts;
    if (ts - lastTime > 80) {
      animStep = (animStep + 1) % totalSteps;
      const pos = getInterpolated(animStep);
      trainAnimMarker.setLatLng(pos);
      lastTime = ts;
    }
    animFrameId = requestAnimationFrame(animate);
  };
  animFrameId = requestAnimationFrame(animate);

  leafletMap.fitBounds(fullLine.getBounds(), { padding: [40, 40] });

  const legendEl = document.getElementById('mapLegend');
  if (legendEl) { legendEl.style.display = 'flex'; }
  const timeEl = document.getElementById('mapUpdateTime');
  if (timeEl) timeEl.textContent = `Last updated: ${new Date().toLocaleTimeString('en-IN')}`;
};

const trackTrain = () => {
  const inputEl = document.getElementById('trackInput');
  if (!inputEl) return;
  const input = inputEl.value.trim();
  if (!input) { showToast('⚠️ Please enter a train number or name', 'error'); return; }

  const train = TRAINS.find(t =>
    t.no === input || t.name.toLowerCase().includes(input.toLowerCase())
  ) || TRAINS[Math.floor(Math.random() * TRAINS.length)];

  const mapStatus = document.getElementById('mapStatus');
  if (mapStatus) {
    mapStatus.innerHTML = `<span style="color:var(--success);">🟢 Tracking <strong>${train.no} — ${train.name}</strong> — map updating live every 30s</span>`;
  }

  showTrackerStatus(train);
};

const showTrackerStatus = (train) => {
  const stops = TRAIN_ROUTES[train.no] || ['New Delhi','Bhopal','Nagpur','Bengaluru'];
  const currentIdx = Math.floor(Math.random() * (stops.length - 1)) + 1;
  const progress = Math.round((currentIdx / (stops.length - 1)) * 100);
  const delayed = Math.random() > 0.6;
  const delayMin = delayed ? Math.floor(Math.random() * 45) + 5 : 0;

  drawTrainOnMap(train, currentIdx);

  const el = document.getElementById('trackerStatus');
  if (el) {
    el.innerHTML = `
      <div class="status-header">
        <div>
          <div class="train-name-big">${train.no} — ${train.name}</div>
          <div style="font-size:.85rem;color:var(--gray);margin-top:.2rem;">${train.from} → ${train.to} | Dep: ${train.dep} | Arr: ${train.arr}</div>
        </div>
        <div>
          <span class="status-badge ${delayed ? 'status-delayed' : 'status-on-time'}">${delayed ? `⚠️ DELAYED ${delayMin} min` : '✅ ON TIME'}</span>
        </div>
      </div>
      <div style="margin-top:1.2rem;">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--gray);margin-bottom:.4rem;">
          <span>${stops[0]}</span><span>${progress}% of route covered</span><span>${stops[stops.length-1]}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progress}%">
            <div class="progress-train">🚂</div>
          </div>
        </div>
      </div>
      <div class="stops-list">
        ${stops.map((s, i) => `
          <div class="stop-item ${i < currentIdx ? 'passed' : ''} ${i === currentIdx ? 'current' : ''}">
            <div class="stop-dot ${i < currentIdx ? 'passed' : ''} ${i === currentIdx ? 'current' : ''}"></div>
            <div class="stop-name">${s}</div>
            <div class="stop-time">${i === currentIdx ? '🟢 Currently Here' : i < currentIdx ? '✅ Departed' : '⏳ Upcoming'}</div>
          </div>`).join('')}
      </div>`;
    el.classList.add('show');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (trainTrackInterval) clearInterval(trainTrackInterval);
  trainTrackInterval = setInterval(() => {
    showTrackerStatus(train);
    const timeEl = document.getElementById('mapUpdateTime');
    if (timeEl) timeEl.textContent = `Last updated: ${new Date().toLocaleTimeString('en-IN')}`;
  }, 30000);
};

const renderPopularTrains = () => {
  const container = document.getElementById('popularTrains');
  if (!container) return;
  container.innerHTML = `
    <h3 style="font-family:'Rajdhani',sans-serif;font-size:1.2rem;font-weight:700;color:var(--maroon);margin-bottom:1rem;">🔥 Popular Trains — Click to Track</h3>
    <div class="card-grid">${TRAINS.map(t => `
      <div class="card" style="cursor:pointer;" onclick="document.getElementById('trackInput').value='${t.no}';trackTrain()">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem;">
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.05rem;color:var(--maroon);">${t.no}</div>
          <span style="background:rgba(16,185,129,.12);color:var(--success);font-size:.75rem;padding:.2rem .6rem;border-radius:4px;font-family:'Rajdhani',sans-serif;font-weight:700;">LIVE</span>
        </div>
        <div style="font-weight:600;font-size:.95rem;margin-bottom:.5rem;">${t.name}</div>
        <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--gray);">
          <span>${t.from} → ${t.to}</span><span>${t.duration}</span>
        </div>
        <div style="margin-top:.5rem;font-size:.82rem;"><span style="color:var(--maroon);font-weight:700;">₹${t.fare.toLocaleString('en-IN')}</span> onwards</div>
      </div>`).join('')}
    </div>`;
};

// ── Featured Trains on Home ──
const renderFeaturedTrains = () => {
  const c = document.getElementById('featuredTrains');
  if (!c) return;
  c.innerHTML = '';
  TRAINS.slice(0,3).forEach(t => {
    const avail = Math.random() > .3;
    c.innerHTML += `
      <div style="background:rgba(255,255,255,.07);border:1.5px solid rgba(251,191,36,.2);border-radius:12px;padding:1.5rem;cursor:pointer;transition:all .3s;"
           onmouseover="this.style.background='rgba(255,255,255,.12)'" onmouseout="this.style.background='rgba(255,255,255,.07)'"
           onclick="showPage('booking')">
        <div style="display:flex;justify-content:space-between;margin-bottom:.5rem;">
          <span style="color:var(--gold);font-family:'Rajdhani',sans-serif;font-weight:700;">${t.no}</span>
          <span style="color:${avail?'var(--success)':'#ef4444'};font-size:.8rem;font-family:'Rajdhani',sans-serif;font-weight:700;">${avail?'AVAILABLE':'WL'}</span>
        </div>
        <div style="font-size:1.05rem;font-weight:600;margin-bottom:.7rem;">${t.name}</div>
        <div style="display:flex;justify-content:space-between;color:rgba(255,255,255,.7);font-size:.85rem;">
          <span>🕐 ${t.dep} → ${t.arr}</span><span>⏱ ${t.duration}</span>
        </div>
        <div style="margin-top:.7rem;padding-top:.7rem;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--gold);font-size:1.1rem;font-weight:900;">₹${t.fare.toLocaleString('en-IN')}</span>
          <span style="background:var(--gold);color:var(--maroon-dark);padding:.3rem .8rem;border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:.85rem;">Book Now</span>
        </div>
      </div>`;
  });
};

// ── PNR Check ──
const checkPNR = () => {
  const inputEl = document.getElementById('pnrInput');
  const result = document.getElementById('pnrResult');
  if (!inputEl || !result) return;
  const pnr = inputEl.value.trim();
  if (!/^\d{10}$/.test(pnr)) { result.innerHTML = `<span style="color:var(--error);font-family:'Rajdhani',sans-serif;font-weight:700;">⚠️ Please enter a valid 10-digit PNR number</span>`; return; }

  result.innerHTML = `<span style="font-family:'Rajdhani',sans-serif;color:var(--gray);" class="loading-dots">Fetching PNR status</span>`;

  const booking = currentBookings.find(b => b.pnr === pnr);
  setTimeout(() => {
    if (booking) {
      result.innerHTML = `<div style="background:rgba(16,185,129,.1);border:1.5px solid var(--success);border-radius:8px;padding:1rem;font-size:.9rem;">
        <strong style="color:var(--success);">✅ PNR Found — CNF</strong><br>
        Train: ${booking.trainNo} — ${booking.trainName}<br>
        Passenger: ${booking.name} | Date: ${formatDate(booking.date)}<br>
        Route: ${booking.source} → ${booking.dest} | Class: ${booking.classType}
      </div>`;
    } else {
      const statuses = ['CNF','RAC 4','WL 12'];
      const st = statuses[Math.floor(Math.random()*statuses.length)];
      const t = TRAINS[Math.floor(Math.random()*TRAINS.length)];
      result.innerHTML = `<div style="background:rgba(59,130,246,.1);border:1.5px solid var(--info);border-radius:8px;padding:1rem;font-size:.9rem;">
        <strong style="color:var(--info);">📋 PNR Status: ${st}</strong><br>
        Train: ${t.no} — ${t.name}<br>
        Route: ${t.from} → ${t.to} | Simulated result
      </div>`;
    }
  }, 1200);
};

// ── API Demos ──
const fetchPublicAPI = async () => {
  const el = document.getElementById('apiFetchResult');
  if (!el) return;
  el.innerHTML = `<span class="loading-dots">Fetching from JSONPlaceholder API</span>`;
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    el.innerHTML = `<strong style="color:var(--success);">✅ 200 OK — Data received:</strong><br><br>
      <strong>Name:</strong> ${data.name}<br>
      <strong>Email:</strong> ${data.email}<br>
      <strong>Company:</strong> ${data.company.name}<br>
      <strong>City:</strong> ${data.address.city}<br>
      <br><em style="color:var(--gray);font-size:.8rem;">Source: jsonplaceholder.typicode.com/users/1</em>`;
  } catch (err) {
    el.innerHTML = `<strong style="color:var(--error);">❌ Error: ${err.message}</strong>`;
  }
};

const fetchWeather = async () => {
  const el = document.getElementById('apiFetchResult');
  if (!el) return;
  el.innerHTML = `<span class="loading-dots">Fetching weather data</span>`;
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current=temperature_2m,windspeed_10m,weathercode&timezone=Asia/Kolkata');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const c = data.current;
    const weatherDesc = getWeatherDesc(c.weathercode);
    el.innerHTML = `<strong style="color:var(--success);">✅ 200 OK — Weather in New Delhi:</strong><br><br>
      🌡️ <strong>Temperature:</strong> ${c.temperature_2m}°C<br>
      💨 <strong>Wind Speed:</strong> ${c.windspeed_10m} km/h<br>
      🌤 <strong>Condition:</strong> ${weatherDesc}<br>
      <br><em style="color:var(--gray);font-size:.8rem;">Live data from Open-Meteo API (no key required)</em>`;
  } catch (err) {
    el.innerHTML = `<strong style="color:var(--error);">❌ Error: ${err.message}</strong>`;
  }
};

const getWeatherDesc = (code) => {
  if (code === 0) return 'Clear sky ☀️';
  if (code <= 3) return 'Partly cloudy ⛅';
  if (code <= 48) return 'Foggy/Cloudy 🌫';
  if (code <= 67) return 'Rainy 🌧';
  if (code <= 77) return 'Snowy 🌨';
  if (code <= 82) return 'Rain showers 🌦';
  return 'Thunderstorm ⛈';
};

const simulateStatus = (code) => {
  const el = document.getElementById('statusResult');
  if (!el) return;
  const msgs = {
    200: { icon: '✅', color: 'var(--success)', title: '200 OK', body: 'Request succeeded. Train data retrieved successfully. JSON response with 127 trains, 4,234 stations, and live status for 89 active trains.' },
    404: { icon: '🔍', color: 'var(--gold-dark)', title: '404 Not Found', body: 'The requested train number "99999" was not found in the database. Please verify the train number and try again.' },
    500: { icon: '❌', color: 'var(--error)', title: '500 Internal Server Error', body: 'The server encountered an unexpected condition. NTES API is temporarily unavailable. Please retry after a few minutes. Reference: ERR_UPSTREAM_TIMEOUT' },
  };
  const m = msgs[code];
  el.innerHTML = `<strong style="color:${m.color};">${m.icon} HTTP ${m.title}</strong><br><br>${m.body}`;
};

// ── Live Clock ──
const updateClock = () => {
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');
  if (!timeEl || !dateEl) return;

  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${h}:${m}:${s}`;

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};
updateClock();
setInterval(updateClock, 1000);

// ── Theme Switcher ──
const THEMES = ['default','ocean','forest','purple','sunset','dark'];

const applyTheme = (theme, el) => {
  document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);
  localStorage.setItem('ryTheme', theme);
  document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
  if (el) el.classList.add('active');
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.remove('open');
};

const toggleThemePanel = (e) => {
  e.stopPropagation();
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.toggle('open');
};

document.addEventListener('click', (e) => {
  const panel = document.getElementById('themePanel');
  if (panel && !panel.contains(e.target) && !e.target.closest('.theme-btn')) {
    panel.classList.remove('open');
  }
});

const savedTheme = localStorage.getItem('ryTheme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme === 'default' ? '' : savedTheme);
  const matchOpt = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
  if (matchOpt) {
    document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
    matchOpt.classList.add('active');
  }
}

// ── Stats animation ──
const animateStats = () => {
  const targets = { 'stat-trains': 13000, 'stat-passengers': 2300000, 'stat-stations': 7349, 'stat-km': 68000 };
  const formats = { 'stat-trains': n => (n/1000).toFixed(0)+'K+', 'stat-passengers': n => (n/100000).toFixed(1)+'L+', 'stat-stations': n => n.toLocaleString('en-IN'), 'stat-km': n => (n/1000).toFixed(0)+'K+' };
  Object.entries(targets).forEach(([id, target]) => {
    let current = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      const el = document.getElementById(id);
      if (el) el.textContent = formats[id](Math.round(current));
      if (current >= target) clearInterval(interval);
    }, 30);
  });
};

// ── Toast ──
const showToast = (msg, type = 'success') => {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
};

// ── Helpers ──
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
