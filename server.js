// import & variables
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Post = require('./models/post');

const PORT = 3000;
const db =
  'mongodb+srv://user:123@cluster0.agr0bqa.mongodb.net/?retryWrites=true&w=majority';
// functions
const createPath = (page) =>
  path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

// connect db
mongoose
  .connect(db)
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
  const contacts = [
    { name: 'YouTube', link: 'http://youtube.com/YauhenKavalchuk' },
    { name: 'Twitter', link: 'http://github.com/YauhenKavalchuk' },
    { name: 'GitHub', link: 'http://twitter.com/YauhenKavalchuk' },
  ];
  res.render(createPath('contacts'), { contacts, title });
});

app.get('/posts/:id', (req, res) => {
  const title = 'Post';
  const post = {
    id: '1',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
    title: 'Post title',
    date: '05.05.2021',
    author: 'Yauhen',
  };
  res.render(createPath('post'), { title, post });
});

app.get('/posts', (req, res) => {
  const title = 'Posts';
  const posts = [
    {
      id: '1',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
      title: 'Post title',
      date: '05.05.2021',
      author: 'Yauhen',
    },
  ];
  res.render(createPath('posts'), { title, posts });
});

app.post('/add-post', (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text });
  post
    .save()
    .then((result) => res.send(result))
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
