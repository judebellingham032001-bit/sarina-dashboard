const express = require('express');
const axios = require('axios');
const session = require('express-session');
const app = express();

// --- KONFIGURASI ---
const PASSWORD_WEB = "sarina123"; 
// -------------------

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'sarina-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Helper pecah CSV
function splitCSV(line) {
    const result = [];
    let cur = '';
    let inQuote = false;
    if (!line) return [];
    for (let char of line) {
        if (char === '"') inQuote = !inQuote;
        else if (char === ',' && !inQuote) { result.push(cur.trim()); cur = ''; }
        else cur += char;
    }
    result.push(cur.trim());
    return result;
}

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.send(`
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f8f9fa;font-family:sans-serif">
            <form action="/login" method="POST" style="background:white;padding:40px;border-radius:20px;box-shadow:0 10px 25px rgba(0,0,0,0.05);width:300px;text-align:center">
                <h2 style="color:#007bff;margin-bottom:20px">Sarina Store</h2>
                <input type="password" name="pass" placeholder="Password" required style="width:100%;padding:12px;margin-bottom:20px;border:1px solid #ddd;border-radius:10px;outline:none">
                <button type="submit" style="width:100%;padding:12px;background:#007bff;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:bold">MASUK</button>
            </form>
        </body>
    `);
});

app.post('/login', (req, res) => {
    if (req.body.pass === PASSWORD_WEB) {
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        res.send("<script>alert('Password Salah!'); window.location='/login';</script>");
    }
});

// DASHBOARD
app.get('/', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/login');

    try {
        const urlS = "https://docs.google.com/spreadsheets/d/1xTVwqw9a3BMrmHEir9wQEidVxIgUhvCP_qj8jHY0u7w/export?format=csv&gid=0";
        const urlR = "https://docs.google.com/spreadsheets/d/16N1Jpc11GUJyKqpyEvueKx0ccroVJfG-s6yP3DxxyX4/export?format=csv&gid=0";
        const urlK = "https://docs.google.com/spreadsheets/d/1oT_uV104wNhTOmJjX_MOzvpkkX0_QAvMYOirsVFbTYo/export?format=csv&gid=0";

        const [resS, resR, resK] = await Promise.all([
            axios.get(urlS), axios.get(urlR), axios.get(urlK)
        ]);

        // 1. STOCKS
        const linesS = resS.data.split(/\r?\n/);
        const lastUpdate = splitCSV(linesS[0])[7] || "-"; 
        const stocks = linesS.slice(13).map(l => {
            const c = splitCSV(l);
            return { nama: c[0], qty: parseFloat(c[1]) || 0, ds: c[3] };
        }).filter(i => i.nama);

        // 2. SHIPPING (Reverse agar tgl terbaru di atas)
        const shippingAll = resR.data.split(/\r?\n/).slice(3).map(l => {
            const c = splitCSV(l);
            return { tgl: c[6], spx: c[7], jne: c[8], jnt: c[9], sd: c[10], tot: c[11] };
        }).filter(i => i.tgl && i.tgl !== "0").reverse();

        // 3. KAS (Reverse agar mutasi terbaru di atas)
        const linesK = resK.data.split(/\r?\n/);
        let tempDate = ""; 
        const kasAll = linesK.slice(5).map(l => {
            const c = splitCSV(l);
            if (c[0] && c[0].trim() !== "") tempDate = c[0];
            return { tgl: tempDate, kat: c[1], ket: c[2], bukti: c[3], debet: c[4], kredit: c[5], saldo: c[6] };
        }).filter(t => t.kat && t.kat !== "Kategori").reverse();

        const saldoTotal = kasAll[0] ? kasAll[0].saldo : "0"; // Saldo paling baru (setelah di-reverse)

        res.render('index', { stocks, shippingAll, kasAll, saldoTotal, lastUpdate });
    } catch (e) {
        res.status(500).send("Error koneksi Google Sheets: " + e.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dashboard Ready on port ${PORT}`);
});
