// 1. NAVIGATION
function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const btns = document.querySelectorAll('[id^="mb-"], [id^="sd-"]');
    btns.forEach(btn => { if(btn.id.includes(id)) btn.classList.add('active'); });
    window.scrollTo(0,0);
}

// 2. LANGUAGE & THEME
function toggleLang() {
    const h = document.documentElement;
    const isEng = h.getAttribute('data-lang') === 'en';
    h.setAttribute('data-lang', isEng ? 'tl' : 'en');
    document.getElementById('langBtn').innerText = isEng ? 'English' : 'Tagalog';
    updateHistory(); 
}

function toggleTheme() {
    const h = document.documentElement;
    const isLight = h.getAttribute('data-theme') === 'light';
    h.setAttribute('data-theme', isLight ? 'dark' : 'light');
    document.getElementById('thBtn').innerText = isLight ? '☀️ Mode' : '🌙 Mode';
}

// 3. CHARTS
const cfg = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0.8,0.8,0.8,0.8,0.8,0.8], borderColor: '#0038A8', fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] }, options: cfg });
const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [15,15,15,15,15,15], borderColor: '#00897B', fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] }, options: cfg });
const hw = new Chart(document.getElementById('histWChart').getContext('2d'), { type: 'bar', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [0.65, 0.95, 0.70, 1.10], backgroundColor: '#0038A8', borderRadius: 15 }] }, options: cfg });
const ha = new Chart(document.getElementById('histAChart').getContext('2d'), { type: 'line', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [15, 25, 18, 38], borderColor: '#00897B', tension: 0.3 }] }, options: cfg });

// 4. FIREBASE (THE BRAIN)
const firebaseConfig = { databaseURL: "https://abiso-daranga-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref('sensor_data').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Update Text
    document.getElementById('cur-w').innerText = data.water.toFixed(2);
    document.getElementById('cur-a').innerText = data.air;
    document.getElementById('cur-s').innerText = data.solar;

    // Update Live Charts
    lw.data.datasets[0].data.shift(); lw.data.datasets[0].data.push(data.water); lw.update('none');
    la.data.datasets[0].data.shift(); la.data.datasets[0].data.push(data.air); la.update('none');

    // Solar Bar
    document.getElementById('solarFill').style.width = data.solar + "%";

    // WATER PILL LOGIC
    const wPill = document.getElementById('live-pill-w');
    if (data.water > 1.5) { wPill.style.background = 'var(--danger)'; wPill.innerHTML = `<div class="pulse"></div><span class="lang-en">STATUS: DANGER</span><span class="lang-tl">STATUS: DELIKADO</span>`; }
    else { wPill.style.background = 'var(--safe)'; wPill.innerHTML = `<div class="pulse"></div><span class="lang-en">STATUS: NORMAL</span><span class="lang-tl">STATUS: LIGTAS PA</span>`; }

    // AIR PILL LOGIC
    const aPill = document.getElementById('live-pill-a');
    if (data.air > 100) { aPill.style.background = 'var(--danger)'; aPill.innerHTML = `<span class="lang-en">AIR: UNHEALTHY</span><span class="lang-tl">HANGIN: MASAMA</span>`; }
    else if (data.air > 50) { aPill.style.background = 'var(--warn)'; aPill.innerHTML = `<span class="lang-en">AIR: MODERATE</span><span class="lang-tl">HANGIN: SAKTO LANG</span>`; }
    else { aPill.style.background = 'var(--safe)'; aPill.innerHTML = `<span class="lang-en">AIR: GOOD</span><span class="lang-tl">HANGIN: MABUTI</span>`; }
});

// 5. HISTORY DROPDOWN LOGIC (Full 12 Months)
function updateHistory() {
    const wMonth = document.getElementById('wSelect')?.value || 'jul';
    const aMonth = document.getElementById('aSelect')?.value || 'jul';
    const isTl = document.documentElement.getAttribute('data-lang') === 'tl';
    
    // Simulate data changing based on month
    const randomW = Array.from({length: 4}, () => (0.4 + Math.random()).toFixed(2));
    hw.data.datasets[0].data = randomW;
    hw.update();

    const randomA = Array.from({length: 4}, () => Math.floor(10 + Math.random() * 30));
    ha.data.datasets[0].data = randomA;
    ha.update();

    // Summary Text Update
    const wSum = document.getElementById('w-summary');
    wSum.innerHTML = isTl ? 
        `<span class="lang-tl">Ulat: Ang tubig para sa buwan ng ${wMonth.toUpperCase()} ay nanatiling ligtas.</span>` : 
        `<span class="lang-en">Summary: Water levels for ${wMonth.toUpperCase()} stayed within safe limits.</span>`;

    const aSum = document.getElementById('a-summary');
    aSum.innerHTML = isTl ? 
        `<span class="lang-tl">Ulat: Naging malinis ang hangin sa buwan ng ${aMonth.toUpperCase()}.</span>` : 
        `<span class="lang-en">Summary: Air quality for ${aMonth.toUpperCase()} was generally healthy.</span>`;
}
