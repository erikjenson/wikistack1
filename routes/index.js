const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;
const app = express();
const { db } = require('../models');

module.exports = app;

// logging middleware
app.use(require('morgan')('dev'));

// parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//redirect NOT WORKING

app.use('/wiki', require('./wiki'));
app.use('/users', require('./user'));

app.get('/', (req, res, next) => {
  res.redirect('/wiki');
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

db.authenticate().then(() => {
  console.log('connected to the database');
});

const letsGo = async () => {
  await db.sync({ force: false });
};
letsGo();

app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`);
});
