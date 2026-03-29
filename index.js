const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route Utama
app.get('/', (req, res) => {
    const stocks = [{ nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" }];
    res.render('index', { stocks });
});

// ROUTE PROXY (Suruh Railway yang nembak Google)
app.get('/api/resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios.get(scriptUrl, {
            params: { tgl, bulan },
            timeout: 15000
        });
        res.json(response.data);
    } catch (error) {
        console.error("Gagal ke Google:", error.message);
        res.status(500).json({ error: "Gagal konek ke Google Script" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SARINA DASHBOARD JALAN DI PORT ${PORT}`);
});
