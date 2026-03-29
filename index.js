const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// DATA DUMMY (Ganti dengan logika penarikan Sheets kamu yang sudah ada)
const stocks = [
  { nama: "Almond 250g", display: "15", statusTxt: "TERSEDIA" },
  { nama: "Almond 500g", display: "2", statusTxt: "LOW" },
  { nama: "Apricot 250g", display: "0", statusTxt: "OUT OF STOCK" }
];

const kasAll = [
  { tgl: "29/03", kat: "PENJUALAN", ket: "Almond 500g x2", mutasi: "Rp 150.000", saldo: "Rp 1.250.000", tipeMutasi: "kredit", bukti: "https://google.com" }
];

const shippingAll = [
  { tgl: "28/03", spx: 10, jne: 5, jnt: 8, tot: 23 }
];

// --- ROUTE UTAMA ---
app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

// --- ROUTE KHUSUS RESI (LINK GACOR KETUA) ---
app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios.get(`${scriptUrl}?tgl=${tgl}&bulan=${bulan}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error Tarik Resi:", error);
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
