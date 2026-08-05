function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('mb-' + id).classList.add('active');
    const sd = document.getElementById('sd-' + id); 
    if(sd) sd.classList.add('active');
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
    document.getElementById('thBtn').innerText = isLight ? '🌙 Mode' : '☀️ Mode';
}

// Chart.js Setup
const cfg = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { legend: { display: false } }, 
    scales: { x: { display: false }, y: { display: false } } 
};

const lw = new Chart(document.getElementById('liveWChart').getContext('2d'), { 
    type: 'line', 
    data: { 
        labels: [1,2,3,4,5,6], 
        datasets: [{ data: [0.8,0.82,0.85,0.83,0.82,0.82], borderColor: '#0038A8', tension: 0.4, fill: true, backgroundColor: 'rgba(0,56,168,0.05)', pointRadius: 0 }] 
    }, 
    options: cfg 
});

const la = new Chart(document.getElementById('liveAChart').getContext('2d'), { 
    type: 'line', 
    data: { 
        labels: [1,2,3,4,5,6], 
        datasets: [{ data: [15,18,22,19,17,18], borderColor: '#00897B', tension: 0.4, fill: true, backgroundColor: 'rgba(0,137,123,0.05)', pointRadius: 0 }] 
    }, 
    options: cfg 
});

const hw = new Chart(document.getElementById('histWChart').getContext('2d'), { 
    type: 'bar', 
    data: { 
        labels: ['W1','W2','W3','W4'], 
        datasets: [{ data: [0.65, 0.95, 0.70, 1.10], backgroundColor: '#0038A8', borderRadius: 15 }] 
    }, 
    options: cfg 
});

const ha = new Chart(document.getElementById('histAChart').getContext('2d'), { 
    type: 'line', 
    data: { 
        labels: ['W1','W2','W3','W4'], 
        datasets: [{ data: [15, 25, 18, 38], borderColor: '#00897B', tension: 0.3 }] 
    }, 
    options: cfg 
});

function updateHistory(m) {
    if(m === 'jan') { 
        hw.data.datasets[0].data = [0.4, 0.5, 0.3, 0.6];
        ha.data.datasets[0].data = [10, 12, 11, 14];
        document.getElementById('avg-w').innerText = "0.45m";
        document.getElementById('avg-a').innerText = "12";
    } else {
        hw.data.datasets[0].data = [0.65, 0.95, 0.70, 1.10];
        ha.data.datasets[0].data = [15, 25, 18, 38];
        document.getElementById('avg-w').innerText = "0.74m";
        document.getElementById('avg-a').innerText = "22";
    }
    hw.update(); 
    ha.update();
}

// Live Simulated Sensor Polling
setInterval(() => {
    const w = (0.75 + Math.random() * 0.3).toFixed(2); 
    const a = Math.floor(12 + Math.random() * 8);
    document.getElementById('cur-w').innerText = w; 
    document.getElementById('cur-a').innerText = a;
    lw.data.datasets[0].data.shift(); 
    lw.data.datasets[0].data.push(w); 
    lw.update('none');
    la.data.datasets[0].data.shift(); 
    la.data.datasets[0].data.push(a); 
    la.update('none');
}, 4000);
