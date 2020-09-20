

const express = require('express');

const app = express();

const methodOverride = require('method-override');
app.use(express.static('public'));

app.get('/index', (req,res) => {
    res.render('index.ejs');
})


app.listen(3000, () => {
    console.log('listening');
})