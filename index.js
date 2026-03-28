const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

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

app.get('/', async (req, res) => {
    try {
        const urlS = "https://docs.google.com/spreadsheets/d/1xTVwqw9a3BMrmHEir9wQEidVxIgUhvCP_qj8jHY0u7w/export?format=csv&gid=0";
        const urlR = "https://docs.google.com/spreadsheets/d/16N1Jpc11GUJyKqpyEvueKx0ccroVJfG-s6yP3DxxyX4/export?format=csv&gid=0";
        const urlK = "https://docs.google.com/spreadsheets/d/1oT_uV104wNhTOmJjX_MOzvpkkX0_QAvMYOirsVFbTYo/export?format=csv&gid=0";

        const [resS, resR, resK] = await Promise.all([
            axios.get(urlS), axios.get(urlR), axios.get(urlK)
        ]);

        const linesS = resS.data.split(/\r?\n/);
        const lastUpdate = splitCSV(linesS[0])[7] || "-"; 
        const stocks = linesS.slice(13).map(l => {
            const c = splitCSV(l);
            return { nama: c[0], qty: parseFloat(c[1]) || 0, display: c[3] };
        }).filter(i => i.nama);

        const shippingAll = resR.data.split(/\r?\n/).slice(3).map(l => {
            const c = splitCSV(l);
            return { tgl: c[6], spx: c[7], jne: c[8], jnt: c[9], sd: c[10], tot: c[11] };
        }).filter(i => i.tgl && i.tgl !== "0");

        const linesK = resK.data.split(/\r?\n/);
        let tempDate = ""; 
        const kasAll = linesK.slice(5).map(l => {
            const c = splitCSV(l);
            if (c[0] && c[0].trim() !== "") tempDate = c[0];
            // Bersihkan simbol Rp dari data mentah agar tidak double
            const cleanSaldo = (c[6]||"").replace(/Rp\s?/g, "");
            const cleanDebet = (c[4]||"").replace(/Rp\s?/g, "");
            const cleanKredit = (c[5]||"").replace(/Rp\s?/g, "");
            return { tgl: tempDate, kat: c[1], ket: c[2], bukti: c[3], debet: cleanDebet, kredit: cleanKredit, saldo: cleanSaldo };
        }).filter(t => t.kat && t.kat !== "Kategori");

        const rawSaldo = kasAll.length > 0 ? kasAll[kasAll.length - 1].saldo : "0";
        const saldoTotal = rawSaldo.replace(/Rp\s?/g, "");

        res.render('index', { stocks, shippingAll, kasAll, saldoTotal, lastUpdate });
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => { console.log(`🚀 Port Aktif: ${PORT}`); });
