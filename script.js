// 1. SUPABASE CONNECTION
const supabaseUrl = 'https://xhrzurqxzfaktfqawaru.supabase.co';
// NOTICE: Key is inside single quotes '' to prevent errors
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocnp1cnF4emZha3RmcWF3YXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NDIxMDQsImV4cCI6MjAzOTAxODEwNH0.wkdbAsLeYsGiF7k5SlLQzmMXp1DG1x6FQ89RuzhvYQQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. NAVIGATION (Clicking Tabs)
function nav(id) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Deactivate all buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected page
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    // Set both desktop and mobile buttons to active
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        if(btn.getAttribute('onclick').includes(`'${id}'`)) btn.classList.add('active');
    });
    window.scrollTo(0,0);
}

// 3. UI TOGGLES
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

// 4. CHARTS
const cfg = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#0038A8', fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] }, options: cfg });
const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#00897B', fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] }, options: cfg });
const hw = new Chart(document.getElementById('histWChart').getContext('2d'), { type: 'bar', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [0.65, 0.95, 0.7, 1.1], backgroundColor: '#0038A8', borderRadius: 10 }] }, options: cfg });
const ha = new Chart(document.getElementById('histAChart').getContext('2d'), { type: 'line', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [15, 25, 18, 38], borderColor: '#00897B', tension: 0.3 }] }, options: cfg });

// 5. SUPABASE REALTIME LISTENER
supabase.channel('public:dike_data')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dike_data' }, (payload) => {
    const data = payload.new;
    if (!data) return;

    // Update Live Numbers
    document.getElementById('cur-w').innerText = data.water.toFixed(2);
    document.getElementById('cur-a').innerText = data.air;
    document.getElementById('cur-s').innerText = data.solar;
    document.getElementById('solarFill').style.width = data.solar + "%";

    // Update Charts
    lw.data.datasets[0].data.shift(); lw.data.datasets[0].data.push(data.water); lw.update('none');
    la.data.datasets[0].data.shift(); la.data.datasets[0].data.push(data.air); la.update('none');

    // Pill Logic
    const wPill = document.getElementById('live-pill-w');
    if (data.water > 1.5) { wPill.style.background = 'var(--danger)'; wPill.innerText = "STATUS: DELIKADO"; }
    else { wPill.style.background = 'var(--safe)'; wPill.innerText = "STATUS: LIGTAS"; }
  }).subscribe();
