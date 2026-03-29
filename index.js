const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Dummy Data
const stocks = [{ nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" }];
const kasAll = [];
const shippingAll = [];

app.get('/', (req, res) => {
    res.render('index', { stocks, kasAll, shippingAll });
});

// ROUTE RESI - VERSI BADAK
app.get('/get-resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios({
            method: 'get',
            url: scriptUrl,
            params: { tgl, bulan },
            maxRedirects: 5, // WAJIB ada buat Google Script
            timeout: 15000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("LOG ERROR:", error.message);
        res.status(500).json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SARINA DASHBOARD GACOR DI PORT ${PORT}`);
});
