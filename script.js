function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('mb-' + id).classList.add('active');
    document.getElementById('sd-' + id).classList.add('active');
    window.scrollTo(0,0);
}

function toggleLang() {
    const h = document.documentElement;
    h.setAttribute('data-lang', h.getAttribute('data-lang') === 'en' ? 'tl' : 'en');
    document.getElementById('langBtn').innerText = h.getAttribute('data-lang') === 'en' ? 'Tagalog' : 'English';
}

function toggleTheme() {
    const h = document.documentElement;
    const current = h.getAttribute('data-theme');
    h.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    document.getElementById('thBtn').innerText = current === 'light' ? '🌙 Mode' : '☀️ Mode';
}

const chartCfg = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
const liveWChart = new Chart(document.getElementById('liveWChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [0.8,0.82,0.85,0.83,0.82,0.82], borderColor: '#0038A8', tension: 0.4, fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] }, options: chartCfg });
const liveAChart = new Chart(document.getElementById('liveAChart').getContext('2d'), { type: 'line', data: { labels: [1,2,3,4,5,6], datasets: [{ data: [15,18,22,19,17,18], borderColor: '#00897B', tension: 0.4, fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] }, options: chartCfg });
new Chart(document.getElementById('histWChart').getContext('2d'), { type: 'bar', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [0.65, 0.95, 0.70, 1.10], backgroundColor: '#0038A8', borderRadius: 15 }] }, options: chartCfg });
new Chart(document.getElementById('histAChart').getContext('2d'), { type: 'line', data: { labels: ['W1','W2','W3','W4'], datasets: [{ data: [15, 25, 18, 38], borderColor: '#00897B', tension: 0.3 }] }, options: chartCfg });

setInterval(() => {
    const w = (0.75 + Math.random() * 0.3).toFixed(2);
    document.getElementById('cur-w').innerText = w;
    const a = Math.floor(12 + Math.random() * 8);
    document.getElementById('cur-a').innerText = a;
    liveWChart.data.datasets[0].data.shift(); liveWChart.data.datasets[0].data.push(w); liveWChart.update('none');
    liveAChart.data.datasets[0].data.shift(); liveAChart.data.datasets[0].data.push(a); liveAChart.update('none');
}, 4000);