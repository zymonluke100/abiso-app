// 1. SUPABASE SETUP
const supabaseUrl = 'https://xhrzurqxzfaktfqawaru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocnp1cnF4emZha3RmcWF3YXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2OTgyMzgsImV4cCI6MjEwMjI3NDIzOH0.WkdbAsleYsGif7k5slLQzmMXplDGlx6FQ89RuzHvYQQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. NAVIGATION (Fixing the Clickable issue)
function nav(id) {
    // Hide all sections
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Deactivate all buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Show chosen section
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    // Highlight buttons (Mobile and Desktop)
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        if(btn.getAttribute('onclick').includes(`'${id}'`)) btn.classList.add('active');
    });
    window.scrollTo(0,0);
}

// 3. SETTINGS TOGGLES
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

// 4. CHARTS CONFIG
const cfg = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#4D8BFF', fill: true, backgroundColor: 'rgba(77,139,255,0.1)', pointRadius: 0 }] }, options: cfg });
const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#00897B', fill: true, backgroundColor: 'rgba(0,137,123,0.1)', pointRadius: 0 }] }, options: cfg });

// 5. SUPABASE REALTIME LISTENER
supabase.channel('public:dike_data')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dike_data' }, (payload) => {
    const data = payload.new;
    if (!data) return;

    // Update Big Numbers
    document.getElementById('cur-w').innerText = data.water.toFixed(2);
    document.getElementById('cur-a').innerText = data.air;
    document.getElementById('cur-s').innerText = data.solar;
    document.getElementById('solarFill').style.width = data.solar + "%";

    // Update Live Graphs
    lw.data.datasets[0].data.shift(); lw.data.datasets[0].data.push(data.water); lw.update('none');
    la.data.datasets[0].data.shift(); la.data.datasets[0].data.push(data.air); la.update('none');

    // Update Status Pills
    const wPill = document.getElementById('live-pill-w');
    if (data.water > 1.5) { wPill.style.background = 'var(--danger)'; wPill.innerText = "STATUS: DELIKADO"; }
    else { wPill.style.background = 'var(--safe)'; wPill.innerText = "STATUS: LIGTAS"; }

    const aPill = document.getElementById('live-pill-a');
    if (data.air > 100) { aPill.style.background = 'var(--danger)'; aPill.innerText = "HANGIN: MASAMA"; }
    else { aPill.style.background = 'var(--safe)'; aPill.innerText = "HANGIN: MABUTI"; }
  })
  .subscribe();
