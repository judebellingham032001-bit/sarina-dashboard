const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Data Dummy Stok
const stocks = [{ nama: "ALMOND 250G", display: "15", statusTxt: "TERSEDIA" }];

app.get('/', (req, res) => {
    res.render('index', { stocks });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ WEB NYALA DI PORT ${PORT}`);
});
