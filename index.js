const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// Karena index.js ada di luar, kita arahkan langsung ke folder views
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA DUMMY (Sesuaikan dengan data asli kamu) ---
const stocks = [
  { nama: "Almond 250g", display: "15", statusTxt: "TERSEDIA" },
  { nama: "Almond 500g", display: "2", statusTxt: "LOW" }
];
const kasAll = [];
const shippingAll = [];

app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

// ROUTE RESI (Link Gacor Kamu)
app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios.get(scriptUrl, { params: { tgl, bulan } });
        res.json(response.data);
    } catch (error) {
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server nyala di port ${PORT}`);
});
