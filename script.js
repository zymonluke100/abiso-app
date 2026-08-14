// 1. SUPABASE CONNECTION
const supabaseUrl = 'https://xhrzurqxzfaktfqawaru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocnp1cnF4emZha3RmcWF3YXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NDIxMDQsImV4cCI6MjAzOTAxODEwNH0.wkdbAsLeYsGiF7k5SlLQzmMXp1DG1x6FQ89RuzhvYQQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. NAVIGATION FUNCTION
function nav(id) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show clicked page
    const target = document.getElementById(id);
    if(target) target.classList.add('active');

    // Update Button styling
    const allBtns = document.querySelectorAll('.nav-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    
    // Highlight the correct buttons (mobile and desktop)
    allBtns.forEach(btn => {
        if(btn.getAttribute('onclick').includes(`'${id}'`)) btn.classList.add('active');
    });
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

// 4. CHART INITIALIZATION
const chartCfg = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#0038A8', fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] }, options: chartCfg });
const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0,0,0,0,0,0], borderColor: '#00897B', fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] }, options: chartCfg });

// 5. SUPABASE REALTIME SYNC
supabase.channel('public:dike_data')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dike_data' }, (payload) => {
    const data = payload.new;
    if (!data) return;

    // Update screen text
    document.getElementById('cur-w').innerText = data.water.toFixed(2);
    document.getElementById('cur-a').innerText = data.air;
    document.getElementById('cur-s').innerText = data.solar;
    document.getElementById('solarFill').style.width = data.solar + "%";

    // Update Live Charts
    lw.data.datasets[0].data.shift(); lw.data.datasets[0].data.push(data.water); lw.update('none');
    la.data.datasets[0].data.shift(); la.data.datasets[0].data.push(data.air); la.update('none');

    // Pill Backgrounds
    const wPill = document.getElementById('live-pill-w');
    if (data.water > 1.5) wPill.style.background = 'var(--danger)';
    else wPill.style.background = 'var(--safe)';
  }).subscribe();
