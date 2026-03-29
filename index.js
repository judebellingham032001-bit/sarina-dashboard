const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// Mengunci folder views agar Railway gak bingung
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// DATA DUMMY - Bisa diupdate sesuai kebutuhan
const stocks = [
  { nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" },
  { nama: "ALMOND 500G", display: "2", statusTxt: "LOW" },
  { nama: "APRICOT 250G", display: "0", statusTxt: "OUT OF STOCK" }
];
const kasAll = [
  { tgl: "29/03", kat: "PENJUALAN", ket: "Order Marketplace", mutasi: "Rp 150.000", saldo: "Rp 1.250.000", tipeMutasi: "kredit", bukti: "#" }
];
const shippingAll = [
  { tgl: "29/03", spx: 5, jne: 2, jnt: 3, tot: 10 }
];

// HALAMAN UTAMA
app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

// FITUR CARI RESI - KONEKSI KE GOOGLE DRIVE
app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    // Link Google Apps Script Ketua
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios({
            method: 'get',
            url: scriptUrl,
            params: { tgl, bulan },
            maxRedirects: 5, // Biar gak 'Koneksi Gagal' pas diredirect Google
            timeout: 20000
        });
        res.json(response.data);
    } catch (error) {
        console.error("LOG ERROR RAILWAY:", error.message);
        res.status(500).json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SARINA DASHBOARD JALAN DI PORT ${PORT}`);
});
