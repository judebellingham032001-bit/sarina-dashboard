const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Data stok dummy biar web gak kosong
    const stocks = [{ nama: "ALMOND 250G", statusTxt: "TERSEDIA" }];
    res.render('index', { stocks });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => { console.log(`WEB NYALA DI PORT ${PORT}`); });
