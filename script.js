/* =========================================
   1. NAVIGATION & UI LOGIC
   ========================================= */
function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // Support both mobile and desktop buttons
    const mbBtn = document.getElementById('mb-' + id);
    const sdBtn = document.getElementById('sd-' + id);
    if(mbBtn) mbBtn.classList.add('active');
    if(sdBtn) sdBtn.classList.add('active');
    
    window.scrollTo(0,0);
}

function toggleLang() {
    const h = document.documentElement; 
    const isEng = h.getAttribute('data-lang') === 'en';
    h.setAttribute('data-lang', isEng ? 'tl' : 'en');
    document.getElementById('langBtn').innerText = isEng ? 'English' : 'Tagalog';
}

function toggleTheme() {
    const h = document.documentElement; 
    const isLight = h.getAttribute('data-theme') === 'light';
    h.setAttribute('data-theme', isLight ? 'dark' : 'light');
    document.getElementById('thBtn').innerText = isLight ? '☀️ Mode' : '🌙 Mode';
}

/* =========================================
   2. CHART.JS CONFIGURATION
   ========================================= */
const cfg = { 
    responsive: true, 
    maintainAspectRatio: false, 
    animation: false, 
    plugins: { legend: { display: false } }, 
    scales: { x: { display: false }, y: { display: false } } 
};

// Water Chart
const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { 
    type: 'line', 
    data: { 
        labels: [1,2,3,4,5,6], 
        datasets: [{ data: [0.8,0.8,0.8,0.8,0.8,0.8], borderColor: '#0038A8', tension: 0.4, fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] 
    }, 
    options: cfg 
});

// Air Chart
const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { 
    type: 'line', 
    data: { 
        labels: [1,2,3,4,5,6], 
        datasets: [{ data: [15,15,15,15,15,15], borderColor: '#00897B', tension: 0.4, fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] 
    }, 
    options: cfg 
});

// History Charts (Static Simulation for Thesis)
const hw = new Chart(document.getElementById('histWChart').getContext('2d'), { 
    type: 'bar', 
    data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [0.65, 0.95, 0.70, 1.10], backgroundColor: '#0038A8', borderRadius: 15 }] }, 
    options: cfg 
});

const ha = new Chart(document.getElementById('histAChart').getContext('2d'), { 
    type: 'line', 
    data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [15, 25, 18, 38], borderColor: '#00897B', tension: 0.3 }] }, 
    options: cfg 
});

/* =========================================
   3. FIREBASE INTERACTION (The Bridge)
   ========================================= */

// !!! REPLACE WITH YOUR ACTUAL FIREBASE URL !!!
const firebaseConfig = {
    databaseURL: "https://abiso-darangan-default-rtdb.firebaseio.com" 
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Optimization: Prevent chart lag during scrolling
let isScrolling = false;
let scrollTimeout;
window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 200);
}, { passive: true });

// Listen for data from ESP32/Wokwi
database.ref('sensor_data').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data || isScrolling) return;

    // A. Update Text Values
    if(document.getElementById('cur-w')) document.getElementById('cur-w').innerText = data.water.toFixed(2);
    if(document.getElementById('cur-a')) document.getElementById('cur-a').innerText = data.air;
    if(document.getElementById('cur-s')) document.getElementById('cur-s').innerText = data.solar;

    // B. Update Charts
    lw.data.datasets[0].data.shift();
    lw.data.datasets[0].data.push(data.water);
    lw.update('none');

    la.data.datasets[0].data.shift();
    la.data.datasets[0].data.push(data.air);
    la.update('none');

    // C. Update Solar Fill Bar
    const sFill = document.getElementById('solarFill');
    if(sFill) sFill.style.width = data.solar + "%";

    // D. Update Status Pill (Bilingual)
    const pill = document.getElementById('live-pill');
    if (pill) {
        if (data.water > 1.5) {
            pill.style.background = 'var(--danger)';
            pill.innerHTML = `<span class="lang-en">● LIVE: DANGER</span><span class="lang-tl">● LIVE: DELIKADO</span>`;
        } else if (data.water > 1.1) {
            pill.style.background = 'var(--warn)';
            pill.innerHTML = `<span class="lang-en">● LIVE: WATCH</span><span class="lang-tl">● LIVE: BANTAYAN</span>`;
        } else {
            pill.style.background = 'var(--safe)';
            pill.innerHTML = `<span class="lang-en">● LIVE: NORMAL</span><span class="lang-tl">● LIVE: LIGTAS</span>`;
        }
    }
});

/* =========================================
   4. EXTRA FEATURES (History & Bug Report)
   ========================================= */
function updateHistory(m) {
    // This simulates changing data based on the month selected in dropdown
    const randomData = Array.from({length: 4}, () => (Math.random() * 1.5).toFixed(2));
    hw.data.datasets[0].data = randomData;
    hw.update();
    
    // Update summary text simply
    const summary = document.getElementById('w-summary-box');
    if(summary) {
        summary.innerHTML = `<span class="lang-en">Summary: Data for ${m} is being processed.</span>
                             <span class="lang-tl">Ulat: Pinoproseso ang data para sa buwan ng ${m}.</span>`;
    }
}

// Simple Success feedback for Bug Reports
document.querySelector('.btn-action')?.addEventListener('click', function() {
    alert("Report Sent! / Naipadala na ang report!");
});
