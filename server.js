// import & variables
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

const PORT = 3000;
const db =
  'mongodb+srv://user:123@cluster0.agr0bqa.mongodb.net/?retryWrites=true&w=majority';

// connect db
mongoose
  .connect(db, { dbName: 'nodejs-edu' })
  .then((res) => console.log('Connected to db'))
  .catch((err) => console.error(err));

// express
const app = express();
app.set('view engine', 'ejs');
app.listen(PORT, (err) => {
  err ? console.error(err) : console.log(`Listening port ${PORT}`);
});

// express middleware

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.use(express.urlencoded({ extended: false }));

app.use(express.static('styles'));

app.use(methodOverride('_method'));

// express server response

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.use(postRoutes);
app.use(contactRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res.status(404).render(createPath('error'), { title });
});
