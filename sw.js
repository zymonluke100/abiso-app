// 1. Supabase Config
const supabaseUrl = 'PASTE_YOUR_PROJECT_URL_HERE';
const supabaseKey = 'PASTE_YOUR_ANON_KEY_HERE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Real-time Interaction
const channel = supabase
  .channel('public:dike_data')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dike_data' }, (payload) => {
    const data = payload.new; // This catches the new data from Wokwi
    
    // Update the App UI
    document.getElementById('cur-w').innerText = data.water.toFixed(2);
    document.getElementById('cur-a').innerText = data.air;
    document.getElementById('cur-s').innerText = data.solar;

    // Update Charts
    lw.data.datasets[0].data.shift(); lw.data.datasets[0].data.push(data.water); lw.update('none');
    la.data.datasets[0].data.shift(); la.data.datasets[0].data.push(data.air); la.update('none');
  })
  .subscribe();
