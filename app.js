const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello World!This is Krunal,Hii');
});

app.listen(port, () => {
    console.log(`Web sevices listening at http://localhost:${port}`);
});