const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// SETTING FOLDER (ANTI-GAGAL)
app.set('view engine', 'ejs');
// Kode di bawah ini akan mencari folder 'views' di manapun index.js berada
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, '../views'),
    path.join(__dirname, 'api/views')
]);
app.use(express.static(path.join(__dirname, 'public')));

// DATA DUMMY
const stocks = [{ nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" }];
const kasAll = [];
const shippingAll = [];

// ROUTE UTAMA
app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

// ROUTE RESI (LINK GOOGLE KETUA)
app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios({
            method: 'get',
            url: scriptUrl,
            params: { tgl, bulan },
            timeout: 15000,
            maxRedirects: 5
        });
        res.json(response.data);
    } catch (error) {
        console.error("Gagal konek ke Google:", error.message);
        res.status(500).json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server nyala di port ${PORT}`);
});
