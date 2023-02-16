// import & variables
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Post = require('./models/post');
const Contact = require('./models/contact');

const PORT = 3000;
const db =
  'mongodb+srv://user:123@cluster0.agr0bqa.mongodb.net/?retryWrites=true&w=majority';
// functions
const createPath = (page) =>
  path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

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

// express server response

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
  const title = 'Contacts';
  Contact.find()
    .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
    .catch((err) => {
      console.error(err);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/posts/:id', (req, res) => {
  const title = 'Post';
  Post.findById(req.params.id)
    .then((post) => res.render(createPath('post'), { post, title }))
    .catch((err) => {
      console.error(err);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/posts', (req, res) => {
  const title = 'Posts';
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.render(createPath('posts'), { posts, title }))
    .catch((err) => {
      console.error(err);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.post('/add-post', (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text });
  post
    .save()
    .then((result) => res.redirect('/posts'))
    .catch((err) => {
      console.error(err);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/add-post', (req, res) => {
  const title = 'Add post';
  res.render(createPath('add-post'), { title });
});

app.use((req, res) => {
  const title = 'Error Page';
  res.status(404).render(createPath('error'), { title });
});
