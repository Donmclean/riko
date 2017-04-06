'use strict';

//TODO: _export_app should be immutable JS Map
const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(3000);