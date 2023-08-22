const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64de62e82c94b904fbdac54e',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Страница не существует.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
