// API Connect Form
const apiForm = document.getElementById('apiForm');
const mainForm = document.getElementById('mainForm');
const connectBtn = document.getElementById('connectBtn');
const apiInput = document.getElementById('apiKey');

// Default state
let isConnected = false;
let currentApiUrl = '';

// Saat halaman load: disable form utama
window.addEventListener('DOMContentLoaded', () => {
    toggleMainForm(false);
});

// Fungsi bantu untuk enable/disable form utama
function toggleMainForm(state) {
    mainForm.querySelectorAll('input, textarea, button').forEach(el => {
        el.disabled = !state;
    });
}

// Fungsi bantu untuk enable/disable form koneksi
function toggleApiForm(state) {
    apiForm.querySelectorAll('input, button').forEach(el => {
        el.disabled = !state;
    });
}

// Tombol Connect / Disconnect
apiForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isConnected) {
        // ==== MODE DISCONNECT ====
        isConnected = false;
        currentApiUrl = '';
        apiInput.disabled = false;
        connectBtn.textContent = 'Connect';

        // 🟠 Ganti warna tombol jadi biru (connect mode)
        connectBtn.classList.remove('disconnected');
        connectBtn.classList.add('connected');

        toggleMainForm(false);
        alert('🔴 Terputus dari API');
        return;
    }

    // ==== MODE CONNECT ====
    const apiUrl = apiInput.value.trim();
    if (!apiUrl) return alert('Masukkan URL API terlebih dahulu');

    connectBtn.textContent = 'Menguji koneksi...';
    toggleApiForm(false);

    try {
        const res = await fetch(`${apiUrl}?action=ping`);
        const data = await res.json();

        if (data.status === 'connected') {
            alert('✅ Koneksi berhasil!');
            isConnected = true;
            currentApiUrl = apiUrl;
            connectBtn.textContent = 'Disconnect';
            apiInput.disabled = true;
            toggleMainForm(true);

            // 🟢 Ganti warna tombol jadi merah (disconnect mode)
            connectBtn.classList.remove('connected');
            connectBtn.classList.add('disconnected');
        } else {
            throw new Error(data.message || 'Tidak bisa terhubung');
        }
    } catch (err) {
        alert('❌ Gagal koneksi: ' + err.message);
        connectBtn.textContent = 'Connect';
    } finally {
        toggleApiForm(true);
        if (isConnected) apiInput.disabled = true;
    }
});

// === HANDLE SUBMIT FORM RESUME ===
mainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isConnected) return alert('Harap koneksikan API terlebih dahulu.');

    const formData = {
        fullName: document.getElementById('fullName').value,
        profession: document.getElementById('profession').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        portfolio: document.getElementById('portfolio').value,
        linkedin: document.getElementById('linkedin').value,
        address: document.getElementById('address').value,
        summary: document.getElementById('summary').value,
        keySkills: document.getElementById('keySkills').innerHTML,
        education: document.getElementById('education').innerHTML,
        certificates: document.getElementById('certificates').innerHTML,
    };

    // Kirim ke Apps Script
    try {
        const res = await fetch(`${currentApiUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (data.success) {
            alert('✅ Resume berhasil dibuat!');
            
            // Tambahkan tombol preview
            let preview = document.getElementById('previewLink');
            if (!preview) {
                preview = document.createElement('div');
                preview.id = 'previewLink';
                preview.style.marginTop = '20px';
                preview.innerHTML = `
                    <a href="${data.pdfUrl}" target="_blank" 
                       style="display:inline-block;padding:12px 20px;background:#3b82f6;color:white;border-radius:8px;text-decoration:none;">
                        🔗 Lihat Preview Resume (PDF)
                    </a>`;
                mainForm.appendChild(preview);
            } else {
                preview.querySelector('a').href = data.pdfUrl;
            }
        } else {
            alert('❌ Gagal membuat resume: ' + data.message);
        }
    } catch (err) {
        alert('⚠️ Terjadi kesalahan: ' + err.message);
    }
});
