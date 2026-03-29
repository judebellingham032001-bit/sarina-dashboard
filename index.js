const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// DATA DUMMY
const stocks = [
  { nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" },
  { nama: "ALMOND 500G", display: "2", statusTxt: "LOW" },
  { nama: "APRICOT 250G", display: "0", statusTxt: "OUT OF STOCK" }
];
const kasAll = [];
const shippingAll = [];

app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    try {
        const response = await axios.get(scriptUrl, { params: { tgl, bulan }, timeout: 15000 });
        res.json(response.data);
    } catch (error) {
        res.status(500).json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`🚀 Running on port ${PORT}`); });
