const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// DATA STOK (Sesuai logika kamu)
const stocks = [
  { nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" },
  { nama: "ALMOND 500G", display: "2", statusTxt: "LOW" },
  { nama: "APRICOT 250G", display: "0", statusTxt: "HABIS" }
];

// ROUTE UTAMA
app.get('/', (req, res) => {
    res.render('index', { stocks });
});

// ROUTE PROXY RESI (Jalur belakang biar gak kena blokir CORS)
app.get('/api/resi', async (req, res) => {
    const { tgl, bulan } = req.query;
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzreEqA8cBXoH2wuDpipchslc7pX5hWn0Kk-JOedaBVe3MEZo85VAXJgXwQhSwhJGJwKg/exec";
    
    try {
        const response = await axios.get(scriptUrl, {
            params: { tgl, bulan },
            timeout: 20000,
            maxRedirects: 5
        });
        res.json(response.data);
    } catch (error) {
        console.error("Gagal konek ke Google:", error.message);
        res.status(500).json({ error: "Gagal ambil data dari Google" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SERVER SARINA NYALA DI PORT ${PORT}`);
});
