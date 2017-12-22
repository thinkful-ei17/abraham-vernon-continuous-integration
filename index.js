const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const blogPostRouter = require('./blogPostRouter.js');

app.use(morgan('dev'));
app.use(express.static('public')); // serve static files
app.use(bodyParser.json()); // parse JSON body
app.use(cors());

app.use('/blog-posts', blogPostRouter);
// Listening for: GET /items
app.get('/', (req, res) => {
    res.send('Home');
});


app.use(function (req, res) {
    res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

app.listen(8080, function () {
    console.info(`Server listening on ${this.address().port}`);
}).on('error', console.error);
