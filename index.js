const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Data Stok (Sesuai logic "habis" & "tipis" kamu)
const stocks = [
  { nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" },
  { nama: "ALMOND 500G", display: "2", statusTxt: "LOW" },
  { nama: "APRICOT 250G", display: "0", statusTxt: "HABIS" }
];

app.get('/', (req, res) => {
    res.render('index', { stocks });
});

// Port otomatis mengikuti Railway (BIAR GAK ERROR SIGTERM)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SARINA DASHBOARD JALAN DI PORT ${PORT}`);
});
