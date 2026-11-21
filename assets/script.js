// Skrip Utama & Pendukung Frontend IKM PERUMDA Air Minum Tirta Lestari Kabupaten Tuban

document.addEventListener('DOMContentLoaded', () => {
    // Set default tanggal survei ke hari ini jika belum terisi
    const tanggalInput = document.getElementById('tanggal_survei');
    if (tanggalInput && !tanggalInput.value) {
        const today = new Date().toISOString().split('T')[0];
        tanggalInput.value = today;
    }
});

// Toggle input teks jika memilih pekerjaan Lainnya
function togglePekerjaanLain(val) {
    const wrapper = document.getElementById('wrapper_pekerjaan_lainnya');
    const inputLain = document.getElementById('pekerjaan_lainnya');
    if (!wrapper || !inputLain) return;

    if (val === 'Lainnya') {
        wrapper.classList.remove('hidden');
        inputLain.setAttribute('required', 'true');
    } else {
        wrapper.classList.add('hidden');
        inputLain.removeAttribute('required');
        inputLain.value = '';
    }
}

// Handler pengiriman form survei untuk versi HTML (LocalStorage)
function handleFormSubmit(event) {
    event.preventDefault();

    const kantorCabangEl = document.getElementById('kantor_cabang');
    const jenisKelaminEl = document.querySelector('input[name="jenis_kelamin"]:checked');
    const jenisLayananEl = document.querySelector('input[name="jenis_layanan"]:checked');

    if (!kantorCabangEl || !kantorCabangEl.value) {
        alert('Mohon pilih Kantor Cabang PDAM.');
        return;
    }

    if (!jenisKelaminEl || !jenisLayananEl) {
        alert('Mohon lengkapi pilihan Jenis Kelamin dan Jenis Layanan.');
        return;
    }

    // Pastikan 9 unsur terisi
    for (let i = 1; i <= 9; i++) {
        const uEl = document.querySelector(`input[name="u${i}"]:checked`);
        if (!uEl) {
            alert(`Mohon lengkapi penilaian pada Unsur ${i}.`);
            return;
        }
    }

    const formData = {
        tanggal_survei: document.getElementById('tanggal_survei').value,
        kantor_cabang: kantorCabangEl.value,
        jenis_kelamin: jenisKelaminEl.value,
        usia: parseInt(document.getElementById('usia').value, 10),
        pendidikan: document.getElementById('pendidikan').value,
        pekerjaan: document.getElementById('pekerjaan').value,
        pekerjaan_lainnya: document.getElementById('pekerjaan_lainnya') ? document.getElementById('pekerjaan_lainnya').value : '',
        jenis_layanan: jenisLayananEl.value,
        u1: parseInt(document.querySelector('input[name="u1"]:checked').value, 10),
        u2: parseInt(document.querySelector('input[name="u2"]:checked').value, 10),
        u3: parseInt(document.querySelector('input[name="u3"]:checked').value, 10),
        u4: parseInt(document.querySelector('input[name="u4"]:checked').value, 10),
        u5: parseInt(document.querySelector('input[name="u5"]:checked').value, 10),
        u6: parseInt(document.querySelector('input[name="u6"]:checked').value, 10),
        u7: parseInt(document.querySelector('input[name="u7"]:checked').value, 10),
        u8: parseInt(document.querySelector('input[name="u8"]:checked').value, 10),
        u9: parseInt(document.querySelector('input[name="u9"]:checked').value, 10),
        saran: document.getElementById('saran') ? document.getElementById('saran').value.trim() : '',
        created_at: new Date().toISOString()
    };

    // Simpan ke LocalStorage untuk versi HTML
    let existingData = JSON.parse(localStorage.getItem('pdam_ikm_respondents')) || [];
    existingData.unshift(formData);
    localStorage.setItem('pdam_ikm_respondents', JSON.stringify(existingData));

    // Arahkan ke halaman terima kasih
    window.location.href = 'terima-kasih.html';
}
